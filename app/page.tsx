'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, ChevronRight, CircleHelp, Diamond, Flower2, MapPin, Maximize2, Pause, Play, Shirt, ShoppingBag, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { CATALOG, EMPTY_EQUIPMENT, RARITIES, SHOPS, SAVE_KEY, byId, buy, collect, equip, move, nearestShop, restore, save, spawnCrystal, tickStock, type Equipment, type Product, type Slot, type State } from '../game/engine';
import { character, drawProduct, minimap, renderWorld } from '../game/render';

type Panel = 'wardrobe' | 'help' | 'map' | null;
type Snapshot = {balance:number;collected:number;owned:string[];equipped:Equipment;stock:string[][];near:number|null;saveOk:boolean};
const initial:Snapshot={balance:0,collected:0,owned:[],equipped:EMPTY_EQUIPMENT,stock:[[],[],[]],near:null,saveOk:true};
function safeSave(s:State){try{return save(s,localStorage);}catch{s.saveOk=false;return false;}}
const slotNames:Record<Slot,string>={hat:'Hats',outfit:'Outfits',shoes:'Shoes',accessory:'Accessories'};
function Gem({color='#89b6a0',size=18}:{color?:string;size?:number}) {return <svg width={size} height={size} viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M10 1 18 8v9l-8 6-8-6V8L10 1Z" fill={color}/><path d="m10 1 0 22-8-6V8l8-7Z" fill="white" fillOpacity=".32"/><path d="M6 8v7" stroke="white" strokeOpacity=".65" strokeWidth="2"/></svg>;}
function Avatar({equipment,large=false}:{equipment:Equipment;large?:boolean}){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const c=ref.current?.getContext('2d');if(!c)return;c.clearRect(0,0,160,160);c.imageSmoothingEnabled=false;character(c,80,135,equipment,0,0,false,large?3:2.9);},[equipment,large]);return <canvas width="160" height="160" ref={ref} className="avatar-canvas" aria-label="Your character wearing equipped clothing"/>;}
function ProductArt({product}:{product:Product}){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const c=ref.current?.getContext('2d');if(c){c.imageSmoothingEnabled=false;drawProduct(c,product,150,110);}},[product]);return <canvas width="150" height="110" ref={ref} aria-label={product.name}/>;}

