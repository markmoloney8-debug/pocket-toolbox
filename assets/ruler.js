(function(){
  const {$,store}=PT;
  const svg=$('ruler'),slider=$('calibSlider'),card=$('cardOutline'),cn=$('calibNote');
  const full=$('fullRuler'),fullSvg=$('fullSvg');
  const CARD_SHORT_MM=53.98;
  let pxPerMm=parseFloat(store.get('pt-pxmm2'))||96/25.4,unit=store.get('pt-unit')||'cm',calibrated=!!store.get('pt-pxmm2');
  slider.value=pxPerMm;

  /* Draw a scale of the given length. Vertical scales run down the left edge, 0 at the top. */
  function scale(len,vertical){
    const ink=getComputedStyle(document.documentElement).getPropertyValue('--tape-ink').trim()||'#1b1a12';
    const cm=unit==='cm',step=cm?pxPerMm:pxPerMm*25.4/16,major=cm?10:16;
    const tick=i=>cm?(i%10===0?34:i%5===0?24:14):(i%16===0?36:i%8===0?28:i%4===0?20:i%2===0?14:9);
    const n=Math.floor(len/step);let out='';
    for(let i=0;i<=n;i++){
      const p=i*step+0.5,t=tick(i),w=i%major===0?1.5:1;
      out+=vertical?`<line x1="0" y1="${p}" x2="${t}" y2="${p}" stroke="${ink}" stroke-width="${w}"/>`
                   :`<line x1="${p}" y1="0" x2="${p}" y2="${t}" stroke="${ink}" stroke-width="${w}"/>`;
      if(i%major===0){
        const label=i/major;
        out+=vertical?`<text x="${t+8}" y="${Math.max(p+5,15)}" font-family="IBM Plex Mono,monospace" font-size="15" fill="${ink}">${label}</text>`
                     :(i>0?`<text x="${p}" y="54" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="13" fill="${ink}">${label}</text>`:'');
      }
    }
    return out;
  }

  function drawInline(){
    const w=svg.clientWidth;
    svg.setAttribute('viewBox',`0 0 ${w} 84`);
    const ink=getComputedStyle(document.documentElement).getPropertyValue('--tape-ink').trim();
    svg.innerHTML=scale(w,false)+`<text x="6" y="76" font-family="IBM Plex Sans,sans-serif" font-size="11" fill="${ink}">${unit==='cm'?'cm':'inches'}</text>`;
  }
  function drawFull(){
    if(full.hidden)return;
    const w=fullSvg.clientWidth,h=fullSvg.clientHeight,vertical=h>w;
    fullSvg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    fullSvg.innerHTML=scale(vertical?h:w,vertical);
    full.classList.toggle('is-vertical',vertical);
  }
  function drawAll(){
    drawInline();drawFull();
    card.style.width=(CARD_SHORT_MM*pxPerMm)+'px';
    cn.textContent=calibrated?'Set up for this screen. Your setting is saved on this device.':'Not set up yet. Until you match the card, the ruler is only approximate.';
    $('uCm').setAttribute('aria-pressed',unit==='cm');$('uIn').setAttribute('aria-pressed',unit==='in');
  }
  function setScale(v){
    pxPerMm=Math.min(+slider.max,Math.max(+slider.min,v));slider.value=pxPerMm;
    calibrated=true;store.set('pt-pxmm2',pxPerMm);drawAll();
  }
  slider.addEventListener('input',()=>setScale(+slider.value));
  $('calibMinus').addEventListener('click',()=>setScale(pxPerMm-0.02));
  $('calibPlus').addEventListener('click',()=>setScale(pxPerMm+0.02));
  $('uCm').addEventListener('click',()=>{unit='cm';store.set('pt-unit',unit);drawAll();});
  $('uIn').addEventListener('click',()=>{unit='in';store.set('pt-unit',unit);drawAll();});

  let lastFocus=null;
  $('fullBtn').addEventListener('click',()=>{
    lastFocus=document.activeElement;full.hidden=false;document.body.classList.add('locked');
    $('closeFull').focus();requestAnimationFrame(drawFull);
  });
  function closeFull(){full.hidden=true;document.body.classList.remove('locked');lastFocus&&lastFocus.focus();}
  $('closeFull').addEventListener('click',closeFull);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!full.hidden)closeFull();});

  window.addEventListener('resize',drawAll);
  window.addEventListener('orientationchange',()=>setTimeout(drawAll,250));
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',drawAll);
  new MutationObserver(drawAll).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  drawAll();
})();
