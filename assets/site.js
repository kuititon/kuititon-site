/* kuititon.com: language switch (Finnish in the markup, English in data-en) and app link. */
(function(){
  // Set this to the app's address when the web app is live, e.g. 'https://app.kuititon.com/'
  var APP_URL='';
  var KEY='kuititon-lang',root=document.documentElement;
  function stored(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  var lang=stored()||((navigator.language||'fi').toLowerCase().indexOf('fi')===0?'fi':'en');
  function apply(){
    root.lang=lang;
    document.querySelectorAll('[data-en]').forEach(function(el){
      if(el.dataset.fi===undefined)el.dataset.fi=el.innerHTML;
      el.innerHTML=lang==='en'?el.dataset.en:el.dataset.fi;
    });
    var t=document.querySelector('meta[name="title-'+lang+'"]');if(t)document.title=t.content;
    var dm=document.querySelector('meta[name=description]'),de=document.querySelector('meta[name=desc-en]');if(dm&&de){if(dm.dataset.fi===undefined)dm.dataset.fi=dm.content;dm.content=lang==='en'?de.content:dm.dataset.fi}
    document.querySelectorAll('[data-aria-en]').forEach(function(el){if(el.dataset.ariaFi===undefined)el.dataset.ariaFi=el.getAttribute('aria-label');el.setAttribute('aria-label',lang==='en'?el.dataset.ariaEn:el.dataset.ariaFi)});
    document.querySelectorAll('.login-msg:not([hidden])').forEach(function(m){m.textContent=lang==='en'?m.dataset.en:m.dataset.fi});
    var sg=document.getElementById('langSeg');
    if(sg){sg.dataset.on=lang;sg.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.lang===lang))})}
  }
  var mb=document.getElementById('menuBtn'),mp=document.getElementById('menuPanel');
  function menu(open){if(!mb||!mp)return;mp.hidden=!open;mb.setAttribute('aria-expanded',String(open))}
  document.addEventListener('click',function(e){
    var s=e.target.closest('#langSeg');
    if(s){var bt=e.target.closest('button[data-lang]');lang=bt?bt.dataset.lang:(lang==='fi'?'en':'fi');try{localStorage.setItem(KEY,lang)}catch(e2){}apply();return}
    if(e.target.closest('#menuBtn')){menu(mp.hidden);return}
    if(mp&&!mp.hidden&&(!e.target.closest('.menu-card')||e.target.closest('.menu-card a')))menu(false);
  });
  /* sign-in dropdown (desktop) and inline form (phone menu) */
  var lb=document.getElementById('loginBtn'),lp=document.getElementById('loginPanel');
  var mlb=document.getElementById('mLoginBtn'),mlx=document.getElementById('mLoginBox');
  function login(open){
    if(!lb||!lp)return;lp.hidden=!open;lb.setAttribute('aria-expanded',String(open));
    if(open){var f=document.getElementById('dEmail');if(f)setTimeout(function(){f.focus()},30)}
  }
  function mlogin(open){
    if(!mlb||!mlx)return;mlx.hidden=!open;mlb.setAttribute('aria-expanded',String(open));
    if(open){
      var card=document.querySelector('.menu-card'),f=document.getElementById('mEmail');
      var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
      /* scroll the menu down so the whole form is shown */
      setTimeout(function(){if(card)card.scrollTo({top:card.scrollHeight,behavior:calm?'auto':'smooth'});if(f)f.focus({preventScroll:true})},30);
    }
  }
  document.addEventListener('click',function(e){
    if(e.target.closest('#loginBtn')){login(lp.hidden);return}
    if(e.target.closest('#mLoginBtn')){mlogin(mlx.hidden);return}
    if(lp&&!lp.hidden&&!e.target.closest('.login-card'))login(false);
  });
  document.addEventListener('submit',function(e){
    var f=e.target.closest('[data-login]');if(!f)return;
    e.preventDefault();
    var msg=f.querySelector('.login-msg'),em=f.querySelector('input[name=email]'),pw=f.querySelector('input[name=password]');
    function say(fi,en){msg.hidden=false;msg.dataset.fi=fi;msg.dataset.en=en;msg.textContent=lang==='en'?en:fi}
    if(!em.value.trim()||!pw.value){say('Syötä sähköposti ja salasana.','Enter your email and password.');return}
    if(!APP_URL){pw.value='';say('Sovellus avautuu pian. Kirjautuminen ei ole vielä käytössä, eikä tietojasi tallenneta.','The app opens soon. Signing in is not available yet, and nothing you typed is stored.');return}
    /* TODO when the app is live: sign in here with the Supabase client (email + password), then go to APP_URL.
       Never put the email or password in the address. */
    pw.value='';window.location.href=APP_URL;
  });
  /* in-page links: put the target just below the sticky header, whichever element scrolls; measured and corrected afterwards */
  function scroller(t){
    var el=t.parentElement;
    while(el&&el!==document.documentElement){
      var cs=getComputedStyle(el);
      if(/(auto|scroll)/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+1&&(el!==document.body||/(auto|scroll)/.test(getComputedStyle(document.documentElement).overflowY)===false&&document.documentElement.scrollHeight<=document.documentElement.clientHeight+1))return el;
      el=el.parentElement;
    }
    return null;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;
    var t=document.getElementById(a.getAttribute('href').slice(1));if(!t)return;
    e.preventDefault();
    var tries=0,calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
    function pos(sc){return sc?sc.scrollTop:window.pageYOffset}
    function to(sc,y){if(sc)sc.scrollTo({top:y,behavior:'instant'});else window.scrollTo({top:y,behavior:'instant'})}
    function want(){var h=document.querySelector('.site-head'),off=(h?h.getBoundingClientRect().height:0)+16;return {off:off,d:t.getBoundingClientRect().top-off}}
    /* final check: layout may have shifted while scrolling, so measure again and nudge */
    function fix(){
      var w=want();if(Math.abs(w.d)<=2||tries>=4)return;
      var sc=scroller(t),b=pos(sc);to(sc,b+w.d);
      if(pos(sc)===b){t.style.scrollMarginTop=w.off+'px';t.scrollIntoView({block:'start'});return}
      tries++;requestAnimationFrame(function(){requestAnimationFrame(fix)});
    }
    var sc=scroller(t),w0=want(),start=pos(sc);
    if(calm||Math.abs(w0.d)<2){fix();return}
    to(sc,start+Math.min(1,Math.abs(w0.d))*Math.sign(w0.d));
    if(pos(sc)===start){t.style.scrollMarginTop=w0.off+'px';t.scrollIntoView({behavior:'smooth',block:'start'});return}
    to(sc,start);
    var dur=Math.min(900,350+Math.abs(w0.d)*0.25),t0=null;
    function frame(ts){
      if(t0===null)t0=ts;
      var p=Math.min(1,(ts-t0)/dur),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
      to(sc,start+w0.d*e);
      if(p<1)requestAnimationFrame(frame);else fix();
    }
    requestAnimationFrame(frame);
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){menu(false);login(false)}});
  if(APP_URL){
    document.querySelectorAll('[data-app-link]').forEach(function(a){a.href=APP_URL});
    document.querySelectorAll('[data-app-soon]').forEach(function(el){el.hidden=true});
    document.querySelectorAll('[data-app-live]').forEach(function(el){el.hidden=false});
  }
  apply();
  /* a fresh page always starts at the top (some viewers keep the previous page's scroll position); Back/Forward keeps its place */
  function toTop(){
    var n=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
    if(n.type==='back_forward'||location.hash)return;
    window.scrollTo(0,0);
  }
  toTop();window.addEventListener('load',toTop);window.addEventListener('pageshow',function(e){if(!e.persisted)toTop()});
})();

/* subscription phone: Business / Projects switch */
(function(){
  document.querySelectorAll('.pl-card').forEach(function(card){
    var btns=card.querySelectorAll('.pl-seg button');
    btns.forEach(function(b){b.addEventListener('click',function(){
      card.setAttribute('data-plan',b.getAttribute('data-plan'));
      btns.forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on?'true':'false')});
    })});
  });
})();
