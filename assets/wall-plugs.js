(function(){
  const {$,store}=PT;
  /* ---------- Wall plug picker ---------- */
  const walls=[
    {id:'solid',n:'Solid brick or block',d:'Hard, dull knock'},
    {id:'aircrete',n:'Aerated block',d:'Soft, grey dust'},
    {id:'board',n:'Plasterboard',d:'Hollow knock'},
    {id:'dabs',n:'Dot and dab',d:'Board stuck on brick'},
    {id:'lath',n:'Lath and plaster',d:'Older homes'}
  ];
  const loads=[
    {id:'light',n:'Light',d:'Under 5 kg: pictures, clocks'},
    {id:'medium',n:'Medium',d:'5–15 kg: mirrors, small shelves'},
    {id:'heavy',n:'Heavy',d:'15–30 kg: loaded shelves, cabinets'},
    {id:'vheavy',n:'Very heavy',d:'30 kg+: TVs, kitchen units'}
  ];
  const masonrySteps=['Mark the spot and check it with a cable and pipe detector.','Wrap tape round the bit to mark the depth: the plug length plus 5 mm.','Drill straight in, then vacuum or blow out the dust.','Tap the plug in until it sits flush with the wall, then fit your screw.'];
  const PLUGS={
    solid:{steps:masonrySteps,
      light:{fix:'Yellow or red nylon plug',drill:'5–6 mm masonry bit, hammer on',screw:'3.5–4 mm, 30–40 mm long',count:'1–2'},
      medium:{fix:'Red nylon plug',drill:'6 mm masonry bit, hammer on',screw:'4–5 mm, 40–50 mm long',count:'2 or more'},
      heavy:{fix:'Brown nylon plug',drill:'7 mm masonry bit, hammer on',screw:'5 mm, 50–60 mm long',count:'3–4, spread out'},
      vheavy:{fix:'Brown plugs, frame fixings or masonry screws',drill:'As stated on the fixing, usually 6–10 mm masonry bit',screw:'Long enough to go at least 25 mm into the brick past the plaster',count:'4 or more',caution:'Follow the bracket maker’s instructions. Check the plaster is sound: if it sounds hollow, the fixing must reach the brick behind.'}},
    aircrete:{steps:['Mark the spot and check it with a cable and pipe detector.','Turn the hammer action off. Aerated block is soft and hammering makes the hole too big.','Drill to the plug length plus 5 mm and clear the dust.','Push the plug in and fit your screw. Don’t overtighten, or the plug will spin.'],
      light:{fix:'Red nylon plug',drill:'6 mm masonry bit, hammer off',screw:'4 mm, 40 mm long',count:'1–2'},
      medium:{fix:'Aerated block plug (long fins or spiral, made for soft block)',drill:'Size on the pack, hammer off',screw:'As stated on the pack, usually 5 mm',count:'2 or more'},
      heavy:{fix:'Heavy-duty aerated block fixing',drill:'Size on the pack, hammer off',screw:'As stated on the pack',count:'4 or more',caution:'Use more fixings than you would in brick and spread the load.'},
      vheavy:{stop:'Aerated block can crumble under heavy loads that pull away from the wall. Use a resin (chemical) anchor system made for aerated block, following the bracket maker’s instructions, or get a fitter in.'}},
    board:{steps:['Mark the spot and check it with a cable and pipe detector.','Knock or use a stud detector to see if there’s a timber or metal stud behind. If there is, screw into it instead.','Fit the cavity fixing as the pack shows. Most expand behind the board as you tighten.','Fit your item without overtightening, or the board can crush.'],
      light:{fix:'Self-drill plasterboard fixing (nylon or zinc)',drill:'No drill needed: screw it in with a screwdriver',screw:'Usually supplied, about 4 × 30 mm',count:'1–2'},
      medium:{fix:'Metal cavity fixing (hollow wall anchor)',drill:'Usually 8–10 mm wood or metal bit, hammer off',screw:'Supplied with the fixing',count:'2 or more'},
      heavy:{fix:'Spring toggle or heavy-duty plasterboard fixing',drill:'Size on the pack, often 10–20 mm, hammer off',screw:'Supplied, often an M5 or M6 bolt',count:'3–4',caution:'Better still, screw into the studs behind the board. They’re usually every 400 or 600 mm.'},
      vheavy:{stop:'Don’t hang this from plasterboard alone. Screw into the studs behind the board, fit a timber batten across two studs, or follow the bracket maker’s instructions for stud walls.'}},
    dabs:{steps:['Mark the spot and check it with a cable and pipe detector.','Drill through the plasterboard with the hammer off, then turn it on when you reach brick.','Use a fixing long enough to bridge the gap and grip the brick. A short plug only grips the board.','Tighten gently. Overtightening can pull the board towards the wall and crack it.'],
      light:{fix:'Self-drill plasterboard fixing',drill:'No drill needed: screw it in',screw:'Usually supplied',count:'1–2'},
      medium:{fix:'Long frame fixing or dot-and-dab fixing that reaches the brick',drill:'Long masonry bit, size on the pack (usually 8–10 mm)',screw:'Supplied, reaching at least 30 mm into the brick',count:'2 or more',caution:'A normal wall plug only grips the plasterboard and can pull it off the wall.'},
      heavy:{fix:'Dot-and-dab fixing with a spacer collar',drill:'Long masonry bit, size on the pack',screw:'Supplied, reaching at least 30 mm into the brick',count:'3–4',caution:'The spacer collar stops the board being crushed as you tighten.'},
      vheavy:{fix:'Dot-and-dab fixings with spacer collars',drill:'Long masonry bit, size on the pack',screw:'Supplied, reaching at least 40 mm into the brick',count:'4 or more',caution:'Follow the bracket maker’s instructions. For TVs on arms, consider a fitter.'}},
    lath:{steps:['Mark the spot and check it with a cable and pipe detector.','Put masking tape over the spot. Old plaster cracks easily.','Drill with the hammer off and go slowly.','Fix into a timber stud wherever you can. They run vertically, usually about 400 mm apart.'],
      light:{fix:'Picture hook with fine pins, or a small screw into a lath',drill:'Small wood bit for a pilot hole, hammer off',screw:'3.5 mm, 30–40 mm long',count:'1–2'},
      medium:{fix:'Spring toggle, or screw into a timber stud',drill:'Size on the toggle pack, hammer off',screw:'Supplied with the toggle',count:'2 or more'},
      heavy:{fix:'Screw straight into the timber studs',drill:'Wood bit for a pilot hole, hammer off',screw:'5 mm, at least 60 mm long so 35 mm goes into the stud',count:'2 or more',caution:'Find the studs with a stud detector or a few small test holes.'},
      vheavy:{stop:'Lath and plaster isn’t strong enough for this. Fix a timber batten across two or more studs and hang from that, or get a fitter in.'}}
  };
  function choices(el,items,name,cur){
    el.innerHTML=items.map(i=>`<label class="choice"><input type="radio" name="${name}" value="${i.id}" ${i.id===cur?'checked':''}><span>${i.n}<small>${i.d}</small></span></label>`).join('');
  }
  let wall=store.get('pt-wall')||'solid',load=store.get('pt-load')||'medium';
  choices($('wallChoices'),walls,'wall',wall);choices($('loadChoices'),loads,'load',load);
  function renderPlug(){
    const w=PLUGS[wall],r=w[load],tiled=$('tiled').checked,out=$('plugOut');
    const wn=walls.find(x=>x.id===wall).n.toLowerCase(),ln=loads.find(x=>x.id===load).d.split(':')[1].trim();
    let html='';
    if(r.stop){
      html=`<div class="callout stop"><strong>Don’t use wall plugs here</strong><span>${r.stop}</span></div>`;
    }else{
      html=`<div class="spec">
        <div><span class="label">Fixing</span><b>${r.fix}</b></div>
        <div><span class="label">Drill bit</span><b>${r.drill}</b></div>
        <div><span class="label">Screw</span><b>${r.screw}</b></div>
        <div><span class="label">How many</span><b>${r.count}</b></div></div>`;
      if(r.caution)html+=`<p class="note warn">${r.caution}</p>`;
      const steps=tiled?['Put masking tape over the spot so the bit doesn’t slip.','Drill through the tile with a tile or diamond bit, hammer off. Switch bits once you’re through.',...w.steps.slice(1),'Push the plug past the tile surface so it doesn’t crack the tile when it expands.']:w.steps;
      html+=`<div><span class="label">How to fit it in ${wn}</span><ol class="steps" style="margin-top:8px">${steps.map(s=>`<li>${s}</li>`).join('')}</ol></div>`;
    }
    html+=`<p class="note">Plug colours and sizes vary slightly between brands, so check the pack. For boilers, radiators, wall-hung toilets, handrails and anything overhead, follow the manufacturer’s fixing instructions.</p>`;
    out.innerHTML=html;
  }
  $('wallChoices').addEventListener('change',e=>{wall=e.target.value;store.set('pt-wall',wall);renderPlug();});
  $('loadChoices').addEventListener('change',e=>{load=e.target.value;store.set('pt-load',load);renderPlug();});
  $('tiled').addEventListener('change',renderPlug);
  renderPlug();

})();
