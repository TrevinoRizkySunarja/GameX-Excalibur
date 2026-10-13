// Pure laser tracing is shared by the displayed beam and puzzle validation.
export const MIRRORS = [{x:1,y:2},{x:1,y:0},{x:3,y:0},{x:3,y:2}];
export function traceLaser(rotations) {
  let x=0,y=2,dx=1,dy=0;
  const points=[[x,y]], seen=new Set();
  for(let step=0;step<30;step++) {
    x+=dx;y+=dy;points.push([x,y]);
    if(x<0||x>4||y<0||y>2)return {points,hit:false};
    if(x===4&&y===2)return {points,hit:true};
    const key=`${x}:${y}:${dx}:${dy}`;
    if(seen.has(key))return {points,hit:false};seen.add(key);
    const m=MIRRORS.findIndex(p=>p.x===x&&p.y===y);
    if(m>=0) [dx,dy]=rotations[m]===0 ? [-dy,-dx] : [dy,dx];
  }
  return {points,hit:false};
}
export function safeFuse(rating, load, pool=[5,10,15,20]) {
  return rating===Math.min(...pool.filter(n=>n>=load));
}
export function mountAdvanced(type,{field,hint,done,click}) {
  if(type==="decoder") {
    const targets=[5+Math.floor(Math.random()*10),3+Math.floor(Math.random()*9)];
    let stage=0,selected=new Set(),misses=0;
    const draw=()=>{
      field.innerHTML=`<div class="decoder-target">DEUR ${stage+1}/2 · GETAL <strong>${targets[stage]}</strong></div><div class="decoder-bits">${[8,4,2,1].map(n=>`<button data-bit="${n}" aria-pressed="false"><b>${n}</b><small>0</small></button>`).join("")}</div><p class="mini-help">Tel de actieve bitwaarden op tot het doelgetal.</p><button id="decoder-confirm" class="button accent">Bevestig sleutel</button>`;
      field.querySelectorAll("[data-bit]").forEach(b=>b.onclick=()=>{
        const n=Number(b.dataset.bit);selected.has(n)?selected.delete(n):selected.add(n);
        b.classList.toggle("active",selected.has(n));b.setAttribute("aria-pressed",String(selected.has(n)));b.querySelector("small").textContent=selected.has(n)?"1":"0";click();
      });
      field.querySelector("#decoder-confirm").onclick=()=>{
        const total=[...selected].reduce((a,b)=>a+b,0);
        if(total!==targets[stage]) {misses++;hint(`Sleutel is ${total}, doel is ${targets[stage]} · ${misses}/3 fouten`);if(misses>=3)done(false);return;}
        if(stage===1){done(true);return;}stage++;selected.clear();draw();hint("Eerste deur ontgrendeld. Nu de tweede sleutel.");
      };
    };draw();hint("Een binaire sleutel. Activeer de juiste bitwaarden.");
  } else if(type==="fuses") {
    const loads=[4,7,12], ratings=[5,10,15,20];let selected=null, placed=0;
    field.innerHTML=`<div class="fuse-bank">${ratings.map(n=>`<button data-fuse="${n}">${n} A</button>`).join("")}</div><p class="mini-help">Kies een zekering, dan een circuit. Gebruik de kleinste zekering die de belasting aankan.</p><div class="fuse-sockets">${loads.map((n,i)=>`<button data-socket="${i}" data-load="${n}">CIRCUIT ${i+1}<br>${n} A BELASTING</button>`).join("")}</div>`;
    field.querySelectorAll("[data-fuse]").forEach(b=>b.onclick=()=>{
      selected=Number(b.dataset.fuse);field.querySelectorAll("[data-fuse]").forEach(x=>x.classList.toggle("selected",x===b));click();
    });
    field.querySelectorAll("[data-socket]").forEach(b=>b.onclick=()=>{
      if(selected===null){hint("Kies eerst een zekering.");return;}
      if(!safeFuse(selected,Number(b.dataset.load),ratings)){hint("Die zekering is te klein of onnodig zwaar. Kies de kleinste veilige waarde.");return;}
      b.textContent=`${selected} A · VEILIG`;b.disabled=true;b.classList.add("active");
      field.querySelector(`[data-fuse="${selected}"]`).disabled=true;selected=null;placed++;click();hint(`${placed}/3 circuits veilig`);if(placed===3)done(true);
    });
  } else if(type==="fingerprint") {
    const values=[2,4,1,0,3];
    const print=`<svg viewBox="0 0 240 190" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.3">${Array.from({length:15},(_,i)=>`<ellipse cx="${116+i*.35}" cy="${78+i*1.7}" rx="${12+i*5.7}" ry="${15+i*5.8}" transform="rotate(-13 120 94)"/>`).join("")}<path d="M112 140q23 8 15 37M130 132q26 23 8 56"/></g></svg>`;
    field.innerHTML=`<div class="fingerprint-board"><div class="fingerprint-reference">${print}<p class="mini-help">VOORBEELD</p></div><div class="fingerprint-slots">${values.map((v,i)=>`<button data-strip="${i}" data-fragment="${v}" aria-label="Strook ${i+1}: fragment ${v+1}"><span style="display:block;transform:translateY(-${v*38}px)">${print}</span></button>`).join("")}</div></div><p class="mini-help">Klik iedere strook om het fragment te wisselen. Laat de lijnen aansluiten zoals links.</p><button id="finger-confirm" class="button accent">Vergelijk afdruk</button>`;
    field.querySelectorAll("[data-strip]").forEach(b=>b.onclick=()=>{
      const i=Number(b.dataset.strip);values[i]=(values[i]+1)%5;b.dataset.fragment=values[i];b.setAttribute("aria-label",`Strook ${i+1}: fragment ${values[i]+1}`);b.firstElementChild.style.transform=`translateY(-${values[i]*38}px)`;click();
    });
    field.querySelector("#finger-confirm").onclick=()=>{if(values.every((v,i)=>v===i))done(true);else hint("De contour sluit nog niet overal aan. Vergelijk de stroken met het voorbeeld.");};
  } else if(type==="mirrors") {
    const rotations=[1,0,0,1];
    field.innerHTML=`<div class="laser-board"><svg viewBox="0 0 500 300"><path class="beam"/><circle cx="50" cy="250" r="13" fill="#81ddb8"/><circle class="laser-goal" cx="450" cy="250" r="18" fill="none" stroke="#edd7ac" stroke-width="3"/><text x="450" y="255" text-anchor="middle" fill="#f6deb6" font-size="13">UIT</text></svg>${MIRRORS.map((m,i)=>`<button data-mirror="${i}" aria-label="Draai spiegel ${i+1}" style="left:${(m.x+.5)*20}%;top:${(m.y+.5)/3*100}%"></button>`).join("")}</div><p class="mini-help">Leid de straal via alle vier spiegels naar UIT. Elke klik wisselt / en \\.</p><button id="laser-confirm" class="button accent">Bevestig lichtpad</button>`;
    const draw=()=>{
      const trace=traceLaser(rotations);field.querySelector(".beam").setAttribute("d",trace.points.map(([x,y],i)=>`${i?"L":"M"}${x*100+50} ${y*100+50}`).join(" "));
      field.querySelector(".laser-goal").setAttribute("fill",trace.hit?"#9ce6af":"none");
      field.querySelectorAll("[data-mirror]").forEach((b,i)=>{b.textContent=rotations[i]?"\\":"/";b.dataset.rotation=rotations[i];});
    };
    field.querySelectorAll("[data-mirror]").forEach((b,i)=>b.onclick=()=>{rotations[i]=1-rotations[i];click();draw();});
    field.querySelector("#laser-confirm").onclick=()=>{if(traceLaser(rotations).hit)done(true);else hint("De straal mist UIT. Volg hem vanaf de lichtbron en draai de volgende spiegel.");};draw();
  }
}
