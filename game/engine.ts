export const TILE = 32;
export const WORLD_W = 40 * TILE;
export const WORLD_H = 34 * TILE;
export const SAVE_KEY = 'crystal-city-v1';
export type Slot = 'hat' | 'outfit' | 'shoes' | 'accessory';
export type Product = { id: string; name: string; slot: Slot; color: string; price: number; rarity: number; style: number };
export const RARITIES = [
  { name: 'Common', color: '#76b5a1', value: 1, chance: .65 },
  { name: 'Uncommon', color: '#7baadd', value: 5, chance: .25 },
  { name: 'Rare', color: '#b190d5', value: 15, chance: .085 },
  { name: 'Legendary', color: '#e5b65b', value: 50, chance: .015 },
];
const items: [string, Slot, string, number, number, number][] = [
  ['Moss bucket hat','hat','#638570',18,0,0], ['Peach beanie','hat','#d98e79',24,0,1],
  ['Midnight cap','hat','#415c73',35,1,2], ['Lavender beret','hat','#ab8dbf',45,1,3],
  ['Sunflower hat','hat','#d4ad57',65,2,0], ['Cloud beanie','hat','#e6e0cf',28,0,1],
  ['Cherry cap','hat','#bb6262',40,1,2], ['Golden crown','hat','#e4b851',150,3,4],
  ['Sage sweater','outfit','#7a977b',22,0,0], ['Apricot overalls','outfit','#d89571',32,1,1],
  ['Ocean jacket','outfit','#638ba0',45,1,2], ['Lilac cardigan','outfit','#ac8db5',50,2,0],
  ['Strawberry tee','outfit','#c8757b',20,0,3], ['Honey raincoat','outfit','#d8af55',65,2,2],
  ['Nightfall coat','outfit','#465363',80,2,2], ['Starlight suit','outfit','#b1c8be',140,3,1],
  ['Canvas sneakers','shoes','#e8e0c9',12,0,0], ['Moss boots','shoes','#617867',24,0,1],
  ['Cherry sneakers','shoes','#bc6b64',28,1,0], ['Golden boots','shoes','#c7a353',80,2,1],
  ['Round glasses','accessory','#745344',22,0,0], ['Rose scarf','accessory','#cb858e',32,1,1],
  ['Explorer satchel','accessory','#9a714e',45,1,2], ['Moon pendant','accessory','#e4c467',110,3,3],
];
export const CATALOG: Product[] = items.map(([name,slot,color,price,rarity,style],i)=>({id:`item-${i}`, name,slot,color,price,rarity,style}));
export const byId = (id: string | null | undefined) => CATALOG.find(p=>p.id===id);
export type Building = { x:number; y:number; w:number; h:number; color:string; trim:string; shop?:number; label?:string };
export const BUILDINGS: Building[] = [
  {x:3,y:3,w:5,h:4,color:'#a26856',trim:'#ddc2a2'}, {x:11,y:2,w:5,h:4,color:'#6c8580',trim:'#d9d0af'},
  {x:24,y:3,w:5,h:4,color:'#ac8171',trim:'#e1c6a1'}, {x:32,y:3,w:5,h:5,color:'#7c8692',trim:'#ddd4bc'},
  {x:3,y:11,w:4,h:5,color:'#899079',trim:'#e1c9a1'},
  {x:9,y:12,w:5,h:4,color:'#a87962',trim:'#e7ccb0',shop:0,label:'THE HAT HOUSE'},
  {x:18,y:10,w:5,h:4,color:'#73938c',trim:'#e2cfac',shop:1,label:'THREAD & THISTLE'},
  {x:27,y:12,w:5,h:4,color:'#99829c',trim:'#e3cdbb',shop:2,label:'ODDS & ENDS'},
  {x:34,y:12,w:4,h:5,color:'#b88767',trim:'#dfcaaa'},
  {x:3,y:24,w:5,h:5,color:'#748d86',trim:'#e4d1b1'}, {x:31,y:25,w:6,h:5,color:'#b67f6c',trim:'#e4cda9'},
];
export const SHOPS = [
  {id:0,name:'The Hat House',kind:'Hats & headwear',description:'A little something to top it off.',color:'#bd8a6d',slots:['hat'],x:11.5*TILE,y:16.8*TILE},
  {id:1,name:'Thread & Thistle',kind:'Outfits & everyday favorites',description:'Find your new favorite feeling.',color:'#7d9c8e',slots:['outfit'],x:20.5*TILE,y:14.8*TILE},
  {id:2,name:'Odds & Ends',kind:'Shoes & accessories',description:'Small details. Big personality.',color:'#a48aa9',slots:['shoes','accessory'],x:29.5*TILE,y:16.8*TILE},
];
export const TREES = [[2,8],[6,8],[9,8],[15,8],[25,8],[30,9],[36,9],[1,18],[5,20],[8,21],[10,25],[11,29],[15,28],[19,30],[25,30],[28,27],[38,23],[37,19],[33,21],[2,31],[7,32],[30,32],[37,32],[23,5],[19,3]];
export const POND = { x:21*TILE,y:24*TILE,w:7*TILE,h:4*TILE };
export function terrain(tx:number,ty:number):'path'|'grass'|'water' {
  if(tx>=21&&tx<28&&ty>=24&&ty<28 && !((tx===21||tx===27)&&(ty===24||ty===27)))return 'water';
  if((ty>=17&&ty<=20)||(tx>=16&&tx<=24&&ty<=23)||(ty>=7&&ty<=9)||(tx>=9&&tx<=31&&ty>=15&&ty<=17)||(tx>=11&&tx<=13&&ty>=20&&ty<=28)||(ty>=28&&ty<=30&&tx>=11&&tx<=29)) return 'path';
  return 'grass';
}
export function walkable(x:number,y:number):boolean {
  if(x<24||y<24||x>WORLD_W-24||y>WORLD_H-24)return false;
  for(const dx of [-7,7])for(const dy of [-5,5])if(terrain(Math.floor((x+dx)/TILE),Math.floor((y+dy)/TILE))==='water')return false;
  if(BUILDINGS.some(b=>x>b.x*TILE-8&&x<(b.x+b.w)*TILE+8&&y>b.y*TILE-5&&y<(b.y+b.h)*TILE+7))return false;
  if(TREES.some(([tx,ty])=>Math.hypot(x-(tx*TILE+16),y-(ty*TILE+22))<15))return false;
  // Fountain in the square, benches, and planters.
  if(Math.hypot(x-20.5*TILE,y-18.3*TILE)<33)return false;
  return true;
}
export type Crystal = {id:number;x:number;y:number;rarity:number;phase:number};
export type Equipment = Record<Slot,string|null>;
export type State = {x:number;y:number;balance:number;collected:number;owned:string[];equipped:Equipment;stock:string[][];stockEpoch:number;crystals:Crystal[];nextId:number;spawnTime:number;direction:number;moving:boolean;step:number; saveOk:boolean};
export const EMPTY_EQUIPMENT:Equipment = {hat:null,outfit:null,shoes:null,accessory:null};
export function rollStock(shop:number,random=Math.random):string[] {
  const pool=CATALOG.filter(p=>SHOPS[shop].slots.includes(p.slot));
  const result:string[]=[];
  while(result.length<4&&pool.length){const i=Math.floor(random()*pool.length);result.push(pool.splice(i,1)[0].id);}
  return result;
}
export function rarityRoll(random=Math.random):number {let r=random();for(let i=0;i<RARITIES.length;i++){r-=RARITIES[i].chance;if(r<0)return i;}return 3;}
export function spawnCrystal(s:State,random=Math.random) {
  for(let attempt=0;attempt<300;attempt++){
    const x=48+random()*(WORLD_W-96),y=48+random()*(WORLD_H-96);
    if(walkable(x,y)&&!s.crystals.some(c=>Math.hypot(c.x-x,c.y-y)<30)&&Math.hypot(s.x-x,s.y-y)>30){
      s.crystals.push({id:s.nextId++,x,y,rarity:rarityRoll(random),phase:random()*Math.PI*2});return;
    }
  }
}
export function newState(now=Date.now()):State {
  const s:State={x:20.5*TILE,y:19.6*TILE,balance:0,collected:0,owned:[],equipped:{...EMPTY_EQUIPMENT},stock:SHOPS.map((_,i)=>rollStock(i)),stockEpoch:Math.floor(now/60000),crystals:[],nextId:0,spawnTime:0,direction:0,moving:false,step:0,saveOk:true};
  for(let i=0;i<65;i++)spawnCrystal(s);
  // A first trail makes the collection loop immediately discoverable.
  for(const [x,y,r] of [[19,19,0],[18,19,1],[17,18,0],[16,18,0],[15,17,1],[21,20,0]] as number[][])s.crystals.push({id:s.nextId++,x:x*TILE+16,y:y*TILE+16,rarity:r,phase:0});
  return s;
}
export function tickStock(s:State,now=Date.now()):boolean {
  const epoch=Math.floor(now/60000); if(s.stockEpoch===epoch)return false;
  s.stockEpoch=epoch;s.stock=SHOPS.map((_,i)=>rollStock(i));return true;
}
export function move(s:State,dx:number,dy:number,dt:number) {
  const length=Math.hypot(dx,dy);s.moving=length>0;
  if(!length)return;
  const speed=108,steps=Math.ceil(speed*dt/4),sx=dx/length*speed*dt/steps,sy=dy/length*speed*dt/steps;
  for(let i=0;i<steps;i++){if(walkable(s.x+sx,s.y))s.x+=sx;if(walkable(s.x,s.y+sy))s.y+=sy;}
  s.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0);s.step+=dt*9;
}
export function collect(s:State):Crystal[] {const found=s.crystals.filter(c=>Math.hypot(c.x-s.x,c.y-s.y)<20);if(!found.length)return []; const ids=new Set(found.map(c=>c.id));s.crystals=s.crystals.filter(c=>!ids.has(c.id));for(const c of found){s.balance+=RARITIES[c.rarity].value;s.collected++;}return found;}
export function nearestShop(s:State):number|null {const shop=SHOPS.find(v=>Math.hypot(s.x-v.x,s.y-v.y)<65);return shop?.id??null;}
export function buy(s:State,id:string,shop:number):'bought'|'owned'|'funds'|'unavailable' {
  const p=byId(id);if(!p||!s.stock[shop]?.includes(id))return 'unavailable';
  if(s.owned.includes(id))return 'owned';if(s.balance<p.price)return 'funds';
  s.balance-=p.price;s.owned.push(id);s.equipped[p.slot]=id;return 'bought';
}
export function equip(s:State,id:string):boolean {const p=byId(id);if(!p||!s.owned.includes(id))return false;s.equipped[p.slot]=s.equipped[p.slot]===id?null:id;return true;}
export function save(s:State,storage:Pick<Storage,'setItem'>):boolean {
  try{storage.setItem(SAVE_KEY,JSON.stringify({version:1,x:s.x,y:s.y,balance:s.balance,collected:s.collected,owned:s.owned,equipped:s.equipped,stock:s.stock,stockEpoch:s.stockEpoch}));s.saveOk=true;return true;}catch{s.saveOk=false;return false;}
}
export function restore(raw:string|null,now=Date.now()):State {
  const s=newState(now);if(!raw)return s;
  try{const d=JSON.parse(raw);if(d.version!==1||!Number.isSafeInteger(d.balance)||d.balance<0||d.balance>1e9||!Number.isSafeInteger(d.collected)||d.collected<0||!Array.isArray(d.owned)||!d.equipped) return s;
    s.balance=d.balance;s.collected=d.collected;s.owned=[...new Set<string>(d.owned.filter((id:unknown)=>typeof id==='string'&&byId(id)))];
    for(const slot of Object.keys(EMPTY_EQUIPMENT) as Slot[]){const p=byId(d.equipped[slot]);if(p?.slot===slot&&s.owned.includes(p.id))s.equipped[slot]=p.id;}
    if(Number.isFinite(d.x)&&Number.isFinite(d.y)&&walkable(d.x,d.y)){s.x=d.x;s.y=d.y;}
    if(d.stockEpoch===s.stockEpoch&&Array.isArray(d.stock)&&d.stock.length===3&&d.stock.every((stock:unknown,i:number)=>Array.isArray(stock)&&stock.length===4&&new Set(stock).size===4&&stock.every(id=>{const p=byId(id);return p&&SHOPS[i].slots.includes(p.slot);})))s.stock=d.stock;
  }catch{}return s;
}
