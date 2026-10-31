(() => {
  'use strict';
  const client = window.fasalsathiSupabase;
  const $ = (id) => document.getElementById(id);
  const copy = {
    en: {
      eyebrow:'FARMER ACCOUNT', title:'Your farm, always within reach.', subtitle:'Sign in to keep your farm workspace with you. New here? Create your free account.',
      method:'Email + Password', login:'Sign in', signup:'Create account', name:'Your name', email:'Email address', pass:'Password',
      submitLogin:'Sign in securely', submitSignup:'Create my account', forgot:'Forgot password?',
      confirm:'Your account has been created. Check your email and confirm your address, then return here to sign in.',
      resetSent:'Password reset email requested. Check your inbox and spam folder.',
      note:'Your password and authentication are handled securely by Supabase. Never share your password.',
      local:'Your farm records are currently saved on this device. Cloud synchronization across devices is a later upgrade.',
      noClient:'Authentication is not configured in this deployment yet.',
      createFirst:'New farmer? Create a free account', haveAccount:'Already registered? Sign in',
      working:'Please wait…', emailMissing:'Enter a valid email address.', passwordShort:'Use a password with at least 8 characters.',
      signedOut:'You have been signed out.'
    },
    hi: {
      eyebrow:'किसान खाता', title:'आपका खेत, हमेशा आपके साथ।', subtitle:'अपने खेत का कार्यक्षेत्र खोलने के लिए लॉगिन करें। नए हैं? अपना मुफ़्त खाता बनाएँ।',
      method:'ईमेल + पासवर्ड', login:'लॉगिन', signup:'खाता बनाएँ', name:'आपका नाम', email:'ईमेल पता', pass:'पासवर्ड',
      submitLogin:'सुरक्षित लॉगिन करें', submitSignup:'मेरा खाता बनाएँ', forgot:'पासवर्ड भूल गए?',
      confirm:'आपका खाता बन गया है। ईमेल की पुष्टि करें, फिर यहाँ लॉगिन करें।',
      resetSent:'पासवर्ड रीसेट ईमेल भेजने का अनुरोध किया गया है। इनबॉक्स और स्पैम फ़ोल्डर देखें।',
      note:'आपका पासवर्ड और लॉगिन Supabase सुरक्षित रखता है। अपना पासवर्ड किसी से साझा न करें।',
      local:'खेत की जानकारी अभी इसी डिवाइस पर सेव है। अलग-अलग डिवाइस पर क्लाउड सिंक बाद में जोड़ा जाएगा।',
      noClient:'इस वेबसाइट में अभी प्रमाणीकरण कॉन्फ़िगर नहीं है।',
      createFirst:'नए किसान हैं? मुफ़्त खाता बनाएँ', haveAccount:'पहले से खाता है? लॉगिन करें',
      working:'कृपया प्रतीक्षा करें…', emailMissing:'सही ईमेल पता डालें।', passwordShort:'कम से कम 8 अक्षरों का पासवर्ड रखें.',
      signedOut:'आप लॉग आउट हो गए हैं।'
    },
    mr: {
      eyebrow:'शेतकरी खाते', title:'तुमचे शेत, नेहमी तुमच्या सोबत.', subtitle:'तुमचे शेत कार्यक्षेत्र उघडण्यासाठी लॉगिन करा. नवीन आहात? मोफत खाते तयार करा.',
      method:'ईमेल + पासवर्ड', login:'लॉगिन', signup:'खाते तयार करा', name:'तुमचे नाव', email:'ईमेल पत्ता', pass:'पासवर्ड',
      submitLogin:'सुरक्षित लॉगिन करा', submitSignup:'माझे खाते तयार करा', forgot:'पासवर्ड विसरलात?',
      confirm:'तुमचे खाते तयार झाले आहे. ईमेलची पुष्टी करा आणि नंतर येथे लॉगिन करा.',
      resetSent:'पासवर्ड रीसेट ईमेलची विनंती केली आहे. इनबॉक्स आणि स्पॅम फोल्डर तपासा.',
      note:'तुमचा पासवर्ड आणि लॉगिन Supabase सुरक्षित ठेवते. पासवर्ड कोणाशीही शेअर करू नका.',
      local:'शेताची माहिती सध्या याच डिव्हाइसवर जतन होते. वेगवेगळ्या डिव्हाइसवर क्लाउड सिंक नंतर जोडले जाईल.',
      noClient:'या वेबसाइटवर प्रमाणीकरण अद्याप कॉन्फिगर केलेले नाही.',
      createFirst:'नवीन शेतकरी? मोफत खाते तयार करा', haveAccount:'आधीच खाते आहे? लॉगिन करा',
      working:'कृपया थांबा…', emailMissing:'योग्य ईमेल पत्ता टाका.', passwordShort:'किमान 8 अक्षरांचा पासवर्ड वापरा.',
      signedOut:'तुम्ही लॉग आउट झाला आहात.'
    }
  };
  let intent='login',busy=false;
  const tr=(key)=>(copy[document.documentElement.lang]||copy.en)[key]||copy.en[key]||key;
  const msg=(text,error=false)=>{const node=$('authMessage');if(!node)return;node.textContent=text||'';node.classList.toggle('error',!!error);};
  const setBusy=(value)=>{busy=value;['authSubmit','authForgot'].forEach(id=>{if($(id))$(id).disabled=value;});};
  const fire=(name,detail={})=>window.dispatchEvent(new CustomEvent(name,{detail}));
  const validEmail=(email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  function updateText(){
    const el=(id,key)=>{if($(id))$(id).textContent=tr(key);};
    el('authEyebrow','eyebrow');el('authTitle','title');el('authSubtitle','subtitle');
    el('authMethod','method');el('authNameLabel','name');el('authEmailLabel','email');el('authPasswordLabel','pass');
    el('authSubmit',intent==='signup'?'submitSignup':'submitLogin');el('authForgot','forgot');
    el('authSecurityText','note');el('authLocalNote','local');
    el('authIntentToggle',intent==='login'?'createFirst':'haveAccount');
  }
  function setIntent(next){
    intent=next;
    $('authNameField').hidden=intent!=='signup';
    $('authPassword').autocomplete=intent==='signup'?'new-password':'current-password';
    $('authIntentToggle').setAttribute('aria-pressed',intent==='signup'?'true':'false');
    msg('');updateText();
  }
  async function onPasswordSubmit(event){
    event.preventDefault();if(busy)return;
    if(!client){msg(tr('noClient'),true);return;}
    const email=$('authEmail').value.trim().toLowerCase();
    const password=$('authPassword').value;
    const fullName=$('authFullName').value.trim();
    if(!validEmail(email)){msg(tr('emailMissing'),true);return;}
    if(intent==='signup'&&password.length<8){msg(tr('passwordShort'),true);return;}
    setBusy(true);msg(tr('working'));
    try{
      if(intent==='signup'){
        const {data,error}=await client.auth.signUp({email,password,options:{
          data:{full_name:fullName},
          emailRedirectTo:window.location.origin+window.location.pathname
        }});
        if(error)throw error;
        if(data.session&&data.user)fire('fasalsathi:authenticated',{user:data.user});
        else msg(tr('confirm'));
      }else{
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error)throw error;
        fire('fasalsathi:authenticated',{user:data.user});
      }
    }catch(error){msg(error?.message||'Authentication failed. Please try again.',true);}
    finally{setBusy(false);}
  }
  async function forgotPassword(){
    if(busy)return;
    if(!client){msg(tr('noClient'),true);return;}
    const email=$('authEmail').value.trim().toLowerCase();
    if(!validEmail(email)){msg(tr('emailMissing'),true);return;}
    setBusy(true);msg(tr('working'));
    try{
      const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
      if(error)throw error;
      msg(tr('resetSent'));
    }catch(error){msg(error?.message||'Could not request a password reset.',true);}
    finally{setBusy(false);}
  }
  async function signOut(){
    if(!client)return;
    setBusy(true);
    try{const {error}=await client.auth.signOut();if(error)throw error;fire('fasalsathi:signedout');}
    catch(error){msg(error?.message||'Could not sign out.',true);}
    finally{setBusy(false);}
  }
  function bind(){
    $('authIntentToggle').addEventListener('click',()=>setIntent(intent==='login'?'signup':'login'));
    $('authPasswordForm').addEventListener('submit',onPasswordSubmit);
    $('authForgot').addEventListener('click',forgotPassword);
    $('signOutBtn').addEventListener('click',signOut);
    window.addEventListener('fasalsathi:language-changed',updateText);
    window.addEventListener('fasalsathi:show-auth',()=>updateText());
    setIntent('login');
  }
  async function restoreSession(){
    if(!client){msg(tr('noClient'),true);return;}
    try{const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session?.user)fire('fasalsathi:authenticated',{user:data.session.user});}
    catch(error){msg(error?.message||'Could not restore your session.',true);}
  }
  bind();restoreSession();
  if(client)client.auth.onAuthStateChange((event,session)=>{
    if(event==='SIGNED_IN'&&session?.user)fire('fasalsathi:authenticated',{user:session.user});
    if(event==='SIGNED_OUT')fire('fasalsathi:signedout');
  });
})();