(function(){
  const {$,store}=PT;
  const svg=$('ruler'),slider=$('calibSlider'),card=$('cardOutline'),cn=$('calibNote'),CARD_MM=85.6;
  let pxPerMm=parseFloat(store.get('pt-pxmm'))||96/25.4,unit=store.get('pt-unit')||'cm',calibrated=!!store.get('pt-pxmm');
  slider.value=pxPerMm;
  function drawRuler(){
    const w=svg.clientWidth,h=84;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const ink=getComputedStyle(document.documentElement).getPropertyValue('--tape-ink').trim();
    const t=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="13" fill="${ink}">${s}</text>`;
    let out='';
    if(unit==='cm'){
      const n=Math.floor(w/pxPerMm);
      for(let i=0;i<=n;i++){const x=i*pxPerMm+0.5,len=i%10===0?34:i%5===0?24:14;
        out+=`<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="${ink}" stroke-width="${i%10===0?1.5:1}"/>`;
        if(i%10===0&&i>0)out+=t(x,52,i/10);}
      out+=`<text x="6" y="76" font-family="IBM Plex Sans,sans-serif" font-size="11" fill="${ink}">cm</text>`;
    }else{
      const step=pxPerMm*25.4/16,n=Math.floor(w/step);
      for(let i=0;i<=n;i++){const x=i*step+0.5,len=i%16===0?36:i%8===0?28:i%4===0?20:i%2===0?14:9;
        out+=`<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="${ink}" stroke-width="${i%16===0?1.5:1}"/>`;
        if(i%16===0&&i>0)out+=t(x,54,i/16);}
      out+=`<text x="6" y="76" font-family="IBM Plex Sans,sans-serif" font-size="11" fill="${ink}">inches</text>`;
    }
    svg.innerHTML=out;
    card.style.width=Math.min(CARD_MM*pxPerMm,card.parentElement.clientWidth)+'px';
    cn.textContent=calibrated?'Set up for this screen. Your setting is saved on this device.':'Not set up yet. Until you match the card, the ruler is only approximate.';
    $('uCm').setAttribute('aria-pressed',unit==='cm');$('uIn').setAttribute('aria-pressed',unit==='in');
  }
  slider.addEventListener('input',()=>{pxPerMm=+slider.value;calibrated=true;store.set('pt-pxmm',pxPerMm);drawRuler();});
  $('uCm').addEventListener('click',()=>{unit='cm';store.set('pt-unit',unit);drawRuler();});
  $('uIn').addEventListener('click',()=>{unit='in';store.set('pt-unit',unit);drawRuler();});
  window.addEventListener('resize',drawRuler);
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',drawRuler);
  new MutationObserver(drawRuler).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  drawRuler();
})();