export default function Home(){
 const canvas=useRef<HTMLCanvasElement>(null),mapCanvas=useRef<HTMLCanvasElement>(null),stage=useRef<HTMLDivElement>(null);
 const state=useRef<State|null>(null),keys=useRef(new Set<string>()),dialogRef=useRef<HTMLDivElement>(null),audio=useRef<AudioContext|null>(null),lastFocus=useRef<HTMLElement|null>(null);
 const [snapshot,setSnapshot]=useState<Snapshot>(initial),[panel,setPanel]=useState<Panel>(null),[shop,setShop]=useState<number|null>(null),[paused,setPaused]=useState(false),[muted,setMuted]=useState(true),[ready,setReady]=useState(false),[seconds,setSeconds]=useState(60),[tab,setTab]=useState<Slot>('hat'),[toast,setToast]=useState(''),[isFullscreen,setIsFullscreen]=useState(false);
 const flags=useRef({panel,shop,paused,muted});flags.current={panel,shop,paused,muted};
 const toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const notice=useCallback((message:string)=>{setToast(message);if(toastTimer.current)clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),3200);},[]);
 const sync=useCallback(()=>{const s=state.current;if(s)setSnapshot({balance:s.balance,collected:s.collected,owned:[...s.owned],equipped:{...s.equipped},stock:s.stock.map(a=>[...a]),near:nearestShop(s),saveOk:s.saveOk});},[]);
 const persist=useCallback(()=>{if(state.current){safeSave(state.current);sync();}},[sync]);
 const sound=useCallback((pitch=660)=>{if(flags.current.muted)return;try{const ac=audio.current??new AudioContext();audio.current=ac;void ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(pitch,ac.currentTime);o.frequency.exponentialRampToValueAtTime(pitch*1.5,ac.currentTime+.12);g.gain.setValueAtTime(.055,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.25);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.25);}catch{}},[]);
 const close=useCallback(()=>{setPanel(null);setShop(null);keys.current.clear();lastFocus.current?.focus();},[]);
 const openPanel=useCallback((p:Panel)=>{lastFocus.current=document.activeElement as HTMLElement;setShop(null);setPanel(p);keys.current.clear();},[]);
 const openShop=useCallback(()=>{const s=state.current;if(!s)return;const near=nearestShop(s);if(near!==null){lastFocus.current=document.activeElement as HTMLElement;setPanel(null);setShop(near);keys.current.clear();}},[]);
 useEffect(()=>{
  let raw:string|null=null;try{raw=localStorage.getItem(SAVE_KEY);}catch{}
  const s=restore(raw);state.current=s;sync();setReady(true);
  let frame=0,last=0,lastSave=0,lastUi=0;const particles:{x:number;y:number;text:string;life:number;color:string}[]=[];
  const draw=(now:number)=>{
   const dt=Math.min((now-last)/1000||0,.04);last=now;
   const f=flags.current;const active=!f.paused&&!f.panel&&f.shop===null&&!document.hidden;
   if(active){
    const k=keys.current;move(s,Number(k.has('d')||k.has('ArrowRight'))-Number(k.has('a')||k.has('ArrowLeft')),Number(k.has('s')||k.has('ArrowDown'))-Number(k.has('w')||k.has('ArrowUp')),dt);
    const found=collect(s);if(found.length){for(const cr of found)particles.push({x:cr.x,y:cr.y,text:`+${RARITIES[cr.rarity].value}`,life:1.5,color:cr.rarity===3?'#836021':'#375d49'});sound(660+found[0].rarity*120);persist();}
    s.spawnTime+=dt;if(s.spawnTime>1.3){s.spawnTime=0;if(s.crystals.length<72)spawnCrystal(s);}
   }else s.moving=false;
   if(tickStock(s)){sync();persist();}
   for(let i=particles.length-1;i>=0;i--){particles[i].life-=dt;if(particles[i].life<=0)particles.splice(i,1);}
   const cv=canvas.current,c=cv?.getContext('2d');if(cv&&c){const box=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;renderWorld(c,s,box.width,box.height,now/1000,particles);}
   if(now-lastUi>160){sync();setSeconds(60-Math.floor(Date.now()/1000)%60);lastUi=now;const map=mapCanvas.current?.getContext('2d');if(map)minimap(map,s,640,544);}
   if(now-lastSave>5000){safeSave(s);lastSave=now;}
   frame=requestAnimationFrame(draw);
  };frame=requestAnimationFrame(draw);
  const down=(e:KeyboardEvent)=>{
   if(e.ctrlKey||e.metaKey||e.altKey||e.target instanceof HTMLInputElement)return;
   const key=e.key.length===1?e.key.toLowerCase():e.key;
   const inMenu=flags.current.panel!==null||flags.current.shop!==null;
   if(!inMenu&&['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)){e.preventDefault();keys.current.add(key);}
   if(key===' '&&e.target instanceof HTMLButtonElement)return;
   if(e.repeat)return;
   if(key==='Escape'){close();setPaused(false);}
   if(key==='e'&&!flags.current.panel&&flags.current.shop===null&&!flags.current.paused)openShop();
   if(key==='i'){if(flags.current.panel==='wardrobe')close();else openPanel('wardrobe');}
   if(key==='m'){if(flags.current.panel==='map')close();else openPanel('map');}
   if(key===' '&&!inMenu){e.preventDefault();keys.current.clear();setPaused(v=>!v);}
  };
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.length===1?e.key.toLowerCase():e.key);
  const blur=()=>{keys.current.clear();s.moving=false;};
  const unload=()=>safeSave(s);
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);window.addEventListener('pagehide',unload);document.addEventListener('visibilitychange',blur);
  const fs=()=>setIsFullscreen(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',fs);
  return()=>{cancelAnimationFrame(frame);unload();if(toastTimer.current)clearTimeout(toastTimer.current);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);window.removeEventListener('pagehide',unload);document.removeEventListener('visibilitychange',blur);document.removeEventListener('fullscreenchange',fs);void audio.current?.close();audio.current=null;};
 },[close,openPanel,openShop,persist,sound,sync]);
 useEffect(()=>{if(!panel&&shop===null)return;const id=setTimeout(()=>dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus(),0);const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab'||!dialogRef.current)return;const nodes=[...dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]')];const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};window.addEventListener('keydown',trap);return()=>{clearTimeout(id);window.removeEventListener('keydown',trap);};},[panel,shop]);
 const purchase=(id:string)=>{const s=state.current;if(!s||shop===null)return;tickStock(s);const result=buy(s,id,shop);if(result==='bought'){persist();sound(880);notice(`${byId(id)?.name} is yours. Looking good!`);}else if(result==='funds')notice('A few more crystals will do it. Keep exploring!');else if(result==='unavailable'){sync();notice('The shop just restocked. Take a look at the new finds.');}};
 const toggleEquip=(id:string)=>{if(state.current&&equip(state.current,id)){persist();sound(440);}};
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.current?.requestFullscreen();}catch{notice('Fullscreen isn’t available in this browser.');}};
 const near=snapshot.near!==null?SHOPS[snapshot.near]:null;
 const equippedCount=Object.values(snapshot.equipped).filter(Boolean).length;
 return <div className="app-shell">
  <header className="topbar">
   <a href="/" className="brand" aria-label="Crystal City home"><span className="brand-gem"><Gem size={25} color="#edf3ce"/></span><span>crystal city<span className="brand-dot">.</span></span></a>
   <span className="header-tag">A LITTLE EXPLORATION. A LOT OF YOU.</span>
   <div className="header-actions"><span className="save-status"><span className={snapshot.saveOk?'status-dot':'status-dot warning'}/>{snapshot.saveOk?'Progress saved':'Saving unavailable'}</span><button className="icon-button help-button" onClick={()=>openPanel('help')} aria-label="How to play"><CircleHelp size={19}/></button></div>
  </header>
  <main>
   <div className="page-heading"><div><div className="eyebrow"><span/> YOUR EVERYDAY ADVENTURE</div><h1>A city full of little finds.</h1><p>Wander a little. Find a crystal. Make it your own.</p></div><button className="wardrobe-top secondary-button" onClick={()=>openPanel('wardrobe')}><Shirt size={17}/> My wardrobe <span className="keycap">I</span></button></div>
   <div className="game-layout">
    <section className="game-area" aria-label="Crystal City game">
     <div className="game-toolbar"><div className="town-title"><span className="town-icon"><Flower2 size={16}/></span> Mosswick <span className="town-divider"/> <span className="town-subtitle">Town square</span></div><div className="toolbar-actions"><span className="live-label"><span/> {paused?'PAUSED':'FREE TO ROAM'}</span><button className="icon-button" onClick={()=>setMuted(v=>!v)} aria-label={muted?'Enable sounds':'Mute sounds'} title={muted?'Enable sounds':'Mute sounds'}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>}</button><button className="icon-button" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Resume game':'Pause game'}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div></div>
     <div className="game-stage" ref={stage}>
      <canvas ref={canvas} className="world-canvas" aria-label="Mosswick city. Move using WASD or arrow keys. Press E at a shop to browse." tabIndex={0}/>
      <div className="location-badge"><MapPin size={13}/> {state.current&&state.current.y>770?'Willow gardens':'Mosswick square'}</div>
      <div className="balance-overlay"><Gem size={17}/><strong>{snapshot.balance.toLocaleString()}</strong><span>crystals</span></div>
      {!ready&&<div className="loading-overlay">Finding your little corner of the city…</div>}
      {paused&&<div className="paused-overlay"><span><Pause size={24}/></span><h2>A little breather.</h2><p>The city will be here when you’re ready.</p><button className="primary-button" onClick={()=>setPaused(false)}><Play size={15}/> Keep exploring</button></div>}
      {!paused&&near&&<button className="interaction-prompt" onClick={openShop}><kbd>E</kbd><span>Browse {near.name}</span><ChevronRight size={15}/></button>}
      {!paused&&!near&&snapshot.collected<3&&<div className="first-hint"><Sparkles size={15}/> Walk over a crystal to collect it</div>}
      <div className="map-caption">MOSSWICK · EST. 1998</div>
      <button className="fullscreen-button" onClick={fullscreen} aria-label={isFullscreen?'Exit fullscreen':'Enter fullscreen'}><Maximize2 size={16}/></button>
      <div className="touch-controls" aria-label="Movement controls">{[['w','up'],['a','left'],['s','down'],['d','right']].map(([key,dir])=><button key={key} className={`touch-${dir}`} aria-label={`Move ${dir}`} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(key);}} onPointerUp={()=>keys.current.delete(key)} onPointerCancel={()=>keys.current.delete(key)}>{dir==='up'?<ArrowUp size={18}/>:dir==='left'?<ArrowLeft size={18}/>:dir==='down'?<ArrowDown size={18}/>:<ArrowRight size={18}/>}</button>)}</div>
     </div>
     <div className="game-controls"><div><span className="wasd"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><span>Move around</span></div><div><kbd>E</kbd><span>Enter shop</span></div><div><kbd>I</kbd><span>Wardrobe</span></div><button onClick={()=>openPanel('help')}><CircleHelp size={14}/><span>How to play</span></button></div>
    </section>
    <aside className="sidebar">
     <section className="player-card"><div className="card-heading"><span>YOUR LITTLE EXPLORER</span><span className="small-pixel-spark">✧</span></div><div className="character-stage"><div className="avatar-halo"/><Avatar equipment={snapshot.equipped}/><span className="character-flower one">✧</span><span className="character-flower two">+</span><span className="character-flower three">✦</span></div><div className="player-name">Hey, wanderer <span>✿</span></div><p>A fresh look is just a crystal away.</p><button className="wardrobe-button" onClick={()=>openPanel('wardrobe')}><Shirt size={16}/> Open wardrobe <ArrowUpRight size={16}/></button><div className="player-stats"><span><strong>{snapshot.collected}</strong> crystals found</span><span><strong>{snapshot.owned.length}</strong> items owned</span></div></section>
     <section className="crystal-card"><div className="card-heading"><span>GOOD THINGS COME IN COLORS</span><Diamond size={14}/></div><h3>Every crystal counts.</h3><div className="rarity-list">{RARITIES.map((r,i)=><div className="rarity-row" key={r.name}><span className={`gem-tile gem-${i}`}><Gem color={r.color} size={17}/></span><span>{r.name}</span><span className="rarity-value">{r.value}<span>value</span></span></div>)}</div><div className="crystal-note"><Sparkles size={13}/><span>Keep an eye out. Rare finds are worth the wander.</span></div></section>
    </aside>
   </div>
   <div className="below-game"><div className="tip"><span className="tip-icon"><ShoppingBag size={19}/></span><div><strong>New minute. New favorites.</strong><p>Shop windows change every 60 seconds. You never know what you’ll find.</p></div></div><div className="restock-info"><span className="restock-dot"/><span>Next shop refresh</span><strong>0:{String(seconds).padStart(2,'0')}</strong></div></div>
   <footer><span>Take the scenic route.</span><span>Made for wandering <Flower2 size={12}/></span></footer>
  </main>
  {(panel||shop!==null)&&stage.current&&createPortal(<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><div className={`modal ${panel==='wardrobe'?'wardrobe-modal':''} ${panel==='map'?'map-modal':''}`} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
   <button className="close-button icon-button" onClick={close} aria-label="Close dialog"><X size={20}/></button>
   {shop!==null&&<><div className="eyebrow"><ShoppingBag size={13}/> MOSSWICK LOCAL SHOPS</div><h2 id="dialog-title">{SHOPS[shop].name}</h2><p className="modal-intro">{SHOPS[shop].description}</p><div className="shop-meta"><span><Gem size={16}/><strong>{snapshot.balance}</strong> available</span><span>New finds in <strong>0:{String(seconds).padStart(2,'0')}</strong></span></div><div className="product-grid">{snapshot.stock[shop].map(id=>{const p=byId(id)!;const owned=snapshot.owned.includes(id),isEquipped=snapshot.equipped[p.slot]===id;return <article key={id} className="product-card"><div className="product-art" style={{backgroundColor:`${p.color}18`}}><ProductArt product={p}/><span className="product-rarity" style={{color:RARITIES[p.rarity].color}}>{RARITIES[p.rarity].name}</span></div><div className="product-detail"><h3>{p.name}</h3><span className="product-slot">{slotNames[p.slot]}</span><button className={owned?'secondary-button product-buy':'primary-button product-buy'} disabled={isEquipped||(!owned&&snapshot.balance<p.price)} onClick={()=>owned?toggleEquip(id):purchase(id)}>{owned?<>{isEquipped?<Check size={14}/>:<Shirt size={14}/>} {isEquipped?'Wearing':'Wear it'}</>:<><Gem color="#e2eac8" size={13}/>{p.price}<span>{snapshot.balance<p.price?'Keep collecting':'Make it yours'}</span></>}</button></div></article>;})}</div><p className="modal-footnote">Every purchase goes straight to your wardrobe. Try it on, mix it up.</p></>}
   {panel==='wardrobe'&&<><div className="eyebrow"><Shirt size={13}/> A LITTLE MORE YOU</div><h2 id="dialog-title">Your wardrobe.</h2><p className="modal-intro">Good finds. Endless combinations.</p><div className="wardrobe-content"><div className="wardrobe-preview"><Avatar equipment={snapshot.equipped} large/><span>{equippedCount} / 4 pieces styled</span><div className="equipped-list">{(Object.keys(slotNames) as Slot[]).map(slot=><div key={slot}><span>{slotNames[slot]}</span><strong>{byId(snapshot.equipped[slot])?.name??'The original you'}</strong>{snapshot.equipped[slot]&&<button aria-label={`Remove ${slotNames[slot].toLowerCase()}`} onClick={()=>toggleEquip(snapshot.equipped[slot]!)}><X size={12}/></button>}</div>)}</div></div><div className="wardrobe-items"><div className="wardrobe-tabs" role="tablist">{(Object.keys(slotNames) as Slot[]).map(slot=><button key={slot} role="tab" aria-selected={tab===slot} onClick={()=>setTab(slot)}>{slotNames[slot]}</button>)}</div>{snapshot.owned.some(id=>byId(id)?.slot===tab)?<div className="wardrobe-grid">{CATALOG.filter(p=>p.slot===tab&&snapshot.owned.includes(p.id)).map(p=><button className={`owned-item ${snapshot.equipped[p.slot]===p.id?'equipped':''}`} key={p.id} onClick={()=>toggleEquip(p.id)}><ProductArt product={p}/><strong>{p.name}</strong><span>{snapshot.equipped[p.slot]===p.id?<><Check size={12}/> Wearing</>:'Click to wear'}</span></button>)}</div>:<div className="wardrobe-empty"><ShoppingBag size={33} strokeWidth={1}/><h3>A little room for possibility.</h3><p>Find crystals around town, then visit a shop to pick out your first {tab==='hat'?'hat':tab==='outfit'?'outfit':tab==='shoes'?'pair of shoes':'accessory'}.</p><button className="primary-button" onClick={close}>Let’s go wandering <ArrowRight size={14}/></button></div>}</div></div></>}
   {panel==='help'&&<><div className="eyebrow"><Flower2 size={13}/> WELCOME TO MOSSWICK</div><h2 id="dialog-title">A little guide to wandering.</h2><p className="modal-intro">There’s no rush. Make yourself at home.</p><div className="help-steps"><div><span>01</span><div><h3>Take the scenic route.</h3><p>Move with WASD or the arrow keys. Explore the square, streets, and willow gardens.</p></div></div><div><span>02</span><div><h3>A little sparkle goes a long way.</h3><p>Walk over crystals to collect them. Rarer colors add more to your balance, and new crystals appear as you explore.</p></div></div><div><span>03</span><div><h3>Find something that feels like you.</h3><p>Press E by a shop door to browse. Stock changes every minute. Purchases are automatically worn; open your wardrobe with I to mix and match.</p></div></div></div><div className="help-bottom"><span><kbd>Space</kbd> Pause</span><span><kbd>M</kbd> Town map</span><span><kbd>Esc</kbd> Close</span></div><p className="modal-footnote">Your progress saves automatically in this browser.</p><button className="primary-button help-start" onClick={close}>See you around town <ArrowRight size={15}/></button></>}
   {panel==='map'&&<><div className="eyebrow"><MapPin size={13}/> THE NEIGHBORHOOD</div><h2 id="dialog-title">A place to get a little lost.</h2><p className="modal-intro">Mosswick’s shops, streets, and quiet corners.</p><canvas className="town-map" width="640" height="544" ref={mapCanvas} aria-label="Town map with your current location"/><div className="map-legend"><span><i/> You are here</span><span>Shops line the north side of the square.</span></div></>}
  </div></div>,stage.current)}
  {toast&&stage.current&&createPortal(<div className="toast" role="status"><Sparkles size={16}/>{toast}</div>,stage.current)}
 </div>;
}
