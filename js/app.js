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
  const KWS = window.CCNA_KW || [];
  const GRAPH = window.CCNA_GRAPH || { nodes: [], edges: [] };
  const ZH = window.CCNA_ZH || { QUESTIONS: {}, FLASHCARDS: {}, LABS: {} };

  let state = loadState();
  let currentView = 'dashboard';
  let deferredInstallPrompt = null;

  // Quiz session state
  let quiz = null;
  let quizTimerHandle = null;
  let kwReturnToQuiz = false;

  // Knowledge Point (KW) & All-in-one Graph state
  let activeKwId = KWS.length ? KWS[0].id : null;
  let activeGraphNodeId = GRAPH.nodes.length ? GRAPH.nodes[0].id : null;
  let graphDomainFilter = 'all';
  let graphLocalOnly = false;
  let graphShowEdgeLabels = true;
  let graphInited = false;
  let graphCam = { x: 0, y: 0, scale: 1 };
  let graphNodesSim = [];
  let graphAnimFrame = null;

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
    setImgSrc($('exhibit-modal-img'), src);
    $('exhibit-modal-title').textContent = title || t().exhibitLabel;
    $('exhibit-modal').classList.remove('hidden');
  }

  function setImgSrc(imgEl, src, errWrapEl, errTextEl) {
    if (!imgEl) return;
    if (errWrapEl) errWrapEl.classList.add('hidden');
    if (!src) {
      imgEl.removeAttribute('src');
      return;
    }
    imgEl.dataset.baseSrc = src;
    imgEl.dataset.retried = '';
    imgEl.onerror = () => {
      if (!imgEl.dataset.retried) {
        imgEl.dataset.retried = '1';
        imgEl.src = src + (src.includes('?') ? '&' : '?') + 'v=4';
        return;
      }
      if (errWrapEl && errTextEl) {
        errTextEl.textContent = (isZh() ? '無法載入圖片：' : 'Image failed to load: ') + src;
        errWrapEl.classList.remove('hidden');
      }
    };
    imgEl.onload = () => {
      if (errWrapEl) errWrapEl.classList.add('hidden');
    };
    imgEl.decoding = 'async';
    imgEl.src = src;
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
    ['quiz-domain-select', 'fc-domain-filter', 'new-card-domain', 'notes-domain-select', 'kw-domain-select'].forEach((selId) => {
      const sel = $(selId);
      if (!sel) return;
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
    if ($('kw-search-input')) $('kw-search-input').placeholder = tr.kwSearchPlaceholder;
    if ($('graph-search-input')) $('graph-search-input').placeholder = tr.graphSearchPlaceholder;
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
    populateKwChapterSelect();
    renderKwList();
    renderKwDetail();
    renderGraphDomainPills();
    renderGraphInspector();
    if (currentView === 'graph') requestGraphDraw();
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
    if (viewId === 'kw') {
      $('btn-kw-back-quiz').classList.toggle('hidden', !(kwReturnToQuiz && quiz));
      renderKwList();
      renderKwDetail();
    }
    if (viewId === 'graph') {
      initGraphIfNeeded();
      resizeGraphCanvas();
      requestGraphDraw();
      renderGraphInspector();
    }
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
      exWrap.classList.remove('hidden');
      setImgSrc($('quiz-exhibit-img'), q.exhibit, $('quiz-exhibit-error'), $('quiz-exhibit-error-text'));
    } else {
      exWrap.classList.add('hidden');
      setImgSrc($('quiz-exhibit-img'), '');
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
      setImgSrc($('dd-q-img'), q.qImg || '');
      const isRevealed = Boolean(quiz.revealed && quiz.revealed[quiz.index]) || isChecked;
      $('btn-dd-reveal').classList.toggle('hidden', isRevealed);
      $('dd-a-wrap').classList.toggle('hidden', !isRevealed);
      if (isRevealed) {
        setImgSrc($('dd-a-img'), q.aImg || '');
      } else {
        setImgSrc($('dd-a-img'), '');
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

      const kwWrap = $('quiz-kw-wrap');
      const kwLinks = $('quiz-kw-links');
      kwLinks.innerHTML = '';
      const matchedKws = (rawQ.kwIds || []).map((kid) => KWS.find((k) => k.id === kid)).filter(Boolean);
      if (matchedKws.length) {
        matchedKws.forEach((kw) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'kw-chip-btn';
          const label = isZh() ? (kw.titleZh || kw.title) : kw.title;
          btn.textContent = `[${kw.id.toUpperCase()}] ${label} ↗`;
          btn.addEventListener('click', () => {
            kwReturnToQuiz = true;
            openKnowledgePoint(kw.id);
          });
          kwLinks.appendChild(btn);
        });
        kwWrap.classList.remove('hidden');
      } else {
        kwWrap.classList.add('hidden');
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
      topoWrap.classList.remove('hidden');
      setImgSrc($('lab-topo-img'), rawLab.topology);
    } else {
      topoWrap.classList.add('hidden');
      setImgSrc($('lab-topo-img'), '');
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

  // ==================== KNOWLEDGE POINT (KW) & OBSIDIAN MAP ====================
  function getKwById(id) {
    return KWS.find((k) => k.id === id) || KWS[0] || null;
  }

  function populateKwChapterSelect() {
    const sel = $('kw-chapter-select');
    if (!sel) return;
    const prev = sel.value || 'all';
    const tr = t();
    sel.innerHTML = `<option value="all">${escapeHtml(tr.kwAllChapters)}</option>`;
    const seen = new Map();
    KWS.forEach((kw) => {
      if (!seen.has(kw.chapter)) {
        seen.set(kw.chapter, isZh() ? (kw.chapterLabelZh || kw.chapterLabel || kw.chapter) : (kw.chapterLabel || kw.chapter));
      }
    });
    seen.forEach((lbl, ch) => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = lbl;
      sel.appendChild(opt);
    });
    sel.value = seen.has(prev) ? prev : 'all';
  }

  function getFilteredKws() {
    const query = ($('kw-search-input') ? $('kw-search-input').value : '').trim().toLowerCase();
    const chap = $('kw-chapter-select') ? $('kw-chapter-select').value : 'all';
    const dom = $('kw-domain-select') ? $('kw-domain-select').value : 'all';
    return KWS.filter((kw) => {
      if (chap !== 'all' && kw.chapter !== chap) return false;
      if (dom !== 'all' && kw.domain !== dom) return false;
      if (!query) return true;
      const hay = [
        kw.id,
        kw.chapter,
        kw.title,
        kw.titleZh || '',
        kw.summary,
        kw.summaryZh || '',
        ...(kw.bullets || []),
        ...(kw.bulletsZh || []),
        ...(kw.commands || [])
      ].join(' ').toLowerCase();
      return hay.includes(query);
    });
  }

  function renderKwList() {
    const list = $('kw-list');
    if (!list) return;
    const items = getFilteredKws();
    const reviewedCount = KWS.filter((k) => state.kwReviewed && state.kwReviewed[k.id]).length;
    if ($('kw-progress-badge')) {
      $('kw-progress-badge').textContent = isZh()
        ? `已溫習 ${reviewedCount} / ${KWS.length}`
        : `${reviewedCount} / ${KWS.length} Reviewed`;
    }

    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = `<div class="muted" style="padding:12px;">${isZh() ? '找不到符合條件的知識點。' : 'No matching knowledge points.'}</div>`;
      return;
    }

    items.forEach((kw) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kw-item' + (activeKwId === kw.id ? ' active' : '');
      const done = Boolean(state.kwReviewed && state.kwReviewed[kw.id]);
      const d = domainInfo(kw.domain);
      const title = isZh() ? (kw.titleZh || kw.title) : kw.title;
      btn.innerHTML = `
        <div>
          <div class="kw-item-title">${escapeHtml(title)}</div>
          <div class="kw-item-meta">${escapeHtml(kw.id.toUpperCase())} · ${escapeHtml(kw.chapter)} · ${escapeHtml(domainShort(d))}</div>
        </div>
        <span>${done ? '✅' : '▸'}</span>
      `;
      btn.addEventListener('click', () => {
        activeKwId = kw.id;
        renderKwList();
        renderKwDetail();
      });
      list.appendChild(btn);
    });
  }

  function renderKwDetail() {
    const tr = t();
    const kw = getKwById(activeKwId);
    if (!kw) return;
    activeKwId = kw.id;
    const d = domainInfo(kw.domain);

    $('kw-detail-id').textContent = kw.id.toUpperCase();
    $('kw-detail-chapter').textContent = isZh() ? (kw.chapterLabelZh || kw.chapter) : (kw.chapterLabel || kw.chapter);
    $('kw-detail-domain').textContent = domainName(d);
    $('kw-detail-domain').style.borderColor = d.color;
    $('kw-detail-title').textContent = isZh() ? (kw.titleZh || kw.title) : kw.title;
    $('kw-detail-summary').textContent = isZh() ? (kw.summaryZh || kw.summary) : kw.summary;

    const done = Boolean(state.kwReviewed && state.kwReviewed[kw.id]);
    $('btn-kw-mark').textContent = done ? tr.kwReviewedDone : tr.kwMarkReviewed;
    $('btn-kw-mark').classList.toggle('btn-primary', done);
    $('btn-kw-mark').classList.toggle('btn-secondary', !done);

    const bullets = isZh() && kw.bulletsZh && kw.bulletsZh.length ? kw.bulletsZh : (kw.bullets || []);
    $('kw-detail-bullets').innerHTML = bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('');

    const cmdWrap = $('kw-detail-cmd-wrap');
    if (kw.commands && kw.commands.length) {
      $('kw-detail-cmd').textContent = kw.commands.join('\n');
      cmdWrap.classList.remove('hidden');
    } else {
      cmdWrap.classList.add('hidden');
    }

    const trapWrap = $('kw-detail-trap-wrap');
    const trapTxt = isZh() ? (kw.trapZh || kw.trap || '') : (kw.trap || '');
    if (trapTxt) {
      $('kw-detail-trap').textContent = trapTxt;
      trapWrap.classList.remove('hidden');
    } else {
      trapWrap.classList.add('hidden');
    }

    const linksBox = $('kw-detail-links');
    linksBox.innerHTML = '';
    const edges = (GRAPH.edges || []).filter((e) => e.source === kw.id || e.target === kw.id);
    edges.forEach((e) => {
      const otherId = e.source === kw.id ? e.target : e.source;
      const other = getKwById(otherId);
      if (!other) return;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'kw-chip-btn';
      const oTitle = isZh() ? (other.titleZh || other.title) : other.title;
      const rel = isZh() ? (e.relZh || e.rel) : e.rel;
      chip.textContent = `${oTitle} (${rel})`;
      chip.addEventListener('click', () => {
        activeKwId = other.id;
        renderKwList();
        renderKwDetail();
      });
      linksBox.appendChild(chip);
    });

    const relatedQs = QUESTIONS.filter((q) => Array.isArray(q.kwIds) && q.kwIds.includes(kw.id));
    $('kw-related-q-count').textContent = isZh()
      ? `${relatedQs.length} 道相關模擬試題`
      : `${relatedQs.length} related exam question(s)`;
    $('btn-kw-practice').disabled = relatedQs.length === 0;
  }

  function openKnowledgePoint(kwId) {
    activeKwId = kwId;
    switchView('kw');
    const activeBtn = $('kw-list') && $('kw-list').querySelector('.kw-item.active');
    if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest' });
  }

  function launchKwPractice(kwId) {
    const related = QUESTIONS.filter((q) => Array.isArray(q.kwIds) && q.kwIds.includes(kwId));
    if (!related.length) return;
    const kw = getKwById(kwId);
    const label = kw ? `[${kw.id.toUpperCase()}] ${isZh() ? (kw.titleZh || kw.title) : kw.title}` : 'KW Drill';
    kwReturnToQuiz = false;
    switchView('practice');
    startQuizSession(shuffle(related).slice(0, Math.min(25, related.length)), label);
  }

  function initGraphIfNeeded() {
    if (graphInited || !GRAPH.nodes || !GRAPH.nodes.length) return;
    graphInited = true;

    const clusterCenters = {
      fundamentals: { x: -240, y: -150 },
      access: { x: 0, y: -210 },
      connectivity: { x: 240, y: -140 },
      services: { x: 240, y: 150 },
      security: { x: 0, y: 210 },
      automation: { x: -240, y: 150 }
    };

    const grouped = {};
    GRAPH.nodes.forEach((n) => {
      if (!grouped[n.domain]) grouped[n.domain] = [];
      grouped[n.domain].push(n);
    });

    graphNodesSim = GRAPH.nodes.map((n) => {
      const list = grouped[n.domain] || [n];
      const idx = list.indexOf(n);
      const angle = (idx / Math.max(1, list.length)) * Math.PI * 2;
      const rad = 75 + (idx % 2) * 52;
      const center = clusterCenters[n.domain] || { x: 0, y: 0 };
      return {
        ...n,
        x: center.x + Math.cos(angle) * rad,
        y: center.y + Math.sin(angle) * rad,
        vx: 0,
        vy: 0,
        r: 9 + Math.min(8, (n.importance || 1) * 2.5)
      };
    });

    // Run 90 lightweight force ticks to separate nodes cleanly before first paint
    for (let step = 0; step < 90; step++) {
      for (let i = 0; i < graphNodesSim.length; i++) {
        for (let j = i + 1; j < graphNodesSim.length; j++) {
          const a = graphNodesSim[i];
          const b = graphNodesSim[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d2 = dx * dx + dy * dy + 1;
          const repulse = 1900 / d2;
          const invD = 1 / Math.sqrt(d2);
          a.vx -= dx * invD * repulse;
          a.vy -= dy * invD * repulse;
          b.vx += dx * invD * repulse;
          b.vy += dy * invD * repulse;
        }
      }
      (GRAPH.edges || []).forEach((e) => {
        const a = graphNodesSim.find((n) => n.id === e.source);
        const b = graphNodesSim.find((n) => n.id === e.target);
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const spring = (dist - 125) * 0.028;
        a.vx += (dx / dist) * spring;
        a.vy += (dy / dist) * spring;
        b.vx -= (dx / dist) * spring;
        b.vy -= (dy / dist) * spring;
      });
      graphNodesSim.forEach((n) => {
        const center = clusterCenters[n.domain] || { x: 0, y: 0 };
        n.vx += (center.x - n.x) * 0.012;
        n.vy += (center.y - n.y) * 0.012;
        n.x += Math.max(-8, Math.min(8, n.vx * 0.55));
        n.y += Math.max(-8, Math.min(8, n.vy * 0.55));
        n.vx *= 0.65;
        n.vy *= 0.65;
      });
    }

    renderGraphDomainPills();
    bindGraphCanvasEvents();
  }

  function renderGraphDomainPills() {
    const box = $('graph-domain-pills');
    if (!box) return;
    const tr = t();
    box.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'graph-pill' + (graphDomainFilter === 'all' ? ' active' : '');
    allBtn.textContent = tr.allDomains;
    allBtn.addEventListener('click', () => {
      graphDomainFilter = 'all';
      renderGraphDomainPills();
      requestGraphDraw();
    });
    box.appendChild(allBtn);

    DOMAINS.forEach((d) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'graph-pill' + (graphDomainFilter === d.id ? ' active' : '');
      btn.innerHTML = `<span class="graph-pill-dot" style="background:${d.color};"></span><span>${escapeHtml(domainShort(d))}</span>`;
      btn.addEventListener('click', () => {
        graphDomainFilter = d.id;
        renderGraphDomainPills();
        requestGraphDraw();
      });
      box.appendChild(btn);
    });
  }

  function resizeGraphCanvas() {
    const canvas = $('knowledge-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
  }

  function getVisibleGraphIds() {
    const query = ($('graph-search-input') ? $('graph-search-input').value : '').trim().toLowerCase();
    const neighborIds = new Set([activeGraphNodeId]);
    (GRAPH.edges || []).forEach((e) => {
      if (e.source === activeGraphNodeId) neighborIds.add(e.target);
      if (e.target === activeGraphNodeId) neighborIds.add(e.source);
    });
    const visible = new Set();
    graphNodesSim.forEach((n) => {
      if (graphDomainFilter !== 'all' && n.domain !== graphDomainFilter && !neighborIds.has(n.id)) return;
      if (graphLocalOnly && !neighborIds.has(n.id)) return;
      if (query) {
        const kw = getKwById(n.id);
        const txt = [n.id, n.label, n.labelZh || '', kw ? kw.title : '', kw ? (kw.titleZh || '') : ''].join(' ').toLowerCase();
        if (!txt.includes(query)) return;
      }
      visible.add(n.id);
    });
    return { visible, neighborIds };
  }

  function requestGraphDraw() {
    if (graphAnimFrame) cancelAnimationFrame(graphAnimFrame);
    graphAnimFrame = requestAnimationFrame(drawKnowledgeGraph);
  }

  function drawKnowledgeGraph() {
    const canvas = $('knowledge-canvas');
    if (!canvas || !graphNodesSim.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const isLight = state.theme === 'light';
    const { visible, neighborIds } = getVisibleGraphIds();

    ctx.save();
    ctx.translate(w / 2 + graphCam.x, h / 2 + graphCam.y);
    ctx.scale(graphCam.scale, graphCam.scale);

    // Draw Obsidian-style links
    (GRAPH.edges || []).forEach((e) => {
      if (!visible.has(e.source) || !visible.has(e.target)) return;
      const a = graphNodesSim.find((n) => n.id === e.source);
      const b = graphNodesSim.find((n) => n.id === e.target);
      if (!a || !b) return;
      const touchesActive = e.source === activeGraphNodeId || e.target === activeGraphNodeId;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineWidth = touchesActive ? 2.2 : 1;
      ctx.strokeStyle = touchesActive
        ? 'rgba(6, 182, 212, 0.85)'
        : (isLight ? 'rgba(100, 116, 139, 0.25)' : 'rgba(148, 163, 184, 0.22)');
      ctx.stroke();

      if (graphShowEdgeLabels && touchesActive) {
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const lbl = isZh() ? (e.relZh || e.rel) : e.rel;
        ctx.font = '600 10px system-ui, sans-serif';
        ctx.fillStyle = isLight ? '#0f172a' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(lbl, mx, my - 4);
      }
    });

    // Draw nodes
    graphNodesSim.forEach((n) => {
      if (!visible.has(n.id)) return;
      const d = domainInfo(n.domain);
      const isSelected = n.id === activeGraphNodeId;
      const isNeighbor = neighborIds.has(n.id);
      const alpha = isSelected || isNeighbor ? 1 : 0.42;

      ctx.globalAlpha = alpha;
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#ffffff' : (isLight ? '#0f172a' : '#020617');
      ctx.stroke();

      const label = isZh() ? (n.labelZh || n.label) : n.label;
      ctx.font = (isSelected ? '700 12px ' : '600 11px ') + 'system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
      ctx.fillText(label, n.x, n.y + n.r + 14);
      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }

  function screenToGraph(clientX, clientY) {
    const canvas = $('knowledge-canvas');
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left - rect.width / 2 - graphCam.x;
    const sy = clientY - rect.top - rect.height / 2 - graphCam.y;
    return { x: sx / graphCam.scale, y: sy / graphCam.scale };
  }

  function hitTestGraphNode(gx, gy) {
    const { visible } = getVisibleGraphIds();
    for (let i = graphNodesSim.length - 1; i >= 0; i--) {
      const n = graphNodesSim[i];
      if (!visible.has(n.id)) continue;
      const dx = n.x - gx;
      const dy = n.y - gy;
      if (dx * dx + dy * dy <= (n.r + 12) * (n.r + 12)) return n;
    }
    return null;
  }

  function bindGraphCanvasEvents() {
    const canvas = $('knowledge-canvas');
    if (!canvas || canvas.dataset.bound) return;
    canvas.dataset.bound = '1';

    let mode = null; // 'pan' | 'drag'
    let dragNode = null;
    let lastX = 0;
    let lastY = 0;
    let moved = false;

    const startDrag = (cx, cy) => {
      const pt = screenToGraph(cx, cy);
      const hit = hitTestGraphNode(pt.x, pt.y);
      lastX = cx;
      lastY = cy;
      moved = false;
      if (hit) {
        mode = 'drag';
        dragNode = hit;
      } else {
        mode = 'pan';
        dragNode = null;
      }
    };

    const moveDrag = (cx, cy) => {
      if (!mode) return;
      const dx = cx - lastX;
      const dy = cy - lastY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
      lastX = cx;
      lastY = cy;
      if (mode === 'drag' && dragNode) {
        dragNode.x += dx / graphCam.scale;
        dragNode.y += dy / graphCam.scale;
      } else if (mode === 'pan') {
        graphCam.x += dx;
        graphCam.y += dy;
      }
      requestGraphDraw();
    };

    const endDrag = (cx, cy) => {
      if (!moved && cx !== undefined) {
        const pt = screenToGraph(cx, cy);
        const hit = hitTestGraphNode(pt.x, pt.y);
        if (hit) {
          activeGraphNodeId = hit.id;
          renderGraphInspector();
          requestGraphDraw();
        }
      }
      mode = null;
      dragNode = null;
    };

    canvas.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', (e) => endDrag(e.clientX, e.clientY));

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && mode) {
        e.preventDefault();
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });
    canvas.addEventListener('touchend', (e) => {
      const t0 = e.changedTouches[0];
      endDrag(t0 ? t0.clientX : undefined, t0 ? t0.clientY : undefined);
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      graphCam.scale = Math.max(0.45, Math.min(2.6, graphCam.scale * factor));
      requestGraphDraw();
    }, { passive: false });

    window.addEventListener('resize', () => {
      if (currentView === 'graph') {
        resizeGraphCanvas();
        requestGraphDraw();
      }
    });
  }

  function renderGraphInspector() {
    const node = GRAPH.nodes.find((n) => n.id === activeGraphNodeId) || GRAPH.nodes[0];
    if (!node || !$('graph-node-id')) return;
    activeGraphNodeId = node.id;
    const kw = getKwById(node.id);
    const d = domainInfo(node.domain);

    $('graph-node-id').textContent = node.id.toUpperCase();
    $('graph-node-domain').textContent = domainName(d);
    $('graph-node-domain').style.borderColor = d.color;
    $('graph-node-title').textContent = kw ? (isZh() ? (kw.titleZh || kw.title) : kw.title) : (isZh() ? (node.labelZh || node.label) : node.label);
    $('graph-node-brief').textContent = kw ? (isZh() ? (kw.summaryZh || kw.summary) : kw.summary) : '';

    const connBox = $('graph-connections-list');
    connBox.innerHTML = '';
    const edges = (GRAPH.edges || []).filter((e) => e.source === node.id || e.target === node.id);
    if (!edges.length) {
      connBox.innerHTML = `<div class="muted">${isZh() ? '暫無直接關聯節點。' : 'No direct edges.'}</div>`;
    } else {
      edges.forEach((e) => {
        const otherId = e.source === node.id ? e.target : e.source;
        const other = GRAPH.nodes.find((x) => x.id === otherId);
        const otherKw = getKwById(otherId);
        if (!other) return;
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'graph-conn-item';
        const oTitle = otherKw ? (isZh() ? (otherKw.titleZh || otherKw.title) : otherKw.title) : (isZh() ? (other.labelZh || other.label) : other.label);
        const rel = isZh() ? (e.relZh || e.rel) : e.rel;
        const why = isZh() ? (e.whyZh || e.why) : e.why;
        item.innerHTML = `
          <div class="graph-conn-head"><span>${escapeHtml(oTitle)}</span><span class="badge">${escapeHtml(otherId.toUpperCase())}</span></div>
          <div class="graph-conn-rel">${escapeHtml(rel)}</div>
          <div class="graph-conn-why">${escapeHtml(why)}</div>
        `;
        item.addEventListener('click', () => {
          activeGraphNodeId = other.id;
          renderGraphInspector();
          requestGraphDraw();
        });
        connBox.appendChild(item);
      });
    }
  }

  function openInGraph(kwId) {
    initGraphIfNeeded();
    if (kwId) activeGraphNodeId = kwId;
    const simNode = graphNodesSim.find((n) => n.id === activeGraphNodeId);
    if (simNode) {
      graphCam.x = -simNode.x * graphCam.scale;
      graphCam.y = -simNode.y * graphCam.scale;
    }
    switchView('graph');
  }

  // ==================== INIT & EVENTS ====================
  function populateDomainSelects() {
    DOMAINS.forEach((d) => {
      ['quiz-domain-select', 'fc-domain-filter', 'new-card-domain', 'notes-domain-select', 'kw-domain-select'].forEach((id) => {
        if (!$(id)) return;
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = domainName(d);
        $(id).appendChild(opt);
      });
    });
    populateKwChapterSelect();
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
    $('btn-retry-exhibit').addEventListener('click', () => {
      const img = $('quiz-exhibit-img');
      if (img && img.dataset.baseSrc) {
        img.dataset.retried = '';
        setImgSrc(img, img.dataset.baseSrc + '?t=' + Date.now(), $('quiz-exhibit-error'), $('quiz-exhibit-error-text'));
      }
    });

    // Knowledge Point (KW) bindings
    $('kw-search-input').addEventListener('input', renderKwList);
    $('kw-chapter-select').addEventListener('change', () => {
      renderKwList();
      renderKwDetail();
    });
    $('kw-domain-select').addEventListener('change', () => {
      renderKwList();
      renderKwDetail();
    });
    $('btn-kw-mark').addEventListener('click', () => {
      if (!activeKwId) return;
      state.kwReviewed[activeKwId] = !state.kwReviewed[activeKwId];
      if (state.kwReviewed[activeKwId]) touchStudyStreak(state);
      saveState(state);
      renderKwList();
      renderKwDetail();
    });
    $('btn-kw-practice').addEventListener('click', () => {
      if (activeKwId) launchKwPractice(activeKwId);
    });
    $('btn-kw-to-graph').addEventListener('click', () => openInGraph(activeKwId));
    $('btn-kw-back-quiz').addEventListener('click', () => {
      kwReturnToQuiz = false;
      switchView('practice');
    });

    // All-in-one Knowledge Map bindings
    $('graph-search-input').addEventListener('input', () => {
      const q = $('graph-search-input').value.trim().toLowerCase();
      if (q) {
        const hit = graphNodesSim.find((n) => {
          const kw = getKwById(n.id);
          return [n.id, n.label, n.labelZh || '', kw ? kw.title : '', kw ? (kw.titleZh || '') : ''].join(' ').toLowerCase().includes(q);
        });
        if (hit) {
          activeGraphNodeId = hit.id;
          renderGraphInspector();
        }
      }
      requestGraphDraw();
    });
    $('btn-graph-local').addEventListener('click', () => {
      graphLocalOnly = !graphLocalOnly;
      $('btn-graph-local').classList.toggle('btn-primary', graphLocalOnly);
      $('btn-graph-local').classList.toggle('btn-ghost', !graphLocalOnly);
      requestGraphDraw();
    });
    $('btn-graph-labels').addEventListener('click', () => {
      graphShowEdgeLabels = !graphShowEdgeLabels;
      $('btn-graph-labels').classList.toggle('btn-primary', graphShowEdgeLabels);
      $('btn-graph-labels').classList.toggle('btn-ghost', !graphShowEdgeLabels);
      requestGraphDraw();
    });
    $('btn-graph-fit').addEventListener('click', () => {
      graphCam = { x: 0, y: 0, scale: 1 };
      requestGraphDraw();
    });
    $('btn-graph-zoom-in').addEventListener('click', () => {
      graphCam.scale = Math.min(2.6, graphCam.scale * 1.2);
      requestGraphDraw();
    });
    $('btn-graph-zoom-out').addEventListener('click', () => {
      graphCam.scale = Math.max(0.45, graphCam.scale * 0.83);
      requestGraphDraw();
    });
    $('btn-graph-open-kw').addEventListener('click', () => {
      kwReturnToQuiz = false;
      openKnowledgePoint(activeGraphNodeId);
    });
    $('btn-graph-practice').addEventListener('click', () => launchKwPractice(activeGraphNodeId));
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
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        if (reg && reg.update) reg.update().catch(() => {});
      }).catch((err) => console.warn('SW registration skipped:', err));
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
