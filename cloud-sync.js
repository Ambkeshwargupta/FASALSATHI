'use strict';
(() => {
  const client = () => window.fasalsathiSupabase;
  const sync = {
    userId: null, ready: false, loading: false, saving: false, dirty: false,
    timer: null, lastSnapshot: null, lastPulledAt: 0, request: 0, lastError: ''
  };

  const messages = {
    en: {
      cloudSyncReady: 'Your farmer data is now connected to cloud storage.',
      cloudSyncSaved: 'Your changes are safely synced.',
      cloudSetupPending: 'Cloud storage is not set up yet. Your data remains saved on this device. Ask the project owner to deploy the latest database migration.',
      cloudSaveFailed: 'Cloud sync could not save your latest changes. They are still saved on this device; check your internet connection and retry.',
      cloudPayloadTooLarge: 'This workspace is too large to sync in one request. Your device copy is safe; contact support.',
      cloudImportPrompt: 'We found older data saved on this device ({fields} fields and {scans} unlinked scans). Import it into this signed-in farmer account so it is available on your other devices?',
      cloudImportDone: 'Older field data was added to your cloud account.',
      cloudImportSkipped: 'Older local data was left untouched and was not imported.',
      cloudImportMultiple: 'More than one older local profile was found. For privacy, none was imported automatically. Your existing local data has not been deleted.'
    },
    hi: {
      cloudSyncReady: 'आपके किसान खाते का डेटा अब क्लाउड स्टोरेज से जुड़ गया है।',
      cloudSyncSaved: 'आपके बदलाव सुरक्षित रूप से सिंक हो गए हैं।',
      cloudSetupPending: 'क्लाउड स्टोरेज अभी सेटअप नहीं है। आपका डेटा इसी डिवाइस पर सुरक्षित है। प्रोजेक्ट एडमिन को नया डेटाबेस माइग्रेशन डिप्लॉय करना होगा।',
      cloudSaveFailed: 'नए बदलाव क्लाउड में सेव नहीं हो पाए। वे इस डिवाइस पर सुरक्षित हैं। इंटरनेट जाँचकर फिर प्रयास करें।',
      cloudPayloadTooLarge: 'डेटा एक बार में सिंक करने के लिए बहुत बड़ा है। इस डिवाइस की कॉपी सुरक्षित है।',
      cloudImportPrompt: 'इस डिवाइस पर पुराना डेटा मिला है ({fields} खेत और {scans} बिना खेत से जुड़े स्कैन)। क्या इसे आपके लॉगिन किए गए किसान खाते में जोड़ें ताकि यह दूसरे डिवाइस पर भी उपलब्ध हो?',
      cloudImportDone: 'पुराना खेत डेटा आपके क्लाउड खाते में जोड़ दिया गया।',
      cloudImportSkipped: 'पुराना डिवाइस डेटा सुरक्षित रखा गया है और इम्पोर्ट नहीं किया गया।',
      cloudImportMultiple: 'इस डिवाइस पर एक से अधिक पुराने प्रोफाइल मिले। गोपनीयता के लिए उन्हें अपने आप इम्पोर्ट नहीं किया गया। पुराना डेटा डिलीट नहीं हुआ है।'
    },
    mr: {
      cloudSyncReady: 'तुमच्या शेतकरी खात्याचा डेटा आता क्लाउड स्टोरेजशी जोडला आहे.',
      cloudSyncSaved: 'तुमचे बदल सुरक्षितपणे सिंक झाले आहेत.',
      cloudSetupPending: 'क्लाउड स्टोरेज अजून सेट केलेले नाही. तुमचा डेटा या डिव्हाइसवर सुरक्षित आहे. प्रकल्प प्रशासकाने नवीन डेटाबेस माइग्रेशन डिप्लॉय करणे आवश्यक आहे.',
      cloudSaveFailed: 'नवीन बदल क्लाउडमध्ये जतन करता आले नाहीत. ते या डिव्हाइसवर सुरक्षित आहेत. इंटरनेट तपासून पुन्हा प्रयत्न करा.',
      cloudPayloadTooLarge: 'हा डेटा एका विनंतीत सिंक करण्यासाठी खूप मोठा आहे. या डिव्हाइसवरील प्रत सुरक्षित आहे.',
      cloudImportPrompt: 'या डिव्हाइसवर जुना डेटा आढळला आहे ({fields} शेते आणि {scans} न जोडलेले स्कॅन). तो तुमच्या लॉगिन केलेल्या शेतकरी खात्यात जोडायचा का, जेणेकरून तो इतर डिव्हाइसवरही उपलब्ध होईल?',
      cloudImportDone: 'जुना शेत डेटा तुमच्या क्लाउड खात्यात जोडला आहे.',
      cloudImportSkipped: 'जुना स्थानिक डेटा तसाच सुरक्षित ठेवला आहे आणि आयात केलेला नाही.',
      cloudImportMultiple: 'या डिव्हाइसवर एकापेक्षा जास्त जुने प्रोफाइल आढळले. गोपनीयतेसाठी ते आपोआप आयात केलेले नाहीत. जुना डेटा हटवलेला नाही.'
    }
  };

  function tr(key, vars = {}) {
    const lang = document.documentElement.lang || 'en';
    let text = (messages[lang] && messages[lang][key]) || messages.en[key] || key;
    for (const [name, value] of Object.entries(vars)) text = text.replaceAll('{' + name + '}', String(value));
    return text;
  }

  function stripBinary(value) {
    if (Array.isArray(value)) return value.map(stripBinary);
    if (value && typeof value === 'object') {
      const clean = {};
      for (const [key, item] of Object.entries(value)) {
        if (/^(previewData|imageData|photoData|photoDataUrl|base64Image)$/i.test(key)) continue;
        const safe = stripBinary(item);
        if (safe !== undefined) clean[key] = safe;
      }
      return clean;
    }
    if (typeof value === 'string' && /^data:image\//i.test(value)) return undefined;
    return value;
  }

  function normalizeWorkspace(value) {
    const source = value && typeof value === 'object' ? value : {};
    const fields = Array.isArray(source.fields) ? source.fields
      .filter(field => field && typeof field.id === 'string' && field.crop === 'tomato'
        && Number.isFinite(Number(field.lat)) && Number.isFinite(Number(field.lon))
        && Math.abs(Number(field.lat)) <= 90 && Math.abs(Number(field.lon)) <= 180)
      .slice(0, 100)
      .map(field => {
        const safe = stripBinary(field);
        safe.scanHistory = Array.isArray(safe.scanHistory) ? safe.scanHistory.slice(0, 5) : [];
        return safe;
      }) : [];
    const unlinkedScans = Array.isArray(source.unlinkedScans)
      ? source.unlinkedScans.slice(0, 5).map(stripBinary) : [];
    return { fields, unlinkedScans };
  }

  function hasRecords(value) {
    const workspace = normalizeWorkspace(value);
    return workspace.fields.length > 0 || workspace.unlinkedScans.length > 0;
  }

  function mergeScans(first = [], second = []) {
    const byId = new Map();
    for (const scan of [...(Array.isArray(first) ? first : []), ...(Array.isArray(second) ? second : [])]) {
      if (!scan || typeof scan !== 'object') continue;
      const key = String(scan.id || (String(scan.at || 0) + '|' + String(scan.result || '') + '|' + String(scan.fileName || '')));
      byId.set(key, { ...(byId.get(key) || {}), ...scan });
    }
    return [...byId.values()].sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0)).slice(0, 5);
  }

  function mergeWorkspaces(remoteValue, localValue) {
    const remote = normalizeWorkspace(remoteValue);
    const local = normalizeWorkspace(localValue);
    const byId = new Map(remote.fields.map(field => [field.id, field]));
    for (const field of local.fields) {
      const previous = byId.get(field.id);
      byId.set(field.id, previous
        ? { ...previous, ...field, scanHistory: mergeScans(previous.scanHistory, field.scanHistory) }
        : field);
    }
    return {
      fields: [...byId.values()].slice(0, 100),
      unlinkedScans: mergeScans(remote.unlinkedScans, local.unlinkedScans)
    };
  }

  function currentWorkspace() {
    const profile = typeof account === 'function' ? account() : null;
    return normalizeWorkspace(profile || { fields: [], unlinkedScans: [] });
  }

  function workspaceJson() {
    return JSON.stringify(currentWorkspace());
  }

  function setErrorOnce(kind) {
    if (sync.lastError === kind) return;
    sync.lastError = kind;
    if (typeof toast === 'function') toast(tr(kind));
  }

  function scheduleSave() {
    if (!sync.ready || !state.user || sync.userId !== state.user) return;
    if (workspaceJson() === sync.lastSnapshot) return;
    clearTimeout(sync.timer);
    sync.timer = setTimeout(() => save(), 800);
  }

  async function save() {
    const supabase = client();
    if (!sync.ready || !state.user || sync.userId !== state.user || !supabase) return;
    if (sync.saving) {
      sync.dirty = true;
      return;
    }
    sync.saving = true;
    try {
      do {
        sync.dirty = false;
        const workspace = currentWorkspace();
        const snapshot = JSON.stringify(workspace);
        if (snapshot.length > 3900000) {
          setErrorOnce('cloudPayloadTooLarge');
          break;
        }
        const { error } = await supabase.from('farmer_workspaces').upsert({
          user_id: state.user,
          workspace,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        if (error) throw error;
        sync.lastSnapshot = snapshot;
        sync.lastPulledAt = Date.now();
        sync.lastError = '';
        if (workspaceJson() !== snapshot) sync.dirty = true;
      } while (sync.dirty && sync.userId === state.user);
    } catch (error) {
      console.error('FASALSATHI cloud save failed:', error);
      const message = String(error && error.message || '');
      setErrorOnce(/farmer_workspaces|schema cache|does not exist|404/i.test(message)
        ? 'cloudSetupPending' : 'cloudSaveFailed');
    } finally {
      sync.saving = false;
      if (sync.dirty && sync.userId === state.user) scheduleSave();
    }
  }

  function redraw() {
    if (typeof account === 'function' && account() && typeof showScreen === 'function') {
      try { showScreen(state.page || 'home', true); }
      catch (error) { console.warn('Cloud data was loaded but the screen could not be refreshed:', error); }
    }
  }

  async function initialize(user) {
    const supabase = client();
    if (!user || !user.id || !supabase || sync.loading && sync.userId === user.id) return;
    const requestId = ++sync.request;
    clearTimeout(sync.timer);
    sync.loading = true;
    sync.ready = false;
    sync.userId = user.id;
    sync.lastSnapshot = null;
    sync.lastPulledAt = 0;
    sync.lastError = '';

    try {
      const sameUserLocal = db.accounts[user.id] || { id: 'FS-' + Date.now().toString(36), fields: [], unlinkedScans: [] };
      const oldProfiles = Object.entries(db.accounts).filter(([key, profile]) => key !== user.id && hasRecords(profile));
      const { data, error } = await supabase.from('farmer_workspaces')
        .select('workspace,updated_at').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (requestId !== sync.request || sync.userId !== user.id) return;

      const remote = normalizeWorkspace(data && data.workspace || {});
      let local = normalizeWorkspace(sameUserLocal);

      if (oldProfiles.length === 1) {
        const prior = normalizeWorkspace(oldProfiles[0][1]);
        const question = tr('cloudImportPrompt', { fields: prior.fields.length, scans: prior.unlinkedScans.length });
        if (window.confirm(question)) {
          local = mergeWorkspaces(local, prior);
          if (typeof toast === 'function') toast(tr('cloudImportDone'));
        } else if (typeof toast === 'function') {
          toast(tr('cloudImportSkipped'));
        }
      } else if (oldProfiles.length > 1 && typeof toast === 'function') {
        toast(tr('cloudImportMultiple'));
      }

      const merged = mergeWorkspaces(remote, local);
      db.accounts[user.id] = {
        id: sameUserLocal.id || 'FS-' + Date.now().toString(36),
        fields: merged.fields,
        unlinkedScans: merged.unlinkedScans
      };
      sync.ready = true;
      sync.lastPulledAt = data && data.updated_at ? (Date.parse(data.updated_at) || Date.now()) : 0;
      sync.lastSnapshot = JSON.stringify(remote);
      if (typeof persist === 'function') persist();
      redraw();

      if (!data || JSON.stringify(merged) !== JSON.stringify(remote)) {
        await save();
      } else {
        sync.lastSnapshot = JSON.stringify(merged);
        if (typeof toast === 'function') toast(tr('cloudSyncReady'));
      }
    } catch (error) {
      if (requestId !== sync.request) return;
      sync.ready = false;
      console.error('FASALSATHI cloud workspace could not be loaded:', error);
      setErrorOnce('cloudSetupPending');
    } finally {
      if (requestId === sync.request) sync.loading = false;
    }
  }

  async function pull() {
    const supabase = client();
    if (document.hidden || !sync.ready || !state.user || sync.userId !== state.user || sync.saving || !supabase) return;
    if (Date.now() - sync.lastPulledAt < 12000) return;
    try {
      const { data, error } = await supabase.from('farmer_workspaces')
        .select('workspace,updated_at').eq('user_id', state.user).maybeSingle();
      if (error) throw error;
      if (!data || !data.workspace) return;
      const remoteUpdated = Date.parse(data.updated_at) || Date.now();
      if (remoteUpdated <= sync.lastPulledAt) return;

      const local = currentWorkspace();
      const localHasUnsyncedChanges = sync.lastSnapshot !== null && JSON.stringify(local) !== sync.lastSnapshot;
      const remote = normalizeWorkspace(data.workspace);
      const next = localHasUnsyncedChanges ? mergeWorkspaces(remote, local) : remote;

      db.accounts[state.user] = { ...(account() || {}), fields: next.fields, unlinkedScans: next.unlinkedScans };
      sync.lastPulledAt = remoteUpdated;
      if (!localHasUnsyncedChanges) sync.lastSnapshot = JSON.stringify(next);
      if (typeof persist === 'function') persist();
      if (localHasUnsyncedChanges) scheduleSave();
      redraw();
    } catch (error) {
      console.warn('FASALSATHI background cloud refresh failed:', error);
    }
  }

  window.addEventListener('fasalsathi:authenticated', event => initialize(event.detail && event.detail.user));
  window.addEventListener('fasalsathi:signedout', () => {
    clearTimeout(sync.timer);
    sync.request++;
    sync.userId = null;
    sync.ready = false;
    sync.loading = false;
    sync.lastSnapshot = null;
    sync.lastPulledAt = 0;
  });
  window.addEventListener('fasalsathi:local-change', scheduleSave);
  window.addEventListener('focus', pull);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pull(); });
  setInterval(() => { if (!document.hidden) pull(); }, 60000);

  // The page restores its Supabase session via auth.js after this file is loaded.
})();