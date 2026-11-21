import { TILE, WORLD_W, WORLD_H, BUILDINGS, TREES, SHOPS, RARITIES, terrain, byId, type State, type Equipment, type Product, type Building } from './engine';
const hash=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
function rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function pixelText(c:CanvasRenderingContext2D,text:string,x:number,y:number,size=8,color='#3d5147'){c.fillStyle=color;c.font=`bold ${size}px monospace`;c.textAlign='center';c.fillText(text,Math.round(x),Math.round(y));}
export function crystal(c:CanvasRenderingContext2D,x:number,y:number,rarity:number,scale=1,time=0){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
 const color=RARITIES[rarity].color;
 ellipse(c,0,6,7,2,'#3d695224');
 c.globalAlpha=.14+Math.sin(time)*.06;ellipse(c,0,-3,12,12,color);c.globalAlpha=1;
 c.fillStyle=color;c.beginPath();c.moveTo(0,-12);c.lineTo(6,-6);c.lineTo(6,1);c.lineTo(0,6);c.lineTo(-6,1);c.lineTo(-6,-6);c.closePath();c.fill();
 c.fillStyle='#ffffff66';c.beginPath();c.moveTo(0,-12);c.lineTo(0,5);c.lineTo(-6,1);c.lineTo(-6,-6);c.closePath();c.fill();
 rect(c,-3,-6,2,5,'#ffffffb0');rect(c,6,-13,2,2,'#fff7d6');if(rarity>1){rect(c,-10,-6,2,2,'#fff7d6');rect(c,9,0,2,2,'#fff7d6');}c.restore();
}
export function character(c:CanvasRenderingContext2D,x:number,y:number,equipment:Equipment,dir=0,step=0,moving=false,scale=1){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
 const hat=byId(equipment.hat),outfit=byId(equipment.outfit),shoes=byId(equipment.shoes),acc=byId(equipment.accessory);
 ellipse(c,0,1,10,4,'#334c4430');const bob=moving?Math.round(Math.sin(step*2)*1):0;c.translate(0,bob);
 const leg=moving?Math.round(Math.sin(step)*2):0;
 rect(c,-6,-8,5,8+leg,'#48576a');rect(c,1,-8,5,8-leg,'#48576a');
 rect(c,-7,leg-2,6,3,shoes?.color??'#654e40');rect(c,1,-leg-2,6,3,shoes?.color??'#654e40');
 if(shoes?.style===1){rect(c,-7,-5,6,5,shoes.color);rect(c,1,-5,6,5,shoes.color);}
 rect(c,-8,-20,16,13,outfit?.color??'#d7ad6d');rect(c,-10,-18,3,10,outfit?.color??'#d7ad6d');rect(c,7,-18,3,10,outfit?.color??'#d7ad6d');
 rect(c,-10,-10,3,4,'#dba780');rect(c,7,-10,3,4,'#dba780');rect(c,-6,-8,12,2,'#344c3420');
 if(outfit?.style===1){rect(c,-5,-19,2,11,'#4d6374');rect(c,3,-19,2,11,'#4d6374');rect(c,-5,-14,10,6,'#4d6374');}
 if(outfit?.style===2){rect(c,-1,-19,2,12,'#fff4cf');rect(c,3,-13,3,2,'#42534555');}
 if(outfit?.style===3){rect(c,-8,-19,16,3,'#f6dfb4');rect(c,-8,-13,16,2,'#f6dfb4');}
 rect(c,-7,-32,14,13,'#644c3d');rect(c,-8,-29,16,6,'#644c3d');rect(c,-6,-29,12,11,'#e6b58c');rect(c,-4,-19,8,2,'#d69a73');
 if(dir!==1){rect(c,-7,-30,14,4,'#654a39');rect(c,-7,-27,3,4,'#654a39');if(dir!==3)rect(c,-4,-25,2,2,'#39473e');if(dir!==2)rect(c,3,-25,2,2,'#39473e');rect(c,-1,-21,2,1,'#ab6c59');}
 else{rect(c,-7,-31,14,13,'#654a39');rect(c,-5,-32,10,2,'#795842');}
 if(acc){if(acc.style===0&&dir!==1){rect(c,-6,-26,5,4,acc.color);rect(c,1,-26,5,4,acc.color);rect(c,-1,-25,2,1,acc.color);rect(c,-5,-25,3,2,'#a8c9bc');rect(c,2,-25,3,2,'#a8c9bc');}if(acc.style===1){rect(c,-8,-20,16,3,acc.color);rect(c,4,-18,3,7,acc.color);}if(acc.style===2){rect(c,-6,-20,2,13,acc.color);rect(c,3,-13,8,7,acc.color);rect(c,5,-11,4,2,'#dcbe7e');}if(acc.style===3){rect(c,-1,-18,1,6,'#e2bd58');rect(c,-2,-12,4,3,acc.color);}}
 if(hat){const color=hat.color;if(hat.style===0){rect(c,-8,-35,16,7,color);rect(c,-10,-29,20,3,color);rect(c,-6,-35,12,2,'#ffffff25');}if(hat.style===1){rect(c,-7,-35,14,7,color);rect(c,-8,-29,16,4,color);rect(c,-3,-38,6,3,color);}if(hat.style===2){rect(c,-7,-34,14,7,color);rect(c,dir===2?-12:0,-28,12,2,color);}if(hat.style===3){rect(c,-8,-34,16,6,color);rect(c,-5,-36,10,2,color);rect(c,-2,-38,2,3,color);}if(hat.style===4){rect(c,-8,-34,16,6,color);rect(c,-8,-39,3,6,color);rect(c,-2,-40,4,6,color);rect(c,5,-39,3,6,color);rect(c,-1,-33,2,2,'#cd7768');}}
 c.restore();
}
export function drawProduct(c:CanvasRenderingContext2D,p:Product,w:number,h:number){
 c.clearRect(0,0,w,h);c.save();c.translate(w/2,h/2);c.scale(2.6,2.6);const color=p.color;
 if(p.slot==='hat'){
  if(p.style===4){rect(c,-12,-5,24,12,color);for(const x of [-12,-2,8])rect(c,x,-13,4,10,color);rect(c,-2,-1,4,4,'#c77664');}
  else if(p.style===1){rect(c,-10,-10,20,16,color);rect(c,-12,3,24,5,color);rect(c,-4,-15,8,5,color);for(let x=-8;x<10;x+=4)rect(c,x,-8,1,10,'#ffffff25');}
  else if(p.style===2){rect(c,-12,-8,24,15,color);rect(c,0,6,20,3,color);rect(c,-10,-10,20,2,color);rect(c,-3,-4,5,4,'#eee3c2');}
  else if(p.style===3){rect(c,-14,-7,28,11,color);rect(c,-9,-11,20,5,color);rect(c,-2,-14,3,4,color);rect(c,-9,4,21,3,color);}
  else{rect(c,-11,-10,22,17,color);rect(c,-17,6,34,4,color);rect(c,-11,0,22,4,'#3b5e4f44');rect(c,-8,-10,16,2,'#ffffff44');}
 }else if(p.slot==='outfit'){
  rect(c,-11,-13,22,28,color);rect(c,-18,-10,7,16,color);rect(c,11,-10,7,16,color);rect(c,-5,-14,10,4,'#f3ead6');rect(c,-11,12,22,3,'#344c3425');
  if(p.style===1){rect(c,-7,-12,3,23,'#526a7b');rect(c,4,-12,3,23,'#526a7b');rect(c,-7,0,14,15,'#526a7b');}if(p.style===2){rect(c,-1,-10,2,24,'#f3e5be');rect(c,4,4,5,3,'#344c3455');}if(p.style===3){rect(c,-11,-5,22,4,'#f3dab1');rect(c,-11,5,22,4,'#f3dab1');}
 }else if(p.slot==='shoes'){rect(c,-16,-4,12,15,color);rect(c,2,-4,12,15,color);rect(c,-18,7,14,6,color);rect(c,0,7,14,6,color);rect(c,-18,12,14,3,'#e6ddbd');rect(c,0,12,14,3,'#e6ddbd');for(let y=0;y<7;y+=3){rect(c,-13,y,7,1,'#fcf1d0');rect(c,5,y,7,1,'#fcf1d0');}}
 else if(p.style===0){rect(c,-18,-5,14,11,color);rect(c,4,-5,14,11,color);rect(c,-4,-2,8,2,color);rect(c,-16,-3,10,7,'#a8c9bc');rect(c,6,-3,10,7,'#a8c9bc');}
 else if(p.style===1){rect(c,-15,-10,30,9,color);rect(c,4,-1,8,19,color);rect(c,4,12,8,2,'#f3d0bb');}
 else if(p.style===2){rect(c,-9,-14,3,18,color);rect(c,7,-14,3,18,color);rect(c,-12,0,25,18,color);rect(c,-12,0,25,5,'#ad8662');rect(c,-2,4,5,5,'#e2c17e');}
 else{c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.arc(0,-9,10,0,Math.PI);c.stroke();rect(c,-4,2,8,10,color);rect(c,-6,5,12,4,color);rect(c,0,3,4,5,'#f9e5a0');}
 c.restore();
}
function tree(c:CanvasRenderingContext2D,x:number,y:number){
 ellipse(c,x+5,y+1,23,9,'#455b3c24');rect(c,x-4,y-25,8,26,'#8e7856');rect(c,x+1,y-22,3,23,'#716549');
 const blocks=[[-18,-48,34,31],[-26,-39,50,24],[-21,-55,35,20],[-14,-61,22,16],[-28,-30,49,13]];
 for(const [dx,dy,w,h]of blocks)rect(c,x+dx,y+dy,w,h,'#4f7d63');
 rect(c,x-20,y-45,31,23,'#688f6b');rect(c,x-12,y-55,22,26,'#789b72');rect(c,x-23,y-31,21,9,'#74966b');rect(c,x-8,y-51,10,5,'#93ac7c');rect(c,x+10,y-34,9,10,'#426f58');
}
function windowBox(c:CanvasRenderingContext2D,x:number,y:number,w=22,h=24){rect(c,x-2,y-2,w+4,h+4,'#596957');rect(c,x,y,w,h,'#8db6af');rect(c,x+2,y+2,w-4,h/2-2,'#aecfc0');rect(c,x+w/2-1,y,2,h,'#ead9b7');rect(c,x,y+h/2, w,2,'#ead9b7');rect(c,x-3,y+h+2,w+6,3,'#f0dab3');}
function building(c:CanvasRenderingContext2D,b:Building){
 const x=b.x*TILE,y=b.y*TILE,w=b.w*TILE,h=b.h*TILE;
 rect(c,x+9,y+12,w+6,h,'#3c51452b');rect(c,x,y+28,w,h-28,b.trim);rect(c,x+4,y+31,5,h-34,'#f2ddbd');rect(c,x+w-9,y+31,5,h-34,'#bba586');rect(c,x,y+h-8,w,8,'#b5a181');
 // Tiled pitched roof, with stepped edges and a dark eave.
 rect(c,x-6,y+8,w+12,43,b.color);rect(c,x-3,y,w+6,12,b.color);rect(c,x-8,y+47,w+16,6,'#514e4640');rect(c,x-6,y+48,w+12,3,'#f1d7af');
 for(let ry=6;ry<46;ry+=9){rect(c,x-3,y+ry,w+6,1,'#344c342a');for(let rx=0;rx<w;rx+=16){rect(c,x+rx+(ry%2?0:8),y+ry,1,8,'#344c341c');rect(c,x+rx+2,y+ry+2,10,1,'#ffffff18');}}
 rect(c,x+w-35,y-10,14,25,'#aa9b81');rect(c,x+w-38,y-12,20,5,'#d4bfa0');rect(c,x+w-32,y-9,8,3,'#635f50');
 const doorX=x+w/2-12;rect(c,doorX-3,y+h-39,30,38,'#b5a181');rect(c,doorX,y+h-36,24,36,'#617c71');rect(c,doorX+4,y+h-31,16,16,'#a7c3ac');rect(c,doorX+18,y+h-14,2,2,'#eadbb3');rect(c,doorX-7,y+h,w/5+9,5,'#e7dbc2');
 windowBox(c,x+16,y+h-40,22,24);windowBox(c,x+w-38,y+h-40,22,24);
 if(b.shop!==undefined){
  const accent=['#c18b72','#719b8f','#a487ac'][b.shop];
  rect(c,x+10,y+55,w-20,17,'#faf0d6');rect(c,x+12,y+57,w-24,13,'#f1e4c7');pixelText(c,b.label!,x+w/2,y+66,8,'#4f5b4b');
  const ay=y+78;rect(c,x+9,ay,w-18,17,accent);for(let ax=11;ax<w-12;ax+=18){rect(c,x+ax,ay,9,17,'#f3e6c8');rect(c,x+ax,ay+14,9,7,'#e5d7bb');rect(c,x+ax+9,ay+14,9,7,accent);}
  for(const wx of [x+14,x+w-43]){rect(c,wx,y+h-17,30,14,'#9b8060');rect(c,wx-2,y+h-18,34,5,'#b39b6d');for(let i=0;i<4;i++){rect(c,wx+i*7+2,y+h-27,4,10,'#67875c');rect(c,wx+i*7,y+h-27,6,4,i%2?'#ebc78c':'#d08e85');}}
 }else{for(let i=0;i<3;i++){rect(c,x+15+i*9,y+h-11,5,8,'#688960');rect(c,x+14+i*9,y+h-13,7,4,'#d3a07d');}}
}
function bench(c:CanvasRenderingContext2D,x:number,y:number){rect(c,x+3,y+4,38,6,'#314e3920');rect(c,x+3,y-5,3,11,'#52685b');rect(c,x+31,y-5,3,11,'#52685b');rect(c,x,y-15,38,4,'#a68a61');rect(c,x,y-9,38,4,'#b59a6d');rect(c,x,y-2,38,5,'#c7ab7b');}
function lamp(c:CanvasRenderingContext2D,x:number,y:number){ellipse(c,x+3,y+2,8,3,'#405d3822');rect(c,x-2,y-34,4,35,'#5b6b58');rect(c,x-5,y-41,10,9,'#60705b');rect(c,x-3,y-40,6,6,'#f2dd9c');rect(c,x-6,y-43,12,3,'#5c6a55');rect(c,x-4,y,8,3,'#63715b');}
function fountain(c:CanvasRenderingContext2D,time:number){const x=20.5*TILE,y=18.3*TILE;ellipse(c,x+5,y+9,38,19,'#40574522');ellipse(c,x,y,37,23,'#b3bba7');ellipse(c,x,y-4,34,22,'#edf0d3');ellipse(c,x,y-5,29,17,'#79b1aa');ellipse(c,x,y-7,24,13,'#9bcac0');c.strokeStyle='#d4e9cf';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.ellipse(x,y-7,8+i*6+Math.sin(time*2+i),4+i*2,0,0,Math.PI*2);c.stroke();}rect(c,x-4,y-32,8,25,'#c8cfb2');ellipse(c,x,y-33,13,6,'#eef0d7');ellipse(c,x,y-35,10,4,'#91bdb0');rect(c,x-2,y-48,4,15,'#accfc0');rect(c,x-1,y-50+Math.sin(time*3)*2,2,6,'#eff4d9');}
export type View={width:number;height:number;camX:number;camY:number;zoom:number};
export function renderWorld(c:CanvasRenderingContext2D,s:State,width:number,height:number,time:number,particles:{x:number;y:number;text:string;life:number;color:string}[]):View{
 const zoom=width<600?1.2:1.4;const vw=width/zoom,vh=height/zoom;
 const camX=Math.max(0,Math.min(WORLD_W-vw,s.x-vw/2)),camY=Math.max(0,Math.min(WORLD_H-vh,s.y-vh*.76));
 c.clearRect(0,0,width,height);c.save();c.scale(zoom,zoom);c.translate(-Math.round(camX),-Math.round(camY));
 const left=Math.max(0,Math.floor(camX/TILE)-1),top=Math.max(0,Math.floor(camY/TILE)-2),right=Math.min(40,Math.ceil((camX+vw)/TILE)+1),bottom=Math.min(34,Math.ceil((camY+vh)/TILE)+2);
 for(let ty=top;ty<bottom;ty++)for(let tx=left;tx<right;tx++){
  const x=tx*TILE,y=ty*TILE,t=terrain(tx,ty),r=hash(tx,ty);
  if(t==='grass'){rect(c,x,y,32,32,r>.5?'#a7bb88':'#a3b985');for(let n=0;n<5;n++){const gx=x+Math.floor(hash(tx+n,ty)*28),gy=y+Math.floor(hash(tx,ty+n)*28);rect(c,gx,gy,2,2,'#8ea774');if(n===2&&r>.7){rect(c,gx,gy,2,3,'#e6d9a2');}}}
  else if(t==='path'){
   rect(c,x,y,32,32,'#d9cfb0');for(let row=0;row<4;row++)for(let col=0;col<3;col++){const xx=x+col*12-(row%2)*6,yy=y+row*8;rect(c,Math.max(x,xx)+1,yy+1,Math.min(10,x+32-Math.max(x,xx)-1),6,hash(tx*3+col,ty*4+row)>.5?'#e1d8bd':'#dcd2b5');}
   if(terrain(tx,ty-1)==='grass')rect(c,x,y,32,3,'#b7be91');if(terrain(tx-1,ty)==='grass')rect(c,x,y,3,32,'#b7be91');
  }else{rect(c,x,y,32,32,'#79aaa1');rect(c,x+4,y+10+Math.round(Math.sin(time+tx)*2),12,2,'#a8c6b2');rect(c,x+19,y+24,8,1,'#a0c3b0');if(terrain(tx,ty-1)!=='water')rect(c,x,y,32,5,'#c0c39b');if(terrain(tx-1,ty)!=='water')rect(c,x,y,5,32,'#b6bd8f');}
 }
 // Fine garden borders and flowers.
 for(let x=9;x<33;x++){if(x>14&&x<26)continue;rect(c,x*TILE,21.5*TILE,24,2,'#8d9e75');for(let i=0;i<3;i++){rect(c,x*TILE+4+i*7,21.5*TILE-6,2,7,'#6e8b62');rect(c,x*TILE+3+i*7,21.5*TILE-8,4,3,['#d89788','#e2c47d','#ded6b4'][i]);}}
 for(const cr of s.crystals){if(cr.x<camX-20||cr.x>camX+vw+20||cr.y<camY-20||cr.y>camY+vh+20)continue;crystal(c,cr.x,cr.y+Math.sin(time*2+cr.phase)*2,cr.rarity,.75,time+cr.phase);}
 const objects:{y:number;draw:()=>void}[]=[];
 BUILDINGS.forEach(b=>objects.push({y:(b.y+b.h)*TILE,draw:()=>building(c,b)}));
 TREES.forEach(([tx,ty])=>objects.push({y:ty*TILE+22,draw:()=>tree(c,tx*TILE+16,ty*TILE+22)}));
 for(const [x,y]of [[15,17],[24,17],[15,21],[25,21],[11,29],[29,29]])objects.push({y:y*TILE,draw:()=>lamp(c,x*TILE,y*TILE)});
 for(const [x,y]of [[17,22],[23,22],[17,29],[28,23],[7,18]])objects.push({y:y*TILE,draw:()=>bench(c,x*TILE,y*TILE)});
 objects.push({y:18.7*TILE,draw:()=>fountain(c,time)});
 // Town noticeboard and market basket.
 objects.push({y:22.7*TILE,draw:()=>{const x=13.8*TILE,y=22.7*TILE;rect(c,x,y-30,3,32,'#927c59');rect(c,x+29,y-30,3,32,'#927c59');rect(c,x-3,y-32,39,26,'#9d845e');rect(c,x,y-29,33,20,'#d6c59e');rect(c,x+4,y-26,11,13,'#f2e7c8');rect(c,x+20,y-25,8,8,'#b7c69b');rect(c,x-5,y-35,43,4,'#6e8266');}});
 objects.push({y:s.y,draw:()=>character(c,s.x,s.y,s.equipped,s.direction,s.step,s.moving,1)});
 objects.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
 // Shop door markers remain easy to find.
 SHOPS.forEach(sh=>{const near=Math.hypot(s.x-sh.x,s.y-sh.y)<65;ellipse(c,sh.x,sh.y,12,4,near?'#f4e8a48c':'#f8eed23b');pixelText(c,near?'E':'⌄',sh.x,sh.y-4,near?10:14,near?'#3d5b44':'#fbf1d7');});
 for(const p of particles){c.globalAlpha=Math.min(1,p.life);pixelText(c,p.text,p.x,p.y-(1.5-p.life)*22,11,p.color);c.globalAlpha=1;}
 c.restore();
 return {width,height,camX,camY,zoom};
}
export function minimap(c:CanvasRenderingContext2D,s:State,w:number,h:number){
 c.clearRect(0,0,w,h);c.save();c.scale(w/WORLD_W,h/WORLD_H);c.fillStyle='#bccba3';c.fillRect(0,0,WORLD_W,WORLD_H);
 for(let y=0;y<34;y++)for(let x=0;x<40;x++){const t=terrain(x,y);if(t!=='grass')rect(c,x*TILE,y*TILE,32,32,t==='water'?'#82b3ab':'#e8dfc4');}
 for(const b of BUILDINGS)rect(c,b.x*TILE,b.y*TILE,b.w*TILE,b.h*TILE,b.color);
 for(const sh of SHOPS){rect(c,sh.x-14,sh.y-14,28,28,'#faf1d4');rect(c,sh.x-8,sh.y-8,16,16,'#8c685d');}
 ellipse(c,s.x,s.y,29,29,'#f8f5df');ellipse(c,s.x,s.y,19,19,'#3b6550');c.restore();
}
