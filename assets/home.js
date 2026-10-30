(function(){
  const {store}=PT;
  /* ---------- App guide ---------- */
  const apps={
    iphone:[
      {n:'Measure',t:'built',tag:'Built in',job:'Measures heights, widths and lengths with the camera. Point, tap at one end, move to the other, tap again.',how:'Open the Measure app. Pro models with a LiDAR sensor are noticeably more accurate and can measure a person’s height automatically.'},
      {n:'Level (inside Measure)',t:'built',tag:'Built in',job:'A spirit level for shelves, pictures and worktops.',how:'Open Measure and tap Level at the bottom. Lay the phone flat or hold its edge against the thing you’re checking.'},
      {n:'Ruler AR or AR Ruler',t:'free',tag:'Free + paid',job:'Extra modes like area, angles and floor plans if Measure isn’t enough.',how:'Search the App Store. Free versions show ads.'}
    ],
    samsung:[
      {n:'Quick Measure',t:'built',tag:'Often built in',job:'Measures distance, length and height with the camera.',how:'Look for it in your apps or the Galaxy Store. Models with a depth sensor give the best results.'},
      {n:'Bubble Level',t:'free',tag:'Free',job:'A spirit level for shelves and pictures.',how:'Search the Play Store, or use our free spirit level.'},
      {n:'AR Ruler',t:'free',tag:'Free + paid',job:'Height, distance and area with extra modes.',how:'Search the Play Store. Free versions show ads.'}
    ],
    android:[
      {n:'AR Ruler',t:'free',tag:'Free + paid',job:'Measures heights, widths and lengths with the camera. Google’s own Measure app was discontinued, so this is the usual pick.',how:'Search the Play Store. Your phone needs Google Play Services for AR, which most recent phones have.'},
      {n:'Bubble Level',t:'free',tag:'Free',job:'A spirit level for shelves and pictures.',how:'Search the Play Store, or use our free spirit level.'},
      {n:'Google Lens',t:'built',tag:'Usually built in',job:'Not a tape measure, but handy for identifying a fitting or part you’re trying to replace.',how:'Open the camera or Google app and tap the Lens icon.'}
    ]
  };
  const list=document.getElementById('appList');
  function showApps(p){
    list.innerHTML=apps[p].map(a=>`<div class="app"><h3>${a.n}</h3><span class="chip ${a.t}">${a.tag}</span><p class="job">${a.job}</p><p class="how">${a.how}</p></div>`).join('');
    document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.phone===p));
    store.set('pt-phone',p);
  }
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>showApps(t.dataset.phone)));
  let guess=store.get('pt-phone');
  if(!guess){const ua=navigator.userAgent;guess=/iPhone|iPad/.test(ua)?'iphone':/SM-|Samsung/i.test(ua)?'samsung':/Android/.test(ua)?'android':'iphone';}
  showApps(guess);
})();
