(function () {
  'use strict';

  const { DOMAINS, loadState, saveState, touchStudyStreak, encodeSyncCode, decodeSyncPayload, mergeStates, createDefaultState } = window.CCNAStorage;
  const { getT } = window.CCNAI18n;
  const QUESTIONS = window.CCNA_QUESTIONS || [];
  const BASE_CARDS = window.CCNA_FLASHCARDS || [];
  const { scheduleCard, formatInterval } = window.CCNACardSRS;
  const LABS = window.CCNA_LABS || [];
  const { getPrompt } = window.CCNALabHelpers;
  const SUB = window.CCNASubnetting;
  const ZH = window.CCNA_ZH || { QUESTIONS: {}, FLASHCARDS: {}, LABS: {} };

  let state = loadState();
  let currentView = 'dashboard';
  let deferredInstallPrompt = null;

  // Quiz session state
  let quiz = null;
  let quizTimerHandle = null;

  // Flashcard session state
  let fcQueue = [];
  let fcIndex = 0;

  // Subnetting state
  let currentSubProblem = null;
  let currentV6Problem = null;

  // CLI Lab state
  let activeLab = null;
  let labStepIdx = 0;
  let labDeviceName = 'Router';
  let labMode = 'priv';

  const $ = (id) => document.getElementById(id);

  function t() {
    return getT(state.lang);
  }

  function isZh() {
    return state.lang === 'zh-TW';
  }

  function domainInfo(id) {
    return DOMAINS.find((d) => d.id === id) || DOMAINS[0];
  }

  function domainName(d) {
    return isZh() ? (d.nameZh || d.name) : d.name;
  }

  function domainShort(d) {
    return isZh() ? (d.shortZh || d.short) : d.short;
  }

  function localizeQuestion(q) {
    if (!isZh()) return q;
    const z = ZH.QUESTIONS[q.id];
    if (z) return { ...q, prompt: z.prompt, options: z.options, explanation: z.explanation, tip: z.tip };
    return {
      ...q,
      explanation: q.explanationZh || q.explanation || ''
    };
  }

  function openExhibitModal(src, title) {
    if (!src) return;
    $('exhibit-modal-img').src = src;
    $('exhibit-modal-title').textContent = title || t().exhibitLabel;
    $('exhibit-modal').classList.remove('hidden');
  }

  function localizeCard(card) {
    if (!isZh()) return card;
    const z = ZH.FLASHCARDS[card.id];
    if (!z) return card;
    return { ...card, front: z.front, back: z.back };
  }

  function localizeLab(lab) {
    if (!isZh()) return lab;
    const z = ZH.LABS[lab.id];
    if (!z) return lab;
    return {
      ...lab,
      title: z.title,
      objective: z.objective,
      steps: lab.steps.map((s, idx) => ({
        ...s,
        hint: (z.steps && z.steps[idx]) || s.hint
      }))
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ==================== THEME, LANGUAGE & NAVIGATION ====================
  function applyTheme() {
    const tr = t();
    document.documentElement.setAttribute('data-theme', state.theme);
    const icon = state.theme === 'dark' ? '🌙' : '☀️';
    $('btn-theme-top').textContent = icon;
    $('btn-theme-sidebar').textContent = state.theme === 'dark' ? tr.themeDark : tr.themeLight;
    const meta = $('meta-theme-color');
    if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#0b1120' : '#f1f5f9');
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState(state);
    applyTheme();
  }

  function updateDomainSelectOptions() {
    ['quiz-domain-select', 'fc-domain-filter', 'new-card-domain', 'notes-domain-select'].forEach((selId) => {
      const sel = $(selId);
      Array.from(sel.options).forEach((opt) => {
        if (opt.value === 'all') return;
        const d = domainInfo(opt.value);
        opt.textContent = domainName(d);
      });
    });
  }

  function applyLanguage() {
    const tr = t();
    document.documentElement.setAttribute('lang', isZh() ? 'zh-Hant' : 'en');
    document.title = tr.appTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (tr[key] !== undefined) el.textContent = tr[key];
    });

    $('btn-lang-top').textContent = tr.langSwitch;
    $('btn-lang-sidebar').textContent = tr.langSwitchSidebar;
    $('btn-install-sidebar').textContent = tr.installAppBtn;
    applyTheme();

    // Update dynamic page header
    const vm = tr.views[currentView] || tr.views.dashboard;
    $('page-title').textContent = vm.title;
    $('page-subtitle').textContent = vm.subtitle;

    // Update placeholders & rich HTML blocks
    $('lab-input').placeholder = tr.cliPlaceholder;
    $('notes-textarea').placeholder = tr.notesPlaceholder;
    $('notes-saved-label').textContent = tr.autoSaved;
    $('sync-code-box').placeholder = isZh()
      ? '點擊「複製同步碼」會產生代碼於此，或貼上另一台裝置的同步碼以匯入...'
      : 'Generated sync code appears here — or paste a code from your other device to import...';

    $('sync-samsung-steps').innerHTML = tr.samsungSteps.map((s) => `<li>${s}</li>`).join('');
    $('sync-ipad-steps').innerHTML = tr.ipadSteps.map((s) => `<li>${s}</li>`).join('');

    $('install-modal-title').textContent = tr.modalTitle;
    $('install-modal-desc').textContent = tr.modalDesc;
    $('modal-samsung-title').textContent = tr.modalSamsungTitle;
    $('modal-samsung-body').innerHTML = tr.modalSamsungBody;
    $('modal-ipad-title').textContent = tr.modalIpadTitle;
    $('modal-ipad-body').innerHTML = tr.modalIpadBody;

    updateDomainSelectOptions();
    renderDashboard();
    updateQuizPoolCount();
    if (quiz) renderQuizQuestion();
    renderFlashcard();
    if (currentSubProblem) {
      $('sub-streak-badge').textContent = tr.streakPrefix + state.subnetStats.streak;
      if (!$('sub-breakdown').classList.contains('hidden')) renderBreakdown(currentSubProblem.info);
    }
    runSubnetCalc();
    if (currentV6Problem) renderV6Labels();
    if (activeLab) {
      const locLab = localizeLab(activeLab);
      $('lab-domain-badge').textContent = domainName(domainInfo(activeLab.domain));
      $('lab-title').textContent = locLab.title;
      $('lab-objective').textContent = locLab.objective;
      renderLabList();
      renderLabStep();
    }
  }

  function toggleLanguage() {
    state.lang = isZh() ? 'en' : 'zh-TW';
    saveState(state);
    applyLanguage();
  }

  function switchView(viewId) {
    const tr = t();
    if (!tr.views[viewId]) viewId = 'dashboard';
    currentView = viewId;

    document.querySelectorAll('.view').forEach((el) => el.classList.remove('active'));
    const target = $('view-' + viewId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    $('page-title').textContent = tr.views[viewId].title;
    $('page-subtitle').textContent = tr.views[viewId].subtitle;

    if (viewId === 'dashboard') renderDashboard();
    if (viewId === 'flashcards') rebuildFlashcardQueue();
    if (viewId === 'practice' && !quiz) updateQuizPoolCount();
  }

  // ==================== DASHBOARD ====================
  function getAllCards() {
    return [...BASE_CARDS, ...state.customCards];
  }

  function getDueCards(domainFilter) {
    const now = Date.now();
    return getAllCards().filter((card) => {
      if (domainFilter && domainFilter !== 'all' && card.domain !== domainFilter) return false;
      const p = state.cardProgress[card.id];
      return !p || (p.dueAt || 0) <= now;
    });
  }

  function computeDomainMetrics() {
    return DOMAINS.map((d) => {
      const qs = QUESTIONS.filter((q) => q.domain === d.id);
      let answered = 0;
      let correctCount = 0;
      let attemptsTotal = 0;
      qs.forEach((q) => {
        const st = state.questionStats[q.id];
        if (st && st.attempts > 0) {
          answered++;
          if (st.lastCorrect) correctCount++;
          attemptsTotal += st.attempts;
        }
      });
      const pct = qs.length ? Math.round((correctCount / qs.length) * 100) : 0;
      return {
        ...d,
        totalQuestions: qs.length,
        answered,
        correctCount,
        attemptsTotal,
        masteryPct: pct
      };
    });
  }

  function renderDashboard() {
    const tr = t();
    const metrics = computeDomainMetrics();

    let weightedSum = 0;
    metrics.forEach((m) => {
      weightedSum += (m.masteryPct / 100) * m.weight;
    });
    const readiness = Math.round(weightedSum);

    $('readiness-pct').textContent = readiness + '%';
    $('readiness-ring').style.setProperty('--pct', readiness);
    $('readiness-label').textContent =
      readiness >= 80 ? tr.readinessHigh : readiness >= 45 ? tr.readinessMid : tr.readinessLow;

    $('stat-streak').textContent = (state.streak.count || 0) + (isZh() ? '天' : 'd');

    let totalAttempts = 0;
    let totalCorrect = 0;
    Object.values(state.questionStats).forEach((s) => {
      totalAttempts += s.attempts || 0;
      totalCorrect += s.correct || 0;
    });
    const acc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    $('stat-accuracy').textContent = acc + '%';

    const allCards = getAllCards();
    const masteredCards = allCards.filter((c) => {
      const p = state.cardProgress[c.id];
      return p && p.reps >= 2;
    }).length;
    $('stat-cards-mastered').textContent = masteredCards + '/' + allCards.length;

    const labsDone = LABS.filter((l) => state.labProgress[l.id] && state.labProgress[l.id].completed).length;
    $('stat-labs-done').textContent = labsDone + '/' + LABS.length;

    const dueCount = getDueCards('all').length;
    $('dash-due-count').textContent = dueCount;
    $('sidebar-due-pill').textContent = dueCount;

    $('input-exam-date').value = state.examDate || '';
    updateCountdownUI();

    const grid = $('dashboard-domains');
    grid.innerHTML = '';
    metrics.forEach((m) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'domain-tile';
      btn.innerHTML = `
        <div class="domain-tile-top">
          <span>${escapeHtml(domainName(m))}</span>
          <span class="badge">${m.weight}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${m.masteryPct}%; background:${m.color};"></div>
        </div>
        <div class="muted">${m.correctCount}/${m.totalQuestions} ${escapeHtml(tr.masteredSuffix)} (${m.masteryPct}%)</div>
      `;
      btn.addEventListener('click', () => {
        $('quiz-source-filter').value = 'all';
        $('quiz-domain-select').value = m.id;
        $('quiz-filter-select').value = 'all';
        $('quiz-count-select').value = '10';
        $('quiz-mode-select').value = 'study';
        switchView('practice');
        startQuizSession();
      });
      grid.appendChild(btn);
    });

    const histEl = $('exam-history-list');
    if (!state.examHistory.length) {
      histEl.innerHTML = `<p class="muted">${escapeHtml(tr.noExamsYet)}</p>`;
    } else {
      histEl.innerHTML = '';
      [...state.examHistory].reverse().slice(0, 5).forEach((item) => {
        const pct = Math.round((item.score / item.total) * 100);
        const row = document.createElement('div');
        row.className = 'history-row';
        row.innerHTML = `
          <div>
            <strong>${escapeHtml(item.label || tr.mixedPracticeLabel)}</strong>
            <div class="muted">${new Date(item.date).toLocaleDateString()}</div>
          </div>
          <span class="badge ${pct >= 82 ? 'badge-emerald' : pct >= 65 ? 'badge-amber' : 'badge-cyan'}">${item.score}/${item.total} (${pct}%)</span>
        `;
        histEl.appendChild(row);
      });
    }
  }

  function updateCountdownUI() {
    const tr = t();
    const badge = $('dash-countdown-badge');
    const side = $('sidebar-countdown');
    if (!state.examDate) {
      badge.textContent = tr.setADate;
      side.textContent = tr.examDateNotSet;
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(state.examDate + 'T00:00:00');
    const days = Math.ceil((target - today) / 86400000);
    const text = days > 0 ? days + tr.daysLeft : days === 0 ? tr.examDay : tr.completed;
    badge.textContent = text;
    side.textContent = tr.examPrefix + text;
  }

  // ==================== PRACTICE QUIZZES ====================
  function getFilteredQuestions() {
    const source = $('quiz-source-filter').value;
    const domain = $('quiz-domain-select').value;
    const filter = $('quiz-filter-select').value;

    return QUESTIONS.filter((q) => {
      if (source === 'hot' && !q.isHot) return false;
      if (source === 'mcq' && q.type === 'dragdrop') return false;
      if (source === 'exhibit' && !q.exhibit) return false;
      if (source === 'dragdrop' && q.type !== 'dragdrop') return false;
      if (domain !== 'all' && q.domain !== domain) return false;
      const st = state.questionStats[q.id];
      if (filter === 'unanswered') return !st || !st.attempts;
      if (filter === 'missed') return st && st.attempts > 0 && !st.lastCorrect;
      if (filter === 'bookmarked') return st && st.bookmarked;
      return true;
    });
  }

  function updateQuizPoolCount() {
    const tr = t();
    const pool = getFilteredQuestions();
    const suffix = isZh() ? tr.matchingAvail : (pool.length === 1 ? 'matching question available' : 'matching questions available');
    $('quiz-pool-count').textContent = `${pool.length} ${suffix}`;
    $('btn-start-quiz').disabled = pool.length === 0;
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startQuizSession(overrideQuestions, customLabel) {
    const tr = t();
    const pool = overrideQuestions || getFilteredQuestions();
    if (!pool.length) return;

    const countVal = $('quiz-count-select').value;
    const requestedCount = countVal === 'all' ? pool.length : (Number(countVal) || 10);
    const mode = $('quiz-mode-select').value;
    const selected = overrideQuestions ? pool : shuffle(pool).slice(0, Math.min(requestedCount, pool.length));
    const domainVal = $('quiz-domain-select').value;
    const sourceVal = $('quiz-source-filter').value;
    let label = customLabel;
    if (!label) {
      if (domainVal !== 'all') label = domainName(domainInfo(domainVal));
      else if (sourceVal === 'hot') label = isZh() ? '🔥 熱門必考題練習' : '🔥 Hot Questions Drill';
      else label = mode === 'exam' ? tr.timedExamLabel : tr.mixedPracticeLabel;
    }

    quiz = {
      questions: selected,
      index: 0,
      mode,
      label,
      selections: selected.map(() => []),
      checked: selected.map(() => false),
      revealed: selected.map(() => false),
      secondsLeft: mode === 'exam' ? selected.length * 72 : 0
    };

    $('quiz-setup').classList.add('hidden');
    $('quiz-summary').classList.add('hidden');
    $('quiz-runner').classList.remove('hidden');

    if (quizTimerHandle) clearInterval(quizTimerHandle);
    if (quiz.mode === 'exam') {
      $('quiz-timer-badge').classList.remove('hidden');
      renderTimer();
      quizTimerHandle = setInterval(() => {
        if (!quiz) return;
        quiz.secondsLeft = Math.max(0, quiz.secondsLeft - 1);
        renderTimer();
        if (quiz.secondsLeft === 0) finishQuizSession();
      }, 1000);
    } else {
      $('quiz-timer-badge').classList.add('hidden');
    }

    renderQuizQuestion();
  }

  function renderTimer() {
    const mins = Math.floor(quiz.secondsLeft / 60);
    const secs = quiz.secondsLeft % 60;
    $('quiz-timer-badge').textContent = '⏱ ' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function isQuestionCorrect(q, sel) {
    if (q.type === 'dragdrop') {
      return Array.isArray(sel) && sel.length === 1 && sel[0] === 1;
    }
    if (!sel || !q.answer || sel.length !== q.answer.length) return false;
    const sortedA = [...q.answer].sort((a, b) => a - b);
    const sortedS = [...sel].sort((a, b) => a - b);
    return sortedA.every((v, i) => v === sortedS[i]);
  }

  function renderQuizQuestion() {
    const tr = t();
    const rawQ = quiz.questions[quiz.index];
    const q = localizeQuestion(rawQ);
    const sel = quiz.selections[quiz.index];
    const isChecked = quiz.checked[quiz.index];
    const d = domainInfo(q.domain);

    $('quiz-progress-badge').textContent = isZh()
      ? `第 ${quiz.index + 1} / ${quiz.questions.length} 題`
      : `Question ${quiz.index + 1} / ${quiz.questions.length}`;
    $('quiz-domain-badge').textContent = domainName(d);
    $('quiz-hot-badge').classList.toggle('hidden', !q.isHot);

    const srcParts = [];
    if (q.fullNum) srcParts.push(`Full #${q.fullNum}`);
    if (q.hotNum) srcParts.push(`Hot #${q.hotNum}`);
    const srcBadge = $('quiz-source-badge');
    if (srcParts.length) {
      srcBadge.textContent = srcParts.join(' · ');
      srcBadge.classList.remove('hidden');
    } else {
      srcBadge.classList.add('hidden');
    }

    $('quiz-prompt').textContent = q.prompt;

    const exWrap = $('quiz-exhibit-wrap');
    if (q.exhibit && q.type !== 'dragdrop') {
      $('quiz-exhibit-img').src = q.exhibit;
      exWrap.classList.remove('hidden');
    } else {
      exWrap.classList.add('hidden');
      $('quiz-exhibit-img').removeAttribute('src');
    }

    const st = state.questionStats[q.id];
    $('btn-bookmark-q').textContent = st && st.bookmarked ? tr.bookmarked : tr.bookmark;

    const optContainer = $('quiz-options');
    const ddWrap = $('quiz-dd-wrap');
    optContainer.innerHTML = '';

    if (q.type === 'dragdrop') {
      $('quiz-multi-hint').classList.add('hidden');
      optContainer.classList.add('hidden');
      ddWrap.classList.remove('hidden');
      $('dd-q-img').src = q.qImg || '';
      const isRevealed = Boolean(quiz.revealed && quiz.revealed[quiz.index]) || isChecked;
      $('btn-dd-reveal').classList.toggle('hidden', isRevealed);
      $('dd-a-wrap').classList.toggle('hidden', !isRevealed);
      if (isRevealed) {
        $('dd-a-img').src = q.aImg || '';
      }
      const pickedRight = sel.length === 1 && sel[0] === 1;
      const pickedWrong = sel.length === 1 && sel[0] === 0;
      $('btn-dd-right').classList.toggle('dd-picked-right', pickedRight);
      $('btn-dd-wrong').classList.toggle('dd-picked-wrong', pickedWrong);
      $('btn-dd-right').disabled = isChecked && quiz.mode === 'study';
      $('btn-dd-wrong').disabled = isChecked && quiz.mode === 'study';
    } else {
      ddWrap.classList.add('hidden');
      optContainer.classList.remove('hidden');
      $('quiz-multi-hint').classList.toggle('hidden', q.type !== 'multi');
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        const isSelected = sel.includes(idx);
        if (isSelected) btn.classList.add('selected');

        if (isChecked) {
          if (q.answer.includes(idx)) btn.classList.add('correct');
          else if (isSelected) btn.classList.add('incorrect');
        }

        btn.innerHTML = `<span class="option-key">${letters[idx] || (idx + 1)}</span><span>${escapeHtml(optText)}</span>`;
        btn.disabled = isChecked && quiz.mode === 'study';
        btn.addEventListener('click', () => {
          if (isChecked && quiz.mode === 'study') return;
          if (q.type === 'multi') {
            const pos = quiz.selections[quiz.index].indexOf(idx);
            if (pos >= 0) quiz.selections[quiz.index].splice(pos, 1);
            else quiz.selections[quiz.index].push(idx);
          } else {
            quiz.selections[quiz.index] = [idx];
          }
          renderQuizQuestion();
        });
        optContainer.appendChild(btn);
      });
    }

    $('btn-prev-q').disabled = quiz.index === 0;
    const isLast = quiz.index === quiz.questions.length - 1;

    if (q.type === 'dragdrop') {
      $('btn-submit-q').classList.add('hidden');
      $('btn-next-q').classList.toggle('hidden', isLast);
    } else if (quiz.mode === 'study') {
      $('btn-submit-q').classList.toggle('hidden', isChecked);
      $('btn-submit-q').disabled = sel.length === 0;
      $('btn-next-q').classList.toggle('hidden', !isChecked || isLast);
    } else {
      $('btn-submit-q').classList.add('hidden');
      $('btn-next-q').classList.toggle('hidden', isLast);
    }

    const expBox = $('quiz-explanation');
    if (isChecked) {
      expBox.classList.remove('hidden');
      const ok = isQuestionCorrect(rawQ, sel);
      $('quiz-exp-status').textContent = ok ? tr.correctLabel : tr.incorrectLabel;
      $('quiz-exp-status').style.color = ok ? 'var(--emerald)' : 'var(--danger)';
      $('quiz-exp-text').textContent =
        rawQ.type === 'dragdrop'
          ? (q.explanation || (ok ? tr.ddSelfGradedRight : tr.ddSelfGradedWrong))
          : (q.explanation || '');
      const tipEl = $('quiz-exp-tip');
      if (q.tip) {
        tipEl.textContent = tr.examTipPrefix + q.tip;
        tipEl.classList.remove('hidden');
      } else {
        tipEl.textContent = '';
        tipEl.classList.add('hidden');
      }
    } else {
      expBox.classList.add('hidden');
    }

    renderQuizDots();
  }

  function renderQuizDots() {
    const dots = $('quiz-nav-dots');
    dots.innerHTML = '';
    quiz.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-dot';
      btn.textContent = idx + 1;
      if (idx === quiz.index) btn.classList.add('current');
      if (quiz.checked[idx]) {
        btn.classList.add(isQuestionCorrect(q, quiz.selections[idx]) ? 'is-correct' : 'is-wrong');
      } else if (quiz.selections[idx].length > 0) {
        btn.classList.add('answered');
      }
      btn.addEventListener('click', () => {
        quiz.index = idx;
        renderQuizQuestion();
      });
      dots.appendChild(btn);
    });
  }

  function recordQuestionAnswer(q, sel) {
    const ok = isQuestionCorrect(q, sel);
    const prev = state.questionStats[q.id] || { attempts: 0, correct: 0, bookmarked: false };
    state.questionStats[q.id] = {
      ...prev,
      attempts: prev.attempts + 1,
      correct: prev.correct + (ok ? 1 : 0),
      lastCorrect: ok,
      lastAnsweredAt: Date.now()
    };
    touchStudyStreak(state);
    saveState(state);
    return ok;
  }

  function checkCurrentQuestion() {
    const q = quiz.questions[quiz.index];
    const sel = quiz.selections[quiz.index];
    if (!sel.length) return;
    quiz.checked[quiz.index] = true;
    recordQuestionAnswer(q, sel);
    renderQuizQuestion();
  }

  function finishQuizSession() {
    const tr = t();
    if (quizTimerHandle) clearInterval(quizTimerHandle);
    let score = 0;
    const missed = [];
    const domainTally = {};

    quiz.questions.forEach((q, idx) => {
      const sel = quiz.selections[idx];
      const ok = isQuestionCorrect(q, sel);
      if (!quiz.checked[idx] && sel.length > 0) {
        recordQuestionAnswer(q, sel);
      }
      if (ok) score++;
      else missed.push(q);

      if (!domainTally[q.domain]) domainTally[q.domain] = { ok: 0, total: 0 };
      domainTally[q.domain].total++;
      if (ok) domainTally[q.domain].ok++;
    });

    state.examHistory.push({
      date: new Date().toISOString(),
      label: quiz.label,
      score,
      total: quiz.questions.length
    });
    touchStudyStreak(state);
    saveState(state);

    const pct = Math.round((score / quiz.questions.length) * 100);
    $('quiz-runner').classList.add('hidden');
    $('quiz-summary').classList.remove('hidden');
    $('summary-score-title').textContent = `${tr.scoreLabel}: ${score} / ${quiz.questions.length} (${pct}%)`;
    $('summary-subtitle').textContent = pct >= 82 ? tr.strongPass : tr.keepDrilling;

    const reviewBtn = $('btn-review-missed');
    reviewBtn.classList.toggle('hidden', missed.length === 0);
    reviewBtn.onclick = () => startQuizSession(missed, tr.missedReviewLabel);

    const breakdown = $('summary-domain-breakdown');
    breakdown.innerHTML = '';
    Object.keys(domainTally).forEach((domId) => {
      const d = domainInfo(domId);
      const tVal = domainTally[domId];
      const dpct = Math.round((tVal.ok / tVal.total) * 100);
      const card = document.createElement('div');
      card.className = 'domain-tile';
      card.innerHTML = `
        <div class="domain-tile-top"><span>${escapeHtml(domainName(d))}</span><span>${tVal.ok}/${tVal.total}</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${dpct}%; background:${d.color};"></div></div>
        <div class="muted">${dpct}${escapeHtml(tr.correctPct)}</div>
      `;
      breakdown.appendChild(card);
    });

    quiz = null;
  }

  // ==================== FLASHCARDS ====================
  function rebuildFlashcardQueue() {
    const domain = $('fc-domain-filter').value;
    const mode = $('fc-deck-mode').value;
    if (mode === 'due') {
      fcQueue = getDueCards(domain);
    } else {
      fcQueue = getAllCards().filter((c) => domain === 'all' || c.domain === domain);
    }
    fcIndex = 0;
    renderFlashcard();
  }

  function formatLocalizedInterval(days) {
    if (!isZh()) return formatInterval(days);
    if (!days || days <= 0) return '1 分鐘';
    if (days < 30) return days + ' 天';
    return Math.round(days / 30) + ' 個月';
  }

  function renderFlashcard() {
    const tr = t();
    const cardEl = $('flashcard');
    cardEl.classList.remove('flipped');

    const dueTotal = getDueCards($('fc-domain-filter').value).length;
    $('sidebar-due-pill').textContent = getDueCards('all').length;

    if (!fcQueue.length || fcIndex >= fcQueue.length) {
      $('flashcard').classList.add('hidden');
      $('fc-rating-bar').classList.add('hidden');
      $('fc-empty').classList.remove('hidden');
      $('fc-counter-badge').textContent = tr.cardsRemaining;
      return;
    }

    $('flashcard').classList.remove('hidden');
    $('fc-rating-bar').classList.remove('hidden');
    $('fc-empty').classList.add('hidden');

    const rawCard = fcQueue[fcIndex];
    const card = localizeCard(rawCard);
    const prog = state.cardProgress[card.id];
    const d = domainInfo(card.domain);

    $('fc-counter-badge').textContent = `${fcIndex + 1} / ${fcQueue.length} (${dueTotal} ${tr.dueWord})`;
    $('fc-domain-tag').textContent = domainName(d);
    $('fc-card-status').textContent = prog ? `${isZh() ? '複習' : 'Reps'}: ${prog.reps} · EF ${prog.easeFactor}` : tr.newCardStatus;
    $('fc-front-text').textContent = card.front;
    $('fc-back-text').textContent = card.back;
    $('fc-interval-info').textContent = prog ? tr.lastInterval + formatLocalizedInterval(prog.interval) : tr.firstReview;

    [1, 2, 3, 4].forEach((q) => {
      const sim = scheduleCard(prog, q);
      $('rate-lbl-' + q).textContent = formatLocalizedInterval(sim.interval);
    });
  }

  function rateCurrentCard(quality) {
    if (!fcQueue.length || fcIndex >= fcQueue.length) return;
    const card = fcQueue[fcIndex];
    const nextProg = scheduleCard(state.cardProgress[card.id], quality);
    state.cardProgress[card.id] = nextProg;
    touchStudyStreak(state);
    saveState(state);

    if (quality === 1) {
      fcQueue.push(card);
    }
    fcIndex++;
    renderFlashcard();
  }

  // ==================== SUBNETTING & IPv6 ====================
  function newIPv4Problem() {
    const tr = t();
    const diff = $('sub-difficulty').value;
    currentSubProblem = SUB.generateIPv4Challenge(diff);
    $('sub-target-ip').textContent = `${currentSubProblem.ip}/${currentSubProblem.cidr}`;
    ['ans-network', 'ans-broadcast', 'ans-first', 'ans-last', 'ans-hosts'].forEach((id) => {
      const el = $(id);
      el.value = '';
      el.style.borderColor = '';
    });
    $('sub-breakdown').classList.add('hidden');
    $('sub-streak-badge').textContent = tr.streakPrefix + state.subnetStats.streak;
  }

  function renderBreakdown(info) {
    const box = $('sub-breakdown');
    box.classList.remove('hidden');
    if (isZh()) {
      box.innerHTML = `
        <strong>魔術數字速算法（第 ${info.interestingOctetIdx} 個八位元組）：</strong><br/>
        • 子網路遮罩：<code class="mono">${info.mask}</code> | 萬用字元遮罩：<code class="mono">${info.wildcard}</code><br/>
        • 區塊大小 (Block Size) = <code>256 - ${info.interestingMaskOctet} = ${info.blockSize}</code>（網段起點為 ${info.networkOctetVal}）<br/>
        • 網路位址：<code class="mono">${info.network}</code> | 第一可用主機：<code class="mono">${info.firstHost}</code><br/>
        • 最後可用主機：<code class="mono">${info.lastHost}</code> | 廣播位址：<code class="mono">${info.broadcast}</code><br/>
        • 可用主機數：<code>2^${32 - info.cidr} - 2 = ${info.usableHosts.toLocaleString()}</code>
      `;
    } else {
      box.innerHTML = `
        <strong>Magic Number Breakdown (Octet #${info.interestingOctetIdx}):</strong><br/>
        • Subnet Mask: <code class="mono">${info.mask}</code> | Wildcard: <code class="mono">${info.wildcard}</code><br/>
        • Block Size = <code>256 - ${info.interestingMaskOctet} = ${info.blockSize}</code> (multiples starting at ${info.networkOctetVal})<br/>
        • Network ID: <code class="mono">${info.network}</code> | First Host: <code class="mono">${info.firstHost}</code><br/>
        • Last Host: <code class="mono">${info.lastHost}</code> | Broadcast: <code class="mono">${info.broadcast}</code><br/>
        • Usable Hosts: <code>2^${32 - info.cidr} - 2 = ${info.usableHosts.toLocaleString()}</code>
      `;
    }
  }

  function checkIPv4Answers() {
    const tr = t();
    const info = currentSubProblem.info;
    const checks = [
      { id: 'ans-network', expected: info.network },
      { id: 'ans-broadcast', expected: info.broadcast },
      { id: 'ans-first', expected: info.firstHost },
      { id: 'ans-last', expected: info.lastHost },
      { id: 'ans-hosts', expected: String(info.usableHosts) }
    ];

    let allOk = true;
    checks.forEach((c) => {
      const el = $(c.id);
      const val = el.value.trim();
      const ok = val === c.expected;
      el.style.borderColor = ok ? 'var(--emerald)' : 'var(--danger)';
      if (!ok) allOk = false;
    });

    state.subnetStats.attempted++;
    if (allOk) {
      state.subnetStats.correct++;
      state.subnetStats.streak++;
      state.subnetStats.bestStreak = Math.max(state.subnetStats.bestStreak, state.subnetStats.streak);
    } else {
      state.subnetStats.streak = 0;
    }
    touchStudyStreak(state);
    saveState(state);

    $('sub-streak-badge').textContent = tr.streakPrefix + state.subnetStats.streak;
    renderBreakdown(info);
  }

  function runSubnetCalc() {
    const tr = t();
    const ip = $('calc-ip').value.trim();
    const cidr = Number($('calc-cidr').value);
    const out = $('calc-results');
    if (!SUB.isValidIPv4(ip)) {
      out.innerHTML = `<div class="muted" style="color:var(--danger);">${escapeHtml(tr.invalidIpv4)}</div>`;
      return;
    }
    const info = SUB.analyzeIPv4(ip, cidr);
    const rows = isZh()
      ? [
          ['網路位址 (Network ID)', info.network],
          ['第一個可用主機', info.firstHost],
          ['最後一個可用主機', info.lastHost],
          ['廣播位址 (Broadcast)', info.broadcast],
          ['子網路遮罩', info.mask],
          ['萬用字元遮罩 (Wildcard)', info.wildcard],
          ['可用主機數量', info.usableHosts.toLocaleString()],
          ['區塊大小 (第 ' + info.interestingOctetIdx + ' 八位元組)', String(info.blockSize)],
          ['IP 二進位', info.ipBinary],
          ['遮罩二進位', info.maskBinary]
        ]
      : [
          ['Network ID', info.network],
          ['First Usable Host', info.firstHost],
          ['Last Usable Host', info.lastHost],
          ['Broadcast Address', info.broadcast],
          ['Subnet Mask', info.mask],
          ['Wildcard Mask', info.wildcard],
          ['Usable Hosts', info.usableHosts.toLocaleString()],
          ['Block Size (Octet #' + info.interestingOctetIdx + ')', String(info.blockSize)],
          ['IP Binary', info.ipBinary],
          ['Mask Binary', info.maskBinary]
        ];
    out.innerHTML = rows
      .map(([k, v]) => `<div class="calc-cell"><div class="muted">${k}</div><div class="mono" style="font-weight:700; word-break:break-all;">${v}</div></div>`)
      .join('');
  }

  function renderV6Labels() {
    const tr = t();
    $('v6-task-label').textContent =
      currentV6Problem.mode === 'compress' ? tr.v6CompressPrompt : tr.v6ExpandPrompt;
    $('v6-prompt-addr').textContent = currentV6Problem.promptAddress;
    $('v6-type-badge').textContent = currentV6Problem.typeLabel;
  }

  function newIPv6Problem() {
    currentV6Problem = SUB.generateIPv6Challenge();
    renderV6Labels();
    $('v6-answer-input').value = '';
    $('v6-feedback').classList.add('hidden');
  }

  function checkIPv6Answer() {
    const tr = t();
    const userRaw = $('v6-answer-input').value.trim().toLowerCase();
    const fb = $('v6-feedback');
    fb.classList.remove('hidden');

    const ok = currentV6Problem.mode === 'compress'
      ? userRaw === currentV6Problem.compressed
      : userRaw === currentV6Problem.full;

    fb.innerHTML = ok
      ? `<strong style="color:var(--emerald);">${escapeHtml(tr.v6Match)}</strong><br/>Compressed: <code class="mono">${currentV6Problem.compressed}</code><br/>Expanded: <code class="mono">${currentV6Problem.full}</code>`
      : `<strong style="color:var(--danger);">${escapeHtml(tr.v6NotQuite)}</strong><br/>${escapeHtml(tr.v6Expected)}<code class="mono">${currentV6Problem.expected}</code>`;
  }

  // ==================== CISCO IOS CLI LABS ====================
  function renderLabList() {
    const tr = t();
    const list = $('lab-list');
    list.innerHTML = '';
    LABS.forEach((rawLab) => {
      const lab = localizeLab(rawLab);
      const done = state.labProgress[lab.id] && state.labProgress[lab.id].completed;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lab-item' + (activeLab && activeLab.id === lab.id ? ' active' : '');
      btn.innerHTML = `
        <div>
          <div style="font-weight:700;">${escapeHtml(lab.title)}</div>
          <div class="muted">${escapeHtml(domainShort(domainInfo(lab.domain)))} · ${lab.steps.length} ${escapeHtml(tr.stepsUnit)}</div>
        </div>
        <span>${done ? '✅' : '▶'}</span>
      `;
      btn.addEventListener('click', () => startLab(lab.id));
      list.appendChild(btn);
    });
  }

  function appendTerminal(text, cls) {
    const term = $('lab-terminal');
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    term.appendChild(div);
    term.scrollTop = term.scrollHeight;
  }

  function startLab(labId) {
    const rawLab = LABS.find((l) => l.id === labId) || LABS[0];
    activeLab = rawLab;
    const lab = localizeLab(rawLab);
    labStepIdx = 0;
    labDeviceName = rawLab.device;
    labMode = rawLab.initialMode;

    $('lab-domain-badge').textContent = domainName(domainInfo(rawLab.domain));
    $('lab-title').textContent = lab.title;
    $('lab-objective').textContent = lab.objective;
    const topoWrap = $('lab-topo-wrap');
    if (rawLab.topology) {
      $('lab-topo-img').src = rawLab.topology;
      topoWrap.classList.remove('hidden');
    } else {
      topoWrap.classList.add('hidden');
      $('lab-topo-img').removeAttribute('src');
    }
    $('lab-terminal').innerHTML = '';
    appendTerminal(
      isZh()
        ? `已連線至 ${labDeviceName} 主控台。輸入 "?" 可查看目前步驟提示。`
        : `Connected to ${labDeviceName} console. Type "?" for current step hint.`,
      'muted'
    );

    renderLabList();
    renderLabStep();
  }

  function renderLabStep() {
    const tr = t();
    const lab = localizeLab(activeLab);
    $('lab-prompt').textContent = getPrompt(labDeviceName, labMode);
    const chipsBox = $('lab-chips');
    chipsBox.innerHTML = '';

    if (labStepIdx >= lab.steps.length) {
      $('lab-step-progress').textContent = tr.labComplete;
      $('lab-step-hint').textContent = tr.labVerifiedOn + labDeviceName + '.';
      return;
    }

    const step = lab.steps[labStepIdx];
    $('lab-step-progress').textContent = `${tr.stepWord} ${labStepIdx + 1} ${tr.ofWord} ${lab.steps.length}`;
    $('lab-step-hint').textContent = step.hint;

    (step.chips || []).forEach((chipText) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip-btn';
      chip.textContent = chipText;
      chip.addEventListener('click', () => {
        $('lab-input').value = chipText;
        $('lab-input').focus();
      });
      chipsBox.appendChild(chip);
    });
  }

  function submitLabCommand(raw) {
    const cmd = raw.trim();
    if (!cmd || !activeLab) return;
    const lab = localizeLab(activeLab);
    appendTerminal(`${getPrompt(labDeviceName, labMode)} ${cmd}`, 'term-line-cmd');

    if (cmd === '?') {
      const step = lab.steps[labStepIdx];
      appendTerminal(
        step
          ? (isZh() ? `提示：${step.hint}（例如：${step.chips[0]}）` : `Hint: ${step.hint} (e.g. ${step.chips[0]})`)
          : (isZh() ? '此實驗已完成！' : 'Lab already complete!'),
        'term-line-ok'
      );
      return;
    }

    if (labStepIdx >= lab.steps.length) {
      appendTerminal(isZh() ? '% 實驗已完成。請選擇其他實驗或點擊「重設實驗」。' : '% Lab already complete. Select another lab or tap Reset Lab.', 'muted');
      return;
    }

    const step = lab.steps[labStepIdx];
    const matched = step.accepted.some((rx) => rx.test(cmd));
    if (matched) {
      if (step.renameDevice) labDeviceName = step.renameDevice;
      labMode = step.nextMode;
      if (step.output) appendTerminal(step.output, 'term-line-ok');
      labStepIdx++;
      if (labStepIdx >= lab.steps.length) {
        appendTerminal(`%SYS-5-CONFIG_I: ${lab.title} ${isZh() ? '已完成！' : 'completed!'}`, 'term-line-ok');
        state.labProgress[activeLab.id] = { completed: true, completedAt: Date.now() };
        touchStudyStreak(state);
        saveState(state);
        renderLabList();
      }
      renderLabStep();
    } else {
      appendTerminal(
        isZh() ? `% 指令不符或步驟順序有誤，目前預期：${step.hint}` : `% Invalid input or wrong step. Expected: ${step.hint}`,
        'term-line-err'
      );
    }
  }

  // ==================== SYNC & NOTES ====================
  function renderNotesEditor() {
    const dom = $('notes-domain-select').value;
    $('notes-textarea').value = state.notes[dom] || '';
  }

  function setSyncMsg(msg, isError) {
    const el = $('sync-status-msg');
    el.textContent = msg;
    el.style.color = isError ? 'var(--danger)' : 'var(--emerald)';
  }

  function handleImportText(rawText, mode) {
    const tr = t();
    try {
      const incoming = decodeSyncPayload(rawText);
      state = mode === 'merge' ? mergeStates(state, incoming) : incoming;
      saveState(state);
      applyLanguage();
      renderNotesEditor();
      setSyncMsg(mode === 'merge' ? tr.syncMerged : tr.syncReplaced, false);
    } catch (err) {
      setSyncMsg((isZh() ? '匯入失敗：' : 'Import failed: ') + err.message, true);
    }
  }

  // ==================== INIT & EVENTS ====================
  function populateDomainSelects() {
    DOMAINS.forEach((d) => {
      ['quiz-domain-select', 'fc-domain-filter', 'new-card-domain', 'notes-domain-select'].forEach((id) => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = domainName(d);
        $(id).appendChild(opt);
      });
    });
    for (let c = 8; c <= 32; c++) {
      const opt = document.createElement('option');
      opt.value = String(c);
      opt.textContent = '/' + c;
      if (c === 26) opt.selected = true;
      $('calc-cidr').appendChild(opt);
    }
  }

  function bindEvents() {
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    $('btn-sync-top').addEventListener('click', () => switchView('sync'));
    $('btn-go-sync-from-dash').addEventListener('click', () => switchView('sync'));

    $('btn-theme-top').addEventListener('click', toggleTheme);
    $('btn-theme-sidebar').addEventListener('click', toggleTheme);
    $('btn-lang-top').addEventListener('click', toggleLanguage);
    $('btn-lang-sidebar').addEventListener('click', toggleLanguage);

    const openInstallModal = () => $('install-modal').classList.remove('hidden');
    $('btn-install-top').addEventListener('click', openInstallModal);
    $('btn-install-sidebar').addEventListener('click', openInstallModal);
    $('btn-close-modal').addEventListener('click', () => $('install-modal').classList.add('hidden'));
    $('install-modal').addEventListener('click', (e) => {
      if (e.target.id === 'install-modal') $('install-modal').classList.add('hidden');
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      $('btn-native-install').classList.remove('hidden');
    });

    $('btn-native-install').addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $('btn-native-install').classList.add('hidden');
      $('install-modal').classList.add('hidden');
    });

    $('btn-quick-quiz').addEventListener('click', () => {
      $('quiz-source-filter').value = 'all';
      $('quiz-domain-select').value = 'all';
      $('quiz-filter-select').value = 'all';
      $('quiz-count-select').value = '10';
      $('quiz-mode-select').value = 'study';
      switchView('practice');
      startQuizSession();
    });

    $('btn-hot-quiz').addEventListener('click', () => {
      $('quiz-source-filter').value = 'hot';
      $('quiz-domain-select').value = 'all';
      $('quiz-filter-select').value = 'all';
      $('quiz-count-select').value = '10';
      $('quiz-mode-select').value = 'study';
      switchView('practice');
      startQuizSession();
    });

    $('btn-weak-drill').addEventListener('click', () => {
      const metrics = computeDomainMetrics().sort((a, b) => a.masteryPct - b.masteryPct);
      $('quiz-source-filter').value = 'all';
      $('quiz-domain-select').value = metrics[0].id;
      $('quiz-filter-select').value = 'all';
      $('quiz-count-select').value = '10';
      $('quiz-mode-select').value = 'study';
      switchView('practice');
      startQuizSession();
    });

    $('btn-due-cards').addEventListener('click', () => switchView('flashcards'));

    $('input-exam-date').addEventListener('change', (e) => {
      state.examDate = e.target.value;
      saveState(state);
      updateCountdownUI();
    });

    ['quiz-source-filter', 'quiz-domain-select', 'quiz-filter-select'].forEach((id) => {
      $(id).addEventListener('change', updateQuizPoolCount);
    });
    $('btn-start-quiz').addEventListener('click', () => startQuizSession());
    $('btn-submit-q').addEventListener('click', checkCurrentQuestion);

    $('btn-dd-reveal').addEventListener('click', () => {
      if (!quiz) return;
      quiz.revealed[quiz.index] = true;
      renderQuizQuestion();
    });
    const gradeDragDrop = (isRight) => {
      if (!quiz) return;
      const q = quiz.questions[quiz.index];
      if (quiz.checked[quiz.index] && quiz.mode === 'study') return;
      quiz.revealed[quiz.index] = true;
      quiz.selections[quiz.index] = [isRight ? 1 : 0];
      if (quiz.mode === 'study') {
        quiz.checked[quiz.index] = true;
        recordQuestionAnswer(q, quiz.selections[quiz.index]);
      }
      renderQuizQuestion();
    };
    $('btn-dd-right').addEventListener('click', () => gradeDragDrop(true));
    $('btn-dd-wrong').addEventListener('click', () => gradeDragDrop(false));

    $('quiz-exhibit-img').addEventListener('click', () => openExhibitModal($('quiz-exhibit-img').src, t().exhibitLabel));
    $('dd-q-img').addEventListener('click', () => openExhibitModal($('dd-q-img').src, t().ddPromptLabel));
    $('dd-a-img').addEventListener('click', () => openExhibitModal($('dd-a-img').src, t().ddAnswerLabel));
    $('lab-topo-img').addEventListener('click', () => openExhibitModal($('lab-topo-img').src, t().labTopoLabel));
    $('btn-close-exhibit').addEventListener('click', () => $('exhibit-modal').classList.add('hidden'));
    $('exhibit-modal').addEventListener('click', (e) => {
      if (e.target.id === 'exhibit-modal') $('exhibit-modal').classList.add('hidden');
    });
    $('btn-prev-q').addEventListener('click', () => {
      if (quiz && quiz.index > 0) {
        quiz.index--;
        renderQuizQuestion();
      }
    });
    $('btn-next-q').addEventListener('click', () => {
      if (quiz && quiz.index < quiz.questions.length - 1) {
        quiz.index++;
        renderQuizQuestion();
      }
    });
    $('btn-bookmark-q').addEventListener('click', () => {
      if (!quiz) return;
      const q = quiz.questions[quiz.index];
      const prev = state.questionStats[q.id] || { attempts: 0, correct: 0, bookmarked: false };
      state.questionStats[q.id] = { ...prev, bookmarked: !prev.bookmarked };
      saveState(state);
      renderQuizQuestion();
    });
    $('btn-finish-quiz').addEventListener('click', finishQuizSession);
    $('btn-quit-quiz').addEventListener('click', () => {
      if (quizTimerHandle) clearInterval(quizTimerHandle);
      quiz = null;
      $('quiz-runner').classList.add('hidden');
      $('quiz-setup').classList.remove('hidden');
      updateQuizPoolCount();
    });
    $('btn-new-quiz').addEventListener('click', () => {
      $('quiz-summary').classList.add('hidden');
      $('quiz-setup').classList.remove('hidden');
      updateQuizPoolCount();
    });

    $('flashcard').addEventListener('click', () => $('flashcard').classList.toggle('flipped'));
    $('fc-domain-filter').addEventListener('change', rebuildFlashcardQueue);
    $('fc-deck-mode').addEventListener('change', rebuildFlashcardQueue);
    document.querySelectorAll('.rate-btn').forEach((btn) => {
      btn.addEventListener('click', () => rateCurrentCard(Number(btn.dataset.rate)));
    });
    $('btn-fc-browse-all').addEventListener('click', () => {
      $('fc-deck-mode').value = 'all';
      rebuildFlashcardQueue();
    });
    $('btn-open-add-card').addEventListener('click', () => $('fc-add-panel').classList.remove('hidden'));
    $('btn-close-add-card').addEventListener('click', () => $('fc-add-panel').classList.add('hidden'));
    $('btn-save-custom-card').addEventListener('click', () => {
      const front = $('new-card-front').value.trim();
      const back = $('new-card-back').value.trim();
      const domain = $('new-card-domain').value;
      if (!front || !back) return;
      state.customCards.push({
        id: 'custom-' + Date.now(),
        domain,
        front,
        back
      });
      saveState(state);
      $('new-card-front').value = '';
      $('new-card-back').value = '';
      $('fc-add-panel').classList.add('hidden');
      rebuildFlashcardQueue();
    });

    document.addEventListener('keydown', (e) => {
      if (currentView !== 'flashcards' || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        $('flashcard').classList.toggle('flipped');
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        rateCurrentCard(Number(e.key));
      }
    });

    document.querySelectorAll('.subtab').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.subtab').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.subtab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        $('subtab-' + btn.dataset.subtab).classList.add('active');
      });
    });
    $('sub-difficulty').addEventListener('change', newIPv4Problem);
    $('btn-sub-next').addEventListener('click', newIPv4Problem);
    $('btn-sub-check').addEventListener('click', checkIPv4Answers);
    $('btn-sub-reveal').addEventListener('click', () => renderBreakdown(currentSubProblem.info));
    $('btn-calc-run').addEventListener('click', runSubnetCalc);
    $('btn-v6-next').addEventListener('click', newIPv6Problem);
    $('btn-v6-check').addEventListener('click', checkIPv6Answer);
    $('btn-v6-reveal').addEventListener('click', () => {
      const tr = t();
      const fb = $('v6-feedback');
      fb.classList.remove('hidden');
      fb.innerHTML = `${escapeHtml(tr.v6Expected)}<code class="mono">${currentV6Problem.expected}</code>`;
    });

    $('lab-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = $('lab-input').value;
      $('lab-input').value = '';
      submitLabCommand(val);
    });
    $('btn-lab-reset').addEventListener('click', () => {
      if (activeLab) startLab(activeLab.id);
    });

    $('btn-gen-sync-code').addEventListener('click', async () => {
      const tr = t();
      const code = encodeSyncCode(state);
      $('sync-code-box').value = code;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(code);
          setSyncMsg(tr.syncCopied, false);
        } else {
          setSyncMsg(tr.syncGenerated, false);
        }
      } catch {
        setSyncMsg(tr.syncGenerated, false);
      }
    });

    $('btn-export-json').addEventListener('click', () => {
      const tr = t();
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ccna-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSyncMsg(tr.syncJsonDownloaded, false);
    });

    $('btn-import-merge').addEventListener('click', () => handleImportText($('sync-code-box').value, 'merge'));
    $('btn-import-replace').addEventListener('click', () => handleImportText($('sync-code-box').value, 'replace'));

    $('input-import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        $('sync-code-box').value = reader.result;
        handleImportText(reader.result, 'merge');
      };
      reader.readAsText(file);
    });

    $('notes-domain-select').addEventListener('change', renderNotesEditor);
    $('notes-textarea').addEventListener('input', (e) => {
      const tr = t();
      const dom = $('notes-domain-select').value;
      state.notes[dom] = e.target.value;
      saveState(state);
      $('notes-saved-label').textContent = tr.savedAt + new Date().toLocaleTimeString();
    });

    $('btn-reset-all').addEventListener('click', () => {
      const tr = t();
      if (!confirm(tr.resetConfirm)) return;
      const keepLang = state.lang;
      state = createDefaultState();
      state.lang = keepLang;
      saveState(state);
      applyLanguage();
      renderNotesEditor();
      setSyncMsg(tr.syncResetDone, false);
    });
  }

  function registerSW() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('SW registration skipped:', err));
    }
  }

  function init() {
    populateDomainSelects();
    bindEvents();
    newIPv4Problem();
    newIPv6Problem();
    startLab(LABS[0].id);
    renderNotesEditor();
    applyLanguage();
    registerSW();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
