(function (global) {
  'use strict';

  const STORAGE_KEY = 'ccna_study_hub_v1';

  const DOMAINS = [
    { id: 'fundamentals', name: 'Network Fundamentals', nameZh: '網路基礎', weight: 20, short: 'Fundamentals', shortZh: '網路基礎', color: '#38bdf8' },
    { id: 'access', name: 'Network Access', nameZh: '網路存取', weight: 20, short: 'Net Access', shortZh: '網路存取', color: '#818cf8' },
    { id: 'connectivity', name: 'IP Connectivity', nameZh: 'IP 連通性', weight: 25, short: 'IP Connect', shortZh: 'IP 連通', color: '#34d399' },
    { id: 'services', name: 'IP Services', nameZh: 'IP 服務', weight: 10, short: 'IP Services', shortZh: 'IP 服務', color: '#fbbf24' },
    { id: 'security', name: 'Security Fundamentals', nameZh: '安全基礎', weight: 15, short: 'Security', shortZh: '安全基礎', color: '#f87171' },
    { id: 'automation', name: 'Automation & Programmability', nameZh: '自動化與可程式化', weight: 10, short: 'Automation', shortZh: '自動化', color: '#c084fc' }
  ];

  function createDefaultState() {
    return {
      version: 1,
      updatedAt: Date.now(),
      theme: 'dark',
      lang: 'en',
      examDate: '',
      streak: { count: 0, lastDate: '' },
      questionStats: {},
      examHistory: [],
      cardProgress: {},
      customCards: [],
      subnetStats: { attempted: 0, correct: 0, streak: 0, bestStreak: 0 },
      labProgress: {},
      notes: {
        fundamentals: '',
        access: '',
        connectivity: '',
        services: '',
        security: '',
        automation: ''
      }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch (err) {
      console.warn('Failed to load state, using defaults:', err);
      return createDefaultState();
    }
  }

  function normalizeState(input) {
    const def = createDefaultState();
    if (!input || typeof input !== 'object') return def;
    return {
      version: 1,
      updatedAt: Number(input.updatedAt) || Date.now(),
      theme: input.theme === 'light' ? 'light' : 'dark',
      lang: input.lang === 'zh-TW' ? 'zh-TW' : 'en',
      examDate: typeof input.examDate === 'string' ? input.examDate : '',
      streak: {
        count: Number(input.streak && input.streak.count) || 0,
        lastDate: (input.streak && input.streak.lastDate) || ''
      },
      questionStats: (input.questionStats && typeof input.questionStats === 'object') ? input.questionStats : {},
      examHistory: Array.isArray(input.examHistory) ? input.examHistory.slice(-30) : [],
      cardProgress: (input.cardProgress && typeof input.cardProgress === 'object') ? input.cardProgress : {},
      customCards: Array.isArray(input.customCards) ? input.customCards : [],
      subnetStats: {
        attempted: Number(input.subnetStats && input.subnetStats.attempted) || 0,
        correct: Number(input.subnetStats && input.subnetStats.correct) || 0,
        streak: Number(input.subnetStats && input.subnetStats.streak) || 0,
        bestStreak: Number(input.subnetStats && input.subnetStats.bestStreak) || 0
      },
      labProgress: (input.labProgress && typeof input.labProgress === 'object') ? input.labProgress : {},
      notes: Object.assign({}, def.notes, (input.notes && typeof input.notes === 'object') ? input.notes : {})
    };
  }

  function saveState(state) {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not persist state to localStorage:', err);
    }
    return state;
  }

  function touchStudyStreak(state) {
    const today = new Date().toISOString().slice(0, 10);
    if (state.streak.lastDate === today) return;
    if (!state.streak.lastDate) {
      state.streak.count = 1;
    } else {
      const prev = new Date(state.streak.lastDate + 'T00:00:00Z');
      const curr = new Date(today + 'T00:00:00Z');
      const diffDays = Math.round((curr - prev) / 86400000);
      state.streak.count = diffDays === 1 ? state.streak.count + 1 : 1;
    }
    state.streak.lastDate = today;
  }

  function toBase64Utf8(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function fromBase64Utf8(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function encodeSyncCode(state) {
    const compact = JSON.stringify(state);
    return 'CCNA1:' + toBase64Utf8(compact);
  }

  function decodeSyncPayload(rawText) {
    const trimmed = (rawText || '').trim();
    if (!trimmed) throw new Error('Sync data is empty.');
    let jsonText = trimmed;
    if (trimmed.startsWith('CCNA1:')) {
      jsonText = fromBase64Utf8(trimmed.slice(6).trim());
    }
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
      throw new Error('Unrecognized CCNA Study Hub backup format.');
    }
    return normalizeState(parsed);
  }

  function mergeStates(localState, incomingState) {
    const a = normalizeState(localState);
    const b = normalizeState(incomingState);
    const merged = createDefaultState();

    merged.theme = a.theme;
    merged.lang = a.lang;
    merged.examDate = b.examDate || a.examDate;
    if (b.streak.lastDate > a.streak.lastDate) {
      merged.streak = { ...b.streak };
    } else if (a.streak.lastDate > b.streak.lastDate) {
      merged.streak = { ...a.streak };
    } else {
      merged.streak = {
        lastDate: a.streak.lastDate,
        count: Math.max(a.streak.count, b.streak.count)
      };
    }

    // Merge question stats
    const qKeys = new Set([...Object.keys(a.questionStats), ...Object.keys(b.questionStats)]);
    qKeys.forEach((qid) => {
      const qa = a.questionStats[qid];
      const qb = b.questionStats[qid];
      if (!qa) merged.questionStats[qid] = { ...qb };
      else if (!qb) merged.questionStats[qid] = { ...qa };
      else {
        const useB = (qb.lastAnsweredAt || 0) >= (qa.lastAnsweredAt || 0);
        merged.questionStats[qid] = {
          attempts: Math.max(qa.attempts || 0, qb.attempts || 0),
          correct: Math.max(qa.correct || 0, qb.correct || 0),
          lastCorrect: useB ? Boolean(qb.lastCorrect) : Boolean(qa.lastCorrect),
          lastAnsweredAt: Math.max(qa.lastAnsweredAt || 0, qb.lastAnsweredAt || 0),
          bookmarked: Boolean(qa.bookmarked || qb.bookmarked)
        };
      }
    });

    // Merge card progress (latest review wins)
    const cKeys = new Set([...Object.keys(a.cardProgress), ...Object.keys(b.cardProgress)]);
    cKeys.forEach((cid) => {
      const ca = a.cardProgress[cid];
      const cb = b.cardProgress[cid];
      if (!ca) merged.cardProgress[cid] = { ...cb };
      else if (!cb) merged.cardProgress[cid] = { ...ca };
      else {
        merged.cardProgress[cid] = (cb.lastReviewedAt || 0) > (ca.lastReviewedAt || 0) ? { ...cb } : { ...ca };
      }
    });

    // Merge custom cards by id
    const customMap = new Map();
    a.customCards.forEach((c) => customMap.set(c.id, c));
    b.customCards.forEach((c) => customMap.set(c.id, c));
    merged.customCards = Array.from(customMap.values());

    // Merge exam history by timestamp
    const histMap = new Map();
    [...a.examHistory, ...b.examHistory].forEach((h) => histMap.set(h.date + '_' + h.score + '_' + h.total, h));
    merged.examHistory = Array.from(histMap.values())
      .sort((x, y) => (x.date > y.date ? 1 : -1))
      .slice(-30);

    merged.subnetStats = {
      attempted: Math.max(a.subnetStats.attempted, b.subnetStats.attempted),
      correct: Math.max(a.subnetStats.correct, b.subnetStats.correct),
      streak: Math.max(a.subnetStats.streak, b.subnetStats.streak),
      bestStreak: Math.max(a.subnetStats.bestStreak, b.subnetStats.bestStreak)
    };

    const lKeys = new Set([...Object.keys(a.labProgress), ...Object.keys(b.labProgress)]);
    lKeys.forEach((lid) => {
      merged.labProgress[lid] = b.labProgress[lid] || a.labProgress[lid];
    });

    DOMAINS.forEach((d) => {
      const na = (a.notes[d.id] || '').trim();
      const nb = (b.notes[d.id] || '').trim();
      if (!na) merged.notes[d.id] = nb;
      else if (!nb || na === nb) merged.notes[d.id] = na;
      else merged.notes[d.id] = na + '\n\n--- Synced Note ---\n' + nb;
    });

    merged.updatedAt = Date.now();
    return merged;
  }

  global.CCNAStorage = {
    DOMAINS,
    createDefaultState,
    loadState,
    saveState,
    touchStudyStreak,
    encodeSyncCode,
    decodeSyncPayload,
    mergeStates
  };
})(window);
