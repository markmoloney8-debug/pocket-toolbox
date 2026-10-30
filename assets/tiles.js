(function(){
  const {$,num,m2,store,seg,mountRoom,room}=PT;
  let tileArea=store.get('pt-tarea')||'floor';
  const WASTE={straight:.10,brick:.10,diagonal:.15,herringbone:.15};
  function tileCalc(area,o){
    const tileM2=(o.w*o.h)/1e6,waste=WASTE[o.layout]||.1;
    const tiles=area>0?Math.ceil(area/tileM2*(1+waste)):0;
    const boxes=Math.ceil(tiles/Math.max(1,o.box));
    const big=Math.max(o.w,o.h),adhRate=big<=150?3:big<=300?4:big<=600?5.5:7,adhKg=area*adhRate;
    const groutKg=o.gap>0?area*((o.w+o.h)/(o.w*o.h))*o.thk*o.gap*1.6*1.1:0;
    const perTile=(o.layout==='brick'||o.layout==='herringbone')?2:1;
    const spacers=o.gap>0?Math.ceil(tiles*perTile/50)*50:0;
    return {tiles,boxes,waste,adhKg,adhBags:Math.ceil(adhKg/20),groutKg,spacers};
  }
  function startPoint(span,p){
    if(span<=0||p<=0)return null;
    const score=c=>(c<=3||p-c<=3)?p:c;
    const joint=(span/2)%p,tile=span>=p?((span-p)/2)%p:span;
    return score(tile)>=score(joint)?{mode:'tile',cut:tile,full:score(tile)===p}:{mode:'joint',cut:joint,full:score(joint)===p};
  }
  function render(r){
    r=r||room();
    seg('data-tarea',tileArea);$('tCustom').hidden=tileArea!=='custom';
    const area=tileArea==='floor'?r.floor:tileArea==='walls'?r.walls:num('tCW')*num('tCH');
    const o={w:num('tW',300),h:num('tH',300),gap:num('tGap'),thk:num('tThk',8),layout:$('tLayout').value,box:num('tBox',1)};
    const t=tileCalc(area,o);
    $('tArea').textContent=m2(area);$('tCount').textContent=t.tiles||'–';$('tBoxes').textContent=t.boxes||'–';
    $('tAdh').textContent=t.adhKg?`${t.adhBags} × 20 kg`:'–';
    $('tGrout').textContent=o.gap>0?(Math.ceil(t.groutKg*2)/2).toFixed(1)+' kg':'None';
    $('tSpacers').textContent=t.spacers?'~'+t.spacers:'None';
    $('tWasteNote').textContent=`Includes ${Math.round(t.waste*100)}% extra for cuts and breakages with a ${$('tLayout').selectedOptions[0].text.toLowerCase()} layout. Keep a few spares for future repairs. Adhesive and grout are estimates, so check the bag's coverage chart.`;
    const st=$('tStart');
    if(tileArea==='floor'&&(o.layout==='straight'||o.layout==='brick')&&r.L>0&&r.W>0){
      const a=startPoint(r.L*1000,o.w+o.gap),b=startPoint(r.W*1000,o.h+o.gap);
      const line=(s,dir)=>s.full?`${dir}, tiles fit with no cut at the walls if you put a ${s.mode==='tile'?'tile':'grout line'} on the centre line.`:`${dir}, put a ${s.mode==='tile'?'tile':'grout line'} on the centre line. The tiles at both walls will be cut to about ${Math.round(s.cut)} mm.`;
      st.innerHTML=`<b>Where to start.</b> Mark the centre of the room both ways and work outwards so the cuts at opposite walls match. ${line(a,'Along the length')} ${line(b,'Across the width')}`;
    }else if(tileArea==='floor'){
      st.innerHTML='<b>Where to start.</b> For diagonal and herringbone layouts, start from a centre line through the room and dry-lay a row first to check the edge cuts.';
    }else{
      st.innerHTML='<b>Where to start.</b> On walls, fix a straight timber batten one tile up from the floor or worktop and tile upwards from it. Fill the bottom row last once the batten comes off.';
    }
  }
  document.querySelectorAll('[data-tarea]').forEach(b=>b.addEventListener('click',()=>{tileArea=b.dataset.tarea;store.set('pt-tarea',tileArea);render();}));
  ['tCW','tCH','tW','tH','tGap','tThk','tLayout','tBox'].forEach(id=>{$(id).addEventListener('input',()=>render());$(id).addEventListener('change',()=>render());});
  mountRoom($('room'),render);
})();
