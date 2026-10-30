/* Shared helpers for Pocket Toolbox pages */
window.PT=(function(){
  const store={
    get(k){try{return localStorage.getItem(k)}catch(e){return null}},
    set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  };
  const $=id=>document.getElementById(id);
  const num=(id,d=0)=>{const el=$(id);if(!el)return d;const v=parseFloat(el.value);return isFinite(v)&&v>=0?v:d;};
  const m2=v=>v.toFixed(1)+' m²';

  /* Room model shared by the paint and tile pages */
  const ROOM_IDS=['rLen','rWid','rHt','rDoors','rWins','rDoorA','rWinA'];
  const ROOM_HTML=`
    <h2 class="h3like" id="room-h" style="font-size:1.4rem">Your room</h2>
    <div class="fields">
      <label class="field"><span class="label">Length (m)</span><input id="rLen" type="number" inputmode="decimal" step="0.01" min="0" value="3.6"></label>
      <label class="field"><span class="label">Width (m)</span><input id="rWid" type="number" inputmode="decimal" step="0.01" min="0" value="3.0"></label>
      <label class="field"><span class="label">Ceiling height (m)</span><input id="rHt" type="number" inputmode="decimal" step="0.01" min="0" value="2.4"></label>
      <label class="field"><span class="label">Doors</span><input id="rDoors" type="number" inputmode="numeric" step="1" min="0" value="1"></label>
      <label class="field"><span class="label">Windows</span><input id="rWins" type="number" inputmode="numeric" step="1" min="0" value="1"></label>
    </div>
    <details>
      <summary>Door and window sizes</summary>
      <div class="fields">
        <label class="field"><span class="label">Each door (m²)</span><input id="rDoorA" type="number" inputmode="decimal" step="0.05" min="0" value="1.6"></label>
        <label class="field"><span class="label">Each window (m²)</span><input id="rWinA" type="number" inputmode="decimal" step="0.05" min="0" value="1.5"></label>
      </div>
      <p class="note">A standard UK internal door with its frame is about 1.6 m². Measure big windows or patio doors and enter their size here.</p>
    </details>
    <div class="summary">
      <div><span class="label">Floor and ceiling</span><span class="big" id="sFloor">–</span></div>
      <div><span class="label">Walls, less doors and windows</span><span class="big" id="sWalls">–</span></div>
      <div><span class="label">Skirting length</span><span class="big" id="sPerim">–</span></div>
    </div>
    <p class="saved">Saved on this device and shared with the paint and tile calculators.</p>`;

  function room(){
    const L=num('rLen'),W=num('rWid'),H=num('rHt');
    const floor=L*W,perim=2*(L+W);
    const walls=Math.max(0,perim*H-num('rDoors')*num('rDoorA',1.6)-num('rWins')*num('rWinA',1.5));
    return {L,W,H,floor,perim,walls};
  }
  function mountRoom(el,onChange){
    el.innerHTML=ROOM_HTML;
    try{const saved=JSON.parse(store.get('pt-room')||'null');if(saved)ROOM_IDS.forEach(id=>{if(saved[id]!=null)$(id).value=saved[id];});}catch(e){}
    const update=()=>{
      const r=room();
      const saved={};ROOM_IDS.forEach(id=>saved[id]=$(id).value);store.set('pt-room',JSON.stringify(saved));
      $('sFloor').textContent=m2(r.floor);$('sWalls').textContent=m2(r.walls);$('sPerim').textContent=r.perim.toFixed(1)+' m';
      onChange&&onChange(r);
    };
    el.addEventListener('input',update);el.addEventListener('change',update);
    update();
  }
  function seg(attr,val){document.querySelectorAll('['+attr+']').forEach(b=>b.setAttribute('aria-pressed',b.getAttribute(attr)===val));}
  return {store,$,num,m2,room,mountRoom,seg};
})();
