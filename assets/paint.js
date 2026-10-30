(function(){
  const {$,num,m2,store,seg,mountRoom,room}=PT;
  let paintWhat=store.get('pt-paint')||'walls';
  function bestTins(litres){
    let best=null;if(litres<=0)return {combo:[],total:0};
    for(let a=0;a<=Math.ceil(litres/5)+1;a++)for(let b=0;b<=3;b++)for(let c=0;c<=4;c++){
      const total=a*5+b*2.5+c,count=a+b+c;
      if(total+1e-9<litres||count===0)continue;
      const waste=total-litres,cost=waste+0.6*count;
      if(!best||cost<best.cost)best={a,b,c,total,cost};
    }
    const combo=[];if(best.a)combo.push(best.a+' × 5 L');if(best.b)combo.push(best.b+' × 2.5 L');if(best.c)combo.push(best.c+' × 1 L');
    return {combo,total:best.total};
  }
  function render(r){
    r=r||room();
    seg('data-paint',paintWhat);
    const area=paintWhat==='walls'?r.walls:paintWhat==='ceiling'?r.floor:r.walls+r.floor;
    const coats=Math.max(1,Math.round(num('pCoats',2)))+($('pMist').checked?1:0);
    const litres=area*coats/Math.max(1,num('pCover',12));
    const tins=bestTins(Math.ceil(litres*10)/10);
    $('pLitres').textContent=litres>0?litres.toFixed(1)+' litres':'–';
    $('pTins').textContent=litres>0?`Buy ${tins.combo.join(' + ')} for ${m2(area)} at ${coats} coat${coats>1?'s':''}.`:'Enter your room size above.';
  }
  document.querySelectorAll('[data-paint]').forEach(b=>b.addEventListener('click',()=>{paintWhat=b.dataset.paint;store.set('pt-paint',paintWhat);render();}));
  ['pCoats','pCover','pMist'].forEach(id=>{$(id).addEventListener('input',()=>render());$(id).addEventListener('change',()=>render());});
  mountRoom($('room'),render);
})();
