(() => {
  'use strict';
  const client = window.fasalsathiSupabase;
  const $ = (id) => document.getElementById(id);
  const copy = {
    en: {
      eyebrow:'FARMER ACCOUNT', title:'Your farm, always within reach.', subtitle:'Sign in to keep your farm workspace with you. New here? Create your free account.',
      google:'Continue with Google', divider:'OR USE EMAIL', password:'Email & password', otp:'Email OTP',
      login:'Sign in', signup:'Create account', name:'Your name', email:'Email address', pass:'Password',
      submitLogin:'Sign in securely', submitSignup:'Create my account', sendOtp:'Send one-time code',
      code:'6-digit email code', verify:'Verify code & continue', resend:'Send a new code',
      forgot:'Forgot password?', change:'Use a different email', otpSent:'A verification code has been requested. Check your inbox and spam folder.',
      confirm:'Account created. Check your email to confirm the address, then return here to sign in.',
      resetSent:'Password reset email requested. Check your inbox.',
      note:'Your password and authentication are handled by Supabase. Never share your password or verification code.',
      local:'Note: your current farm records are still stored on this device. Cloud syncing will be the next upgrade.',
      noClient:'Authentication is not configured in this deployment yet.',
      invalidCode:'Enter the complete 6-digit code.',
      createFirst:'New farmer? Create a free account', haveAccount:'Already registered? Sign in',
      working:'Please wait…', emailMissing:'Enter a valid email address.', passwordShort:'Use a password with at least 8 characters.',
      signedOut:'You have been signed out.'
    },
    hi: {
      eyebrow:'किसान खाता', title:'आपका खेत, हमेशा आपके साथ।', subtitle:'अपने खेत का कार्यक्षेत्र खोलने के लिए लॉगिन करें। नए हैं? अपना मुफ़्त खाता बनाएँ।',
      google:'Google से जारी रखें', divider:'या ईमेल से', password:'ईमेल और पासवर्ड', otp:'ईमेल OTP',
      login:'लॉगिन', signup:'खाता बनाएँ', name:'आपका नाम', email:'ईमेल पता', pass:'पासवर्ड',
      submitLogin:'सुरक्षित लॉगिन करें', submitSignup:'मेरा खाता बनाएँ', sendOtp:'OTP भेजें',
      code:'6 अंकों का ईमेल OTP', verify:'OTP जाँचें और आगे बढ़ें', resend:'नया OTP भेजें',
      forgot:'पासवर्ड भूल गए?', change:'दूसरा ईमेल इस्तेमाल करें', otpSent:'ईमेल पर OTP भेजने का अनुरोध किया गया है। इनबॉक्स और स्पैम फ़ोल्डर देखें।',
      confirm:'खाता बन गया है। ईमेल की पुष्टि करें, फिर यहाँ लॉगिन करें।',
      resetSent:'पासवर्ड रीसेट ईमेल भेजने का अनुरोध किया गया है।',
      note:'पासवर्ड और प्रमाणीकरण Supabase सुरक्षित रखता है। अपना पासवर्ड या OTP किसी से साझा न करें।',
      local:'ध्यान दें: अभी खेत की जानकारी इसी डिवाइस पर सेव है। क्लाउड सिंक अगला अपग्रेड होगा।',
      noClient:'इस वेबसाइट में अभी प्रमाणीकरण कॉन्फ़िगर नहीं है।',
      invalidCode:'पूरा 6 अंकों का OTP डालें।',
      createFirst:'नए किसान हैं? मुफ़्त खाता बनाएँ', haveAccount:'पहले से खाता है? लॉगिन करें',
      working:'कृपया प्रतीक्षा करें…', emailMissing:'सही ईमेल पता डालें।', passwordShort:'कम से कम 8 अक्षरों का पासवर्ड रखें।',
      signedOut:'आप लॉग आउट हो गए हैं।'
    },
    mr: {
      eyebrow:'शेतकरी खाते', title:'तुमचे शेत, नेहमी तुमच्या सोबत.', subtitle:'तुमचे शेत कार्यक्षेत्र उघडण्यासाठी लॉगिन करा. नवीन आहात? मोफत खाते तयार करा.',
      google:'Google ने पुढे जा', divider:'किंवा ईमेल वापरा', password:'ईमेल आणि पासवर्ड', otp:'ईमेल OTP',
      login:'लॉगिन', signup:'खाते तयार करा', name:'तुमचे नाव', email:'ईमेल पत्ता', pass:'पासवर्ड',
      submitLogin:'सुरक्षित लॉगिन करा', submitSignup:'माझे खाते तयार करा', sendOtp:'OTP पाठवा',
      code:'6 अंकी ईमेल कोड', verify:'कोड तपासा आणि पुढे जा', resend:'नवीन OTP पाठवा',
      forgot:'पासवर्ड विसरलात?', change:'दुसरा ईमेल वापरा', otpSent:'ईमेल OTP ची विनंती केली आहे. इनबॉक्स आणि स्पॅम फोल्डर तपासा.',
      confirm:'खाते तयार झाले. ईमेलची पुष्टी करा आणि नंतर लॉगिन करा.',
      resetSent:'पासवर्ड रीसेट ईमेलची विनंती केली आहे.',
      note:'पासवर्ड आणि प्रमाणीकरण Supabase सुरक्षित ठेवते. पासवर्ड किंवा OTP कोणाशीही शेअर करू नका.',
      local:'टीप: सध्या शेताची माहिती याच डिव्हाइसवर जतन होते. क्लाउड सिंक पुढील अपग्रेड असेल.',
      noClient:'या वेबसाइटवर प्रमाणीकरण अद्याप कॉन्फिगर केलेले नाही.',
      invalidCode:'पूर्ण 6 अंकी OTP टाका.',
      createFirst:'नवीन शेतकरी? मोफत खाते तयार करा', haveAccount:'आधीच खाते आहे? लॉगिन करा',
      working:'कृपया थांबा…', emailMissing:'योग्य ईमेल पत्ता टाका.', passwordShort:'किमान 8 अक्षरांचा पासवर्ड वापरा.',
      signedOut:'तुम्ही लॉग आउट झाला आहात.'
    }
  };
  let method = 'password', intent = 'login', pendingEmail = '', busy = false;
  const tr = (key) => (copy[document.documentElement.lang] || copy.en)[key] || copy.en[key] || key;
  const msg = (text, error=false) => { const node=$('authMessage'); if(!node)return; node.textContent=text||''; node.classList.toggle('error',!!error); };
  const setBusy = (value) => {
    busy=value;
    ['authGoogle','authSubmit','authSendOtp','authVerifyOtp','authResendOtp','authForgot'].forEach(id=>{if($(id))$(id).disabled=value;});
  };
  const fire = (name, detail={}) => window.dispatchEvent(new CustomEvent(name,{detail}));
  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  function updateText(){
    const el=(id,key)=>{if($(id))$(id).textContent=tr(key);};
    el('authEyebrow','eyebrow');el('authTitle','title');el('authSubtitle','subtitle');
    el('authGoogleText','google');el('authDivider','divider');
    el('authPasswordTab','password');el('authOtpTab','otp');
    el('authNameLabel','name');el('authEmailLabel','email');el('authPasswordLabel','pass');
    el('authSubmit','submitLogin');el('authSendOtp','sendOtp');el('authOtpLabel','code');
    el('authVerifyOtp','verify');el('authResendOtp','resend');el('authForgot','forgot');
    el('authSecurityText','note');el('authLocalNote','local');
    el('authIntentToggle',intent==='login'?'createFirst':'haveAccount');
  }
  function setIntent(next){
    intent=next;
    $('authNameField').hidden=!(intent==='signup'&&method==='password');
    $('authSubmit').textContent=tr(intent==='signup'?'submitSignup':'submitLogin');
    $('authIntentToggle').setAttribute('aria-pressed',intent==='signup'?'true':'false');
    updateText();
  }
  function setMethod(next){
    method=next;
    $('authPasswordTab').setAttribute('aria-pressed',method==='password'?'true':'false');
    $('authOtpTab').setAttribute('aria-pressed',method==='otp'?'true':'false');
    $('authPasswordView').hidden=method!=='password';
    $('authOtpView').hidden=method!=='otp';
    $('authIntentToggle').hidden=method==='otp';
    $('authNameField').hidden=!(method==='password'&&intent==='signup');
    msg('');
    updateText();
  }
  function authScreen(){
    if(!client){msg(tr('noClient'),true);return;}
    updateText();
  }
  async function onPasswordSubmit(event){
    event.preventDefault(); if(busy)return;
    const email=$('authEmail').value.trim().toLowerCase();
    const password=$('authPassword').value;
    const fullName=$('authFullName').value.trim();
    if(!validEmail(email)){msg(tr('emailMissing'),true);return;}
    if(intent==='signup'&&password.length<8){msg(tr('passwordShort'),true);return;}
    setBusy(true);msg(tr('working'));
    try{
      if(intent==='signup'){
        const {data,error}=await client.auth.signUp({
          email,password,options:{
            data:{full_name:fullName},
            emailRedirectTo:window.location.origin+window.location.pathname
          }
        });
        if(error)throw error;
        if(data.session&&data.user){fire('fasalsathi:authenticated',{user:data.user});}
        else msg(tr('confirm'));
      }else{
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error)throw error;
        fire('fasalsathi:authenticated',{user:data.user});
      }
    }catch(error){msg(error?.message||'Authentication failed. Please try again.',true);}
    finally{setBusy(false);}
  }
  async function requestOtp(){
    if(busy)return;
    const email=$('authEmail').value.trim().toLowerCase();
    if(!validEmail(email)){msg(tr('emailMissing'),true);return;}
    setBusy(true);msg(tr('working'));
    try{
      const {error}=await client.auth.signInWithOtp({
        email,options:{shouldCreateUser:true,emailRedirectTo:window.location.origin+window.location.pathname}
      });
      if(error)throw error;
      pendingEmail=email;$('authOtpEmail').textContent=email;$('authOtpView').querySelector('.auth-otp-entry').hidden=false;
      msg(tr('otpSent'));
    }catch(error){msg(error?.message||'Could not send the code.',true);}
    finally{setBusy(false);}
  }
  async function verifyOtp(){
    if(busy)return;
    const token=$('authOtpCode').value.trim();
    if(!/^\d{6}$/.test(token)){msg(tr('invalidCode'),true);return;}
    setBusy(true);msg(tr('working'));
    try{
      const {data,error}=await client.auth.verifyOtp({email:pendingEmail,token,type:'email'});
      if(error)throw error;
      if(data.user)fire('fasalsathi:authenticated',{user:data.user});
    }catch(error){msg(error?.message||'The code could not be verified.',true);}
    finally{setBusy(false);}
  }
  async function googleLogin(){
    if(busy)return;
    setBusy(true);msg(tr('working'));
    try{
      const {error}=await client.auth.signInWithOAuth({
        provider:'google',
        options:{redirectTo:window.location.origin+window.location.pathname}
      });
      if(error)throw error;
    }catch(error){msg(error?.message||'Google sign-in is not configured yet.',true);setBusy(false);}
  }
  async function forgotPassword(){
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
    try{
      const {error}=await client.auth.signOut();if(error)throw error;
      fire('fasalsathi:signedout');
    }catch(error){msg(error?.message||'Could not sign out.',true);}
    finally{setBusy(false);}
  }
  function bind(){
    $('authPasswordTab').addEventListener('click',()=>setMethod('password'));
    $('authOtpTab').addEventListener('click',()=>setMethod('otp'));
    $('authIntentToggle').addEventListener('click',()=>setIntent(intent==='login'?'signup':'login'));
    $('authPasswordForm').addEventListener('submit',onPasswordSubmit);
    $('authSendOtp').addEventListener('click',requestOtp);
    $('authVerifyOtp').addEventListener('click',verifyOtp);
    $('authResendOtp').addEventListener('click',requestOtp);
    $('authGoogle').addEventListener('click',googleLogin);
    $('authForgot').addEventListener('click',forgotPassword);
    $('signOutBtn').addEventListener('click',signOut);
    $('authChangeEmail').addEventListener('click',()=>{$('authOtpCode').value='';$('authOtpView').querySelector('.auth-otp-entry').hidden=true;pendingEmail='';msg('');});
    window.addEventListener('fasalsathi:language-changed',updateText);
    window.addEventListener('fasalsathi:show-auth',authScreen);
    if(!client){$('authGoogle').disabled=true;$('authSubmit').disabled=true;$('authSendOtp').disabled=true;}
    setIntent('login');setMethod('password');
  }
  async function restoreSession(){
    if(!client)return;
    try{
      const {data,error}=await client.auth.getSession();
      if(error)throw error;
      if(data.session?.user)fire('fasalsathi:authenticated',{user:data.session.user});
    }catch(error){msg(error?.message||'Could not restore your session.',true);}
  }
  bind();
  restoreSession();
  if(client){
    client.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_IN'&&session?.user)fire('fasalsathi:authenticated',{user:session.user});
      if(event==='SIGNED_OUT')fire('fasalsathi:signedout');
    });
  }
})();