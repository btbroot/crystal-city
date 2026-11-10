import test from 'node:test';
import assert from 'node:assert/strict';
import { newState, move, walkable, collect, buy, equip, restore, save, tickStock, spawnCrystal, nearestShop, CATALOG, SHOPS, RARITIES, WORLD_W, WORLD_H } from '../game/engine.ts';
test('crystal pickups award each rarity once',()=>{
 const s=newState();s.crystals=RARITIES.map((_,i)=>({id:i,x:s.x,y:s.y,rarity:i,phase:0}));
 assert.equal(collect(s).length,4);assert.equal(s.balance,71);assert.equal(s.collected,4);assert.equal(collect(s).length,0);assert.equal(s.balance,71);
});
test('movement normalizes diagonal speed, blocks buildings and respects boundaries',()=>{
 const a=newState(),b=newState();a.x=b.x=16*32;a.y=b.y=21*32;move(a,0,1,.1);move(b,1,1,.1);
 assert.ok(Math.abs(Math.hypot(a.x-512,a.y-672)-Math.hypot(b.x-512,b.y-672))<.001);
 assert.equal(walkable(10*32,14*32),false);a.x=10*32;a.y=17*32;move(a,0,-1,2);assert.ok(a.y>16*32);
 a.x=24;a.y=20*32;move(a,-1,0,.5);assert.equal(a.x,24);
});
test('every shop is reachable from the starting square',()=>{
 const s=newState(),step=8,start=[Math.round(s.x/step),Math.round(s.y/step)],queue=[start],seen=new Set([start.join(',')]);
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;if(!seen.has(key)&&walkable(nx*step,ny*step)){seen.add(key);queue.push([nx,ny]);}}}
 for(const shop of SHOPS)assert.ok(queue.some(([x,y])=>Math.hypot(x*step-shop.x,y*step-shop.y)<30),`${shop.name} reachable`);
 assert.ok(queue.length>10000);
});
test('purchases enforce funds and ownership, equip each slot, and never double charge',()=>{
 const s=newState();s.balance=1000;
 for(const slot of ['hat','outfit','shoes','accessory']){
  const p=CATALOG.find(p=>p.slot===slot),shop=SHOPS.findIndex(sh=>sh.slots.includes(slot));s.stock[shop][0]=p.id;
  s.balance=0;const ownedBefore=s.owned.length;assert.equal(buy(s,p.id,shop),'funds');assert.equal(s.owned.length,ownedBefore);
  s.balance=1000;assert.equal(buy(s,p.id,shop),'bought');assert.equal(s.balance,1000-p.price);assert.equal(s.equipped[slot],p.id);
  const before=s.balance;assert.equal(buy(s,p.id,shop),'owned');assert.equal(s.balance,before);assert.equal(equip(s,p.id),true);assert.equal(s.equipped[slot],null);equip(s,p.id);assert.equal(s.equipped[slot],p.id);
 }
 assert.equal(buy(s,'missing',0),'unavailable');assert.equal(equip(s,'missing'),false);
});
test('stock stays stable within a minute and restocks all shops at the boundary',()=>{
 const s=newState(120000),original=JSON.stringify(s.stock);assert.equal(tickStock(s,179999),false);assert.equal(JSON.stringify(s.stock),original);assert.equal(tickStock(s,180000),true);assert.equal(s.stockEpoch,3);
 s.stock.forEach((stock,i)=>{assert.equal(stock.length,4);assert.equal(new Set(stock).size,4);stock.forEach(id=>assert.ok(SHOPS[i].slots.includes(CATALOG.find(p=>p.id===id).slot)));});
});
test('save restores purchases, equipment, position, and current stock, and rejects corrupt data',()=>{
 const now=Date.now(),s=newState(now);s.balance=500;s.stock[0]=['item-0','item-1','item-2','item-3'];buy(s,'item-0',0);s.x=16*32;s.y=21*32;
 let raw;assert.equal(save(s,{setItem:(_,value)=>raw=value}),true);const result=restore(raw,now);
 for(const key of ['balance','collected','x','y'])assert.equal(result[key],s[key]);assert.deepEqual(result.owned,s.owned);assert.deepEqual(result.equipped,s.equipped);assert.deepEqual(result.stock,s.stock);
 assert.equal(restore('{oops').balance,0);assert.equal(restore(JSON.stringify({version:1,balance:-1})).balance,0);
 assert.equal(save(s,{setItem:()=>{throw new Error('Full');}}),false);assert.equal(s.saveOk,false);
 const data=JSON.parse(raw);data.equipped.hat='item-8';data.x=-100;const fixed=restore(JSON.stringify(data));assert.equal(fixed.equipped.hat,null);assert.ok(walkable(fixed.x,fixed.y));
});
test('spawned crystals occupy walkable city space',()=>{const s=newState();for(let i=0;i<200;i++)spawnCrystal(s);for(const c of s.crystals){assert.ok(walkable(c.x,c.y));assert.ok(c.rarity>=0&&c.rarity<4);}const near=newState();near.x=SHOPS[0].x;near.y=SHOPS[0].y;assert.equal(nearestShop(near),0);});
