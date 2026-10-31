(() => {
  'use strict';
  const client = window.fasalsathiSupabase;
  const $ = (id) => document.getElementById(id);
  const copy = {
    en: {
      signOut:'Sign out',emailPlaceholder:'name@example.com',namePlaceholder:'Enter your name',passwordPlaceholder:'At least 8 characters',loginPasswordPlaceholder:'Enter your password',confirmPlaceholder:'Re-enter your password',eyebrow:'FARMER ACCOUNT', title:'Know your crop. Protect your harvest.',
      subtitle:'Bring crop photo checks, local weather insight and field records together in one simple workspace.',
      storyKicker:'FIELD-FIRST FARMING', storyOverline:'A PRACTICAL COMPANION FOR YOUR FARM',
      feature1Title:'Photo health checks',feature1Text:'AI-assisted tomato leaf assessment',
      feature2Title:'Local weather outlook',feature2Text:'Weather-led TOMCAST risk guidance',
      feature3Title:'Field journal',feature3Text:'Keep field details and scan history together',
      storyFoot:'Tomato crop support is available in this release.',
      panelKicker:'YOUR FARM WORKSPACE',panelTitle:'Welcome to FASALSATHI',panelSubtitle:'Sign in or create your free farmer account.',
      signInTab:'Sign in',createTab:'Create account',name:'Full name',email:'Email address',pass:'Password',
      confirmPass:'Confirm password',passwordHint:'Use at least 8 characters.',confirmHint:'Enter the same password again.',
      show:'Show',hide:'Hide',submitLogin:'Sign in securely',submitSignup:'Create my account',forgot:'Forgot password?',
      confirm:'Your account has been created. Check your inbox and spam folder for the confirmation email, then return here to sign in.',
      resetSent:'If an account exists for this email, a password reset message will be sent. Check your inbox and spam folder.',
      note:'Your password is securely handled by Supabase. Never share your password or one-time links with anyone.',
      local:'Cloud synchronization for field records is being prepared. Your current records remain on this device.',
      supportLine:'A smarter start for every growing season',
      noClient:'The sign-in service is not available right now. Refresh the page and try again.',
      emailMissing:'Enter a valid email address.',nameMissing:'Enter your name to create an account.',
      passwordShort:'Your password must contain at least 8 characters.',
      passwordMismatch:'The passwords do not match. Re-enter them and try again.',
      wrongCredentials:'The email address or password is incorrect. Check both and try again.',
      notConfirmed:'Please confirm your email address before signing in. Check your inbox and spam folder.',
      exists:'An account with this email may already exist. Choose Sign in instead.',
      rateLimited:'Too many attempts. Wait a minute before trying again.',
      network:'We could not reach the sign-in service. Check your internet connection and retry.',
      working:'Please wait…',signedOut:'You have been signed out.',
      loginSuccess:'You are signed in.'
    },
    hi: {
      signOut:'लॉग आउट',emailPlaceholder:'name@example.com',namePlaceholder:'अपना नाम लिखें',passwordPlaceholder:'कम से कम 8 अक्षर',loginPasswordPlaceholder:'अपना पासवर्ड डालें',confirmPlaceholder:'पासवर्ड दोबारा डालें',eyebrow:'किसान खाता',title:'अपनी फसल जानें। अपनी उपज बचाएँ।',
      subtitle:'फसल की फोटो जाँच, स्थानीय मौसम की जानकारी और खेत का रिकॉर्ड एक ही आसान जगह पर रखें।',
      storyKicker:'खेत-केंद्रित खेती',storyOverline:'आपके खेत के लिए एक उपयोगी साथी',
      feature1Title:'फोटो से फसल जाँच',feature1Text:'टमाटर की पत्ती का AI आकलन',
      feature2Title:'स्थानीय मौसम पूर्वानुमान',feature2Text:'मौसम आधारित TOMCAST जोखिम जानकारी',
      feature3Title:'खेत की डायरी',feature3Text:'खेत का विवरण और फोटो जाँच का इतिहास',
      storyFoot:'इस संस्करण में टमाटर की फसल उपलब्ध है।',
      panelKicker:'आपका खेत कार्यक्षेत्र',panelTitle:'FASALSATHI में आपका स्वागत है',panelSubtitle:'लॉगिन करें या अपना मुफ़्त किसान खाता बनाएँ।',
      signInTab:'लॉगिन',createTab:'खाता बनाएँ',name:'पूरा नाम',email:'ईमेल पता',pass:'पासवर्ड',
      confirmPass:'पासवर्ड की पुष्टि करें',passwordHint:'कम से कम 8 अक्षरों का पासवर्ड रखें।',confirmHint:'वही पासवर्ड दोबारा डालें।',
      show:'दिखाएँ',hide:'छिपाएँ',submitLogin:'सुरक्षित लॉगिन करें',submitSignup:'मेरा खाता बनाएँ',forgot:'पासवर्ड भूल गए?',
      confirm:'आपका खाता बन गया है। ईमेल पुष्टि संदेश के लिए इनबॉक्स और स्पैम फ़ोल्डर देखें, फिर यहाँ लॉगिन करें।',
      resetSent:'यदि इस ईमेल पर खाता मौजूद है, तो पासवर्ड रीसेट संदेश भेजा जाएगा। इनबॉक्स और स्पैम फ़ोल्डर देखें।',
      note:'आपका पासवर्ड Supabase सुरक्षित रखता है। अपना पासवर्ड या लॉगिन लिंक किसी से साझा न करें।',
      local:'खेत के रिकॉर्ड का क्लाउड सिंक तैयार किया जा रहा है। आपका मौजूदा रिकॉर्ड इसी डिवाइस पर रहेगा।',
      supportLine:'हर फसल मौसम की बेहतर शुरुआत',
      noClient:'लॉगिन सेवा अभी उपलब्ध नहीं है। पेज रीफ्रेश करके फिर प्रयास करें।',
      emailMissing:'सही ईमेल पता डालें।',nameMissing:'खाता बनाने के लिए अपना नाम डालें।',
      passwordShort:'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।',
      passwordMismatch:'दोनों पासवर्ड मेल नहीं खाते। दोबारा जाँचें।',
      wrongCredentials:'ईमेल या पासवर्ड गलत है। दोनों जाँचकर फिर प्रयास करें।',
      notConfirmed:'लॉगिन से पहले ईमेल की पुष्टि करें। इनबॉक्स और स्पैम फ़ोल्डर देखें।',
      exists:'इस ईमेल से खाता पहले से हो सकता है। लॉगिन विकल्प चुनें।',
      rateLimited:'बहुत अधिक प्रयास हुए हैं। एक मिनट रुककर फिर प्रयास करें।',
      network:'लॉगिन सेवा से संपर्क नहीं हो पाया। इंटरनेट जाँचकर फिर प्रयास करें।',
      working:'कृपया प्रतीक्षा करें…',signedOut:'आप लॉग आउट हो गए हैं।',
      loginSuccess:'आप सफलतापूर्वक लॉगिन हो गए हैं।'
    },
    mr: {
      signOut:'लॉग आउट',emailPlaceholder:'name@example.com',namePlaceholder:'तुमचे नाव लिहा',passwordPlaceholder:'किमान 8 अक्षरे',loginPasswordPlaceholder:'तुमचा पासवर्ड टाका',confirmPlaceholder:'पासवर्ड पुन्हा टाका',eyebrow:'शेतकरी खाते',title:'तुमचे पीक ओळखा. तुमचे उत्पादन जपा.',
      subtitle:'पीक फोटो तपासणी, स्थानिक हवामान माहिती आणि शेताची नोंद एकाच सोप्या ठिकाणी ठेवा.',
      storyKicker:'शेत-केंद्रित शेती',storyOverline:'तुमच्या शेतासाठी उपयुक्त साथीदार',
      feature1Title:'फोटोद्वारे पीक तपासणी',feature1Text:'टोमॅटोच्या पानाचे AI मूल्यांकन',
      feature2Title:'स्थानिक हवामान अंदाज',feature2Text:'हवामानावर आधारित TOMCAST जोखीम मार्गदर्शन',
      feature3Title:'शेताची नोंदवही',feature3Text:'शेताची माहिती आणि फोटो तपासणीचा इतिहास',
      storyFoot:'या आवृत्तीत टोमॅटो पिकासाठी सहाय्य उपलब्ध आहे.',
      panelKicker:'तुमचे शेत कार्यक्षेत्र',panelTitle:'FASALSATHI मध्ये स्वागत आहे',panelSubtitle:'लॉगिन करा किंवा तुमचे मोफत शेतकरी खाते तयार करा.',
      signInTab:'लॉगिन',createTab:'खाते तयार करा',name:'पूर्ण नाव',email:'ईमेल पत्ता',pass:'पासवर्ड',
      confirmPass:'पासवर्डची पुष्टी करा',passwordHint:'किमान 8 अक्षरांचा पासवर्ड वापरा.',confirmHint:'तोच पासवर्ड पुन्हा टाका.',
      show:'दाखवा',hide:'लपवा',submitLogin:'सुरक्षित लॉगिन करा',submitSignup:'माझे खाते तयार करा',forgot:'पासवर्ड विसरलात?',
      confirm:'तुमचे खाते तयार झाले आहे. ईमेल पुष्टीसाठी इनबॉक्स आणि स्पॅम फोल्डर तपासा, नंतर येथे लॉगिन करा.',
      resetSent:'या ईमेलवर खाते असल्यास पासवर्ड रीसेट संदेश पाठवला जाईल. इनबॉक्स आणि स्पॅम फोल्डर तपासा.',
      note:'तुमचा पासवर्ड Supabase सुरक्षित ठेवते. पासवर्ड किंवा लॉगिन लिंक कोणाशीही शेअर करू नका.',
      local:'शेत नोंदींचे क्लाउड सिंक तयार केले जात आहे. सध्याच्या नोंदी या डिव्हाइसवरच राहतील.',
      supportLine:'प्रत्येक हंगामाची अधिक चांगली सुरुवात',
      noClient:'लॉगिन सेवा सध्या उपलब्ध नाही. पेज रीफ्रेश करून पुन्हा प्रयत्न करा.',
      emailMissing:'योग्य ईमेल पत्ता टाका.',nameMissing:'खाते तयार करण्यासाठी तुमचे नाव टाका.',
      passwordShort:'पासवर्डमध्ये किमान 8 अक्षरे असावीत.',
      passwordMismatch:'दोन्ही पासवर्ड जुळत नाहीत. पुन्हा तपासा.',
      wrongCredentials:'ईमेल किंवा पासवर्ड चुकीचा आहे. दोन्ही तपासून पुन्हा प्रयत्न करा.',
      notConfirmed:'लॉगिनपूर्वी ईमेलची पुष्टी करा. इनबॉक्स आणि स्पॅम फोल्डर तपासा.',
      exists:'या ईमेलवर खाते आधीच असू शकते. लॉगिन पर्याय निवडा.',
      rateLimited:'खूप प्रयत्न झाले आहेत. एक मिनिट थांबून पुन्हा प्रयत्न करा.',
      network:'लॉगिन सेवेशी संपर्क झाला नाही. इंटरनेट तपासून पुन्हा प्रयत्न करा.',
      working:'कृपया थांबा…',signedOut:'तुम्ही लॉग आउट झाला आहात.',
      loginSuccess:'तुम्ही यशस्वीपणे लॉगिन झाला आहात.'
    }
  };
  let intent='login',busy=false,lastHandledUserId='';
  const tr=(key)=>(copy[document.documentElement.lang]||copy.en)[key]||copy.en[key]||key;
  const msg=(text,error=false)=>{
    const node=$('authMessage');if(!node)return;
    node.textContent=text||'';node.classList.toggle('error',!!error);
    node.setAttribute('role',error?'alert':'status');
  };
  const fire=(name,detail={})=>window.dispatchEvent(new CustomEvent(name,{detail}));
  const validEmail=(email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const setBusy=(value)=>{
    busy=value;
    ['authSubmit','authForgot','authLoginTab','authSignupTab'].forEach(id=>{if($(id))$(id).disabled=value;});
  };
  function updateText(){
    const pairs=[
      ['authEyebrow','eyebrow'],['authStoryKicker','storyKicker'],['authStoryOverline','storyOverline'],
      ['authStoryTitle','title'],['authStoryText','subtitle'],
      ['authFeatureOneTitle','feature1Title'],['authFeatureOneText','feature1Text'],
      ['authFeatureTwoTitle','feature2Title'],['authFeatureTwoText','feature2Text'],
      ['authFeatureThreeTitle','feature3Title'],['authFeatureThreeText','feature3Text'],
      ['authStoryFoot','storyFoot'],['authPanelKicker','panelKicker'],['authPanelTitle','panelTitle'],
      ['authPanelSubtitle','panelSubtitle'],['authNameLabel','name'],['authEmailLabel','email'],
      ['authPasswordLabel','pass'],['authConfirmPasswordLabel','confirmPass'],
      ['authPasswordHint','passwordHint'],['authConfirmHint','confirmHint'],
      ['authForgot','forgot'],['authSecurityText','note'],['authLocalNote','local'],
      ['authSupportLine','supportLine']
    ];
    pairs.forEach(([id,key])=>{if($(id))$(id).textContent=tr(key);});
    $('authLoginTab').textContent=tr('signInTab');
    $('authSignupTab').textContent=tr('createTab');
    $('authSubmit').textContent=tr(intent==='signup'?'submitSignup':'submitLogin');
    $('authTogglePassword').textContent=$('authPassword').type==='password'?tr('show'):tr('hide');
    $('authToggleConfirm').textContent=$('authConfirmPassword').type==='password'?tr('show'):tr('hide');
    $('authPassword').placeholder=intent==='signup'?'At least 8 characters':'Enter your password';
    $('authConfirmPassword').placeholder=tr('confirmHint');
  }
  function setIntent(next){
    intent=next;
    const signingUp=intent==='signup';
    $('authNameField').hidden=!signingUp;
    $('authConfirmField').hidden=!signingUp;
    $('authFullName').required=signingUp;
    $('authConfirmPassword').required=signingUp;
    $('authPassword').autocomplete=signingUp?'new-password':'current-password';
    $('authLoginTab').classList.toggle('is-active',!signingUp);
    $('authSignupTab').classList.toggle('is-active',signingUp);
    $('authLoginTab').setAttribute('aria-selected',String(!signingUp));
    $('authSignupTab').setAttribute('aria-selected',String(signingUp));
    $('authSubmit').textContent=tr(signingUp?'submitSignup':'submitLogin');
    $('authPassword').value='';
    $('authConfirmPassword').value='';
    msg('');updateText();
  }
  function safeError(error){
    const raw=String(error?.message||'').toLowerCase();
    if(raw.includes('invalid login credentials')||raw.includes('invalid_credentials'))return tr('wrongCredentials');
    if(raw.includes('email not confirmed')||raw.includes('email_not_confirmed'))return tr('notConfirmed');
    if(raw.includes('already registered')||raw.includes('user already exists'))return tr('exists');
    if(raw.includes('password should be')||raw.includes('password is too short'))return tr('passwordShort');
    if(raw.includes('rate limit')||raw.includes('too many requests')||raw.includes('429'))return tr('rateLimited');
    if(raw.includes('failed to fetch')||raw.includes('network')||raw.includes('load failed'))return tr('network');
    return error?.message||tr('network');
  }
  async function onPasswordSubmit(event){
    event.preventDefault();if(busy)return;
    if(!client){msg(tr('noClient'),true);return;}
    const email=$('authEmail').value.trim().toLowerCase();
    const password=$('authPassword').value;
    const fullName=$('authFullName').value.trim();
    if(!validEmail(email)){msg(tr('emailMissing'),true);$('authEmail').focus();return;}
    if(intent==='signup'&&fullName.length<2){msg(tr('nameMissing'),true);$('authFullName').focus();return;}
    if(intent==='signup'&&password.length<8){msg(tr('passwordShort'),true);$('authPassword').focus();return;}
    if(intent==='signup'&&password!==$('authConfirmPassword').value){msg(tr('passwordMismatch'),true);$('authConfirmPassword').focus();return;}
    setBusy(true);msg(tr('working'));
    try{
      if(intent==='signup'){
        const {data,error}=await client.auth.signUp({email,password,options:{
          data:{full_name:fullName},
          emailRedirectTo:window.location.origin+window.location.pathname
        }});
        if(error)throw error;
        if(data.session&&data.user){
          lastHandledUserId=data.user.id;fire('fasalsathi:authenticated',{user:data.user});
          msg(tr('loginSuccess'));
        }else{
          msg(tr('confirm'));
        }
      }else{
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error)throw error;
        if(data.user){lastHandledUserId=data.user.id;fire('fasalsathi:authenticated',{user:data.user});}
        msg(tr('loginSuccess'));
      }
    }catch(error){msg(safeError(error),true);}
    finally{setBusy(false);}
  }
  async function forgotPassword(){
    if(busy)return;
    if(!client){msg(tr('noClient'),true);return;}
    const email=$('authEmail').value.trim().toLowerCase();
    if(!validEmail(email)){msg(tr('emailMissing'),true);$('authEmail').focus();return;}
    setBusy(true);msg(tr('working'));
    try{
      const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
      if(error)throw error;
      msg(tr('resetSent'));
    }catch(error){msg(safeError(error),true);}
    finally{setBusy(false);}
  }
  function toggleVisibility(inputId,buttonId){
    const input=$(inputId),button=$(buttonId);if(!input||!button)return;
    const visible=input.type==='password';input.type=visible?'text':'password';
    button.setAttribute('aria-pressed',String(visible));
    button.setAttribute('aria-label',visible?tr('hide'):tr('show'));
    button.textContent=visible?tr('hide'):tr('show');
  }
  async function signOut(){
    if(!client)return;
    setBusy(true);
    try{const {error}=await client.auth.signOut();if(error)throw error;fire('fasalsathi:signedout');}
    catch(error){msg(safeError(error),true);}
    finally{setBusy(false);}
  }
  function bind(){
    $('authLoginTab').addEventListener('click',()=>setIntent('login'));
    $('authSignupTab').addEventListener('click',()=>setIntent('signup'));
    $('authPasswordForm').addEventListener('submit',onPasswordSubmit);
    $('authForgot').addEventListener('click',forgotPassword);
    $('authTogglePassword').addEventListener('click',()=>toggleVisibility('authPassword','authTogglePassword'));
    $('authToggleConfirm').addEventListener('click',()=>toggleVisibility('authConfirmPassword','authToggleConfirm'));
    $('signOutBtn').addEventListener('click',signOut);
    $('authEmail').addEventListener('input',()=>{if($('authMessage').classList.contains('error'))msg('');});
    $('authPassword').addEventListener('input',()=>{if($('authMessage').classList.contains('error'))msg('');});
    $('authConfirmPassword').addEventListener('input',()=>{if($('authMessage').classList.contains('error'))msg('');});
    window.addEventListener('fasalsathi:language-changed',updateText);
    window.addEventListener('fasalsathi:show-auth',updateText);
    if(!client){$('authSubmit').disabled=true;msg(tr('noClient'),true);}
    setIntent('login');
  }
  async function restoreSession(){
    if(!client)return;
    try{
      const {data,error}=await client.auth.getSession();if(error)throw error;
      if(data.session?.user){lastHandledUserId=data.session.user.id;fire('fasalsathi:authenticated',{user:data.session.user});}
    }catch(error){msg(safeError(error),true);}
  }
  bind();restoreSession();
  if(client)client.auth.onAuthStateChange((event,session)=>{
    if(event==='SIGNED_IN'&&session?.user&&session.user.id!==lastHandledUserId){
      lastHandledUserId=session.user.id;fire('fasalsathi:authenticated',{user:session.user});
    }
    if(event==='SIGNED_OUT'){lastHandledUserId='';fire('fasalsathi:signedout');}
  });
})();