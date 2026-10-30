(function(){
  const {$}=PT;
  const toMm={mm:1,cm:10,m:1000,in:25.4,ft:304.8,yd:914.4};
  const names={mm:'Millimetres',cm:'Centimetres',m:'Metres',in:'Inches',ft:'Feet',yd:'Yards'};
  const cv=$('convVal'),cu=$('convUnit'),co=$('convOut');
  function fmt(n){if(!isFinite(n))return '–';const a=Math.abs(n);return (a>=1000?n.toFixed(0):a>=10?n.toFixed(1):n.toFixed(2)).replace(/\.0+$|(\.\d*?)0+$/,'$1');}
  function convert(){
    const mm=parseFloat(cv.value)*toMm[cu.value];let html='';
    for(const u of Object.keys(toMm)){if(u===cu.value)continue;html+=`<div><span class="label">${names[u]}</span><span>${isNaN(mm)?'–':fmt(mm/toMm[u])}</span></div>`;}
    if(!isNaN(mm)){const tIn=mm/25.4,ft=Math.floor(tIn/12),inch=tIn-ft*12;html+=`<div><span class="label">Feet + inches</span><span>${ft}′ ${inch.toFixed(1)}″</span></div>`;}
    co.innerHTML=html;
  }
  cv.addEventListener('input',convert);cu.addEventListener('change',convert);convert();
})();
