(() => {
  'use strict';
  const localeCopy = {
    en: {
      title:'FASALSATHI — Farmer crop health and field intelligence',
      description:'FASALSATHI helps tomato growers review crop photos, understand local weather-led disease suitability and keep field records together.',
      brandSub:'CROP INTELLIGENCE',
      scanAlt:'Selected crop photo preview',
      mapLabel:'Field location map'
    },
    hi: {
      title:'FASALSATHI — किसान फसल स्वास्थ्य और खेत जानकारी',
      description:'FASALSATHI टमाटर किसानों को फसल की फोटो जाँचने, स्थानीय मौसम के आधार पर रोग अनुकूलता समझने और खेत का रिकॉर्ड रखने में मदद करता है।',
      brandSub:'फसल की जानकारी',
      scanAlt:'चुनी गई फसल की फोटो का पूर्वावलोकन',
      mapLabel:'खेत का स्थान मानचित्र'
    },
    mr: {
      title:'FASALSATHI — शेतकरी पीक आरोग्य आणि शेत माहिती',
      description:'FASALSATHI टोमॅटो उत्पादकांना पीक फोटो तपासणे, स्थानिक हवामानावर आधारित रोग अनुकूलता समजणे आणि शेताच्या नोंदी ठेवणे यासाठी मदत करते.',
      brandSub:'पीक माहिती',
      scanAlt:'निवडलेल्या पिकाच्या फोटोचे पूर्वदृश्य',
      mapLabel:'शेताच्या स्थानाचा नकाशा'
    }
  };
  function applySiteLocale(){
    const lang=['hi','mr','en'].includes(document.documentElement.lang)?document.documentElement.lang:'en';
    const t=localeCopy[lang];
    document.title=t.title;
    const description=document.querySelector('meta[name="description"]');
    if(description)description.setAttribute('content',t.description);
    const brandSub=document.querySelector('.side-brand-sub');
    if(brandSub)brandSub.textContent=t.brandSub;
    const preview=document.getElementById('globalScanPreview');
    if(preview)preview.alt=t.scanAlt;
    const map=document.getElementById('map');
    if(map)map.setAttribute('aria-label',t.mapLabel);
  }
  window.addEventListener('fasalsathi:language-changed',applySiteLocale);
  window.addEventListener('pageshow',applySiteLocale);
  applySiteLocale();
})();