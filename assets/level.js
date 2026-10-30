(function(){
  const {$}=PT;
  const bubble=$('bubble'),eye=$('bullseye'),dX=$('degX'),dY=$('degY'),note=$('levelNote'),demo=$('demo');
  const demoX=$('demoX'),demoY=$('demoY');
  let raw={x:0,y:0},zero={x:0,y:0},live=false;
  function draw(x,y){
    x-=zero.x;y-=zero.y;
    const max=10,clamp=v=>Math.max(-max,Math.min(max,v)),r=eye.clientWidth*0.38;
    bubble.style.transform=`translate(${-clamp(x)/max*r}px,${-clamp(y)/max*r}px)`;
    dX.textContent=Math.abs(x).toFixed(1)+'°';dY.textContent=Math.abs(y).toFixed(1)+'°';
    eye.classList.toggle('level',Math.abs(x)<0.5&&Math.abs(y)<0.5);
  }
  function onOrient(e){if(e.gamma==null)return;live=true;demo.hidden=true;raw={x:e.gamma,y:e.beta};draw(raw.x,raw.y);}
  function showDemo(msg){note.textContent=msg;note.classList.add('warn');demo.hidden=false;raw={x:+demoX.value,y:+demoY.value};draw(raw.x,raw.y);}
  [demoX,demoY].forEach(i=>i.addEventListener('input',()=>{if(!live){raw={x:+demoX.value,y:+demoY.value};draw(raw.x,raw.y);}}));
  $('startLevel').addEventListener('click',async()=>{
    note.classList.remove('warn');
    try{
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
        const p=await DeviceOrientationEvent.requestPermission();
        if(p!=='granted'){showDemo('Motion access was turned down. Tap Start level again and choose Allow.');return;}
      }
      window.addEventListener('deviceorientation',onOrient);
      note.textContent='Reading your motion sensor…';
      setTimeout(()=>{if(!live)showDemo("This device or browser isn't sharing motion data. Open the page on your phone to use the level, or try it with the sliders.");else note.textContent='Level is live. Nothing is recorded or sent anywhere.';},1500);
    }catch(err){showDemo("Motion sensors aren't available here. Open the page on your phone, or try it with the sliders.");}
  });
  $('zeroLevel').addEventListener('click',()=>{zero={x:raw.x,y:raw.y};draw(raw.x,raw.y);note.classList.remove('warn');note.textContent='Zero set. Readings are now relative to this surface.';});
  draw(0,0);
})();
