// Procedural print artwork for the opt-in motion studies. Drawn directly onto
// the existing deforming film UVs, so it bends and swipes with the vinyl.
export function drawSurfaceArt(ctx,w,h,option){
 ctx.clearRect(0,0,w,h);ctx.save();ctx.scale(w/1024,h/768);
 const ink='#e9f2f4',muted='#b9e3ef',dark='#153d50';
 const line=(points,color=ink,width=2)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
 const text=(value,x,y,size=16,color=ink)=>{ctx.fillStyle=color;ctx.font=`600 ${size}px monospace`;ctx.fillText(value,x,y);};
 ctx.strokeStyle='#d5edf255';ctx.lineWidth=1;ctx.strokeRect(56,56,912,656);
 [[72,72],[952,72],[72,696],[952,696]].forEach(([x,y])=>{line([[x-10,y],[x+10,y]],muted);line([[x,y-10],[x,y+10]],muted);});
 text('ZAN / SURFACE EXPERIMENTS',85,108,17);text(`SERIES 0${option}   /   CUSTOM CUT`,85,680,15);
 const phase=0;
 if(option===1){
  for(let i=0;i<22;i++){ctx.beginPath();for(let j=0;j<=120;j++){const a=j/120*Math.PI*2,r=38+i*10+Math.sin(a*3+phase+i*.12)*14,x=540+Math.cos(a)*r*1.27,y=380+Math.sin(a)*r*.79;j?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.strokeStyle=i%4===0?ink:'#b8e1ed99';ctx.lineWidth=i%4===0?3:1.2;ctx.stroke();}
  text('PRESSURE',98,202,52);text('01',765,603,116);line([[120,590],[360,590]],ink,6);
 }else if(option===2){
  ctx.save();ctx.beginPath();ctx.rect(100,170,830,430);ctx.clip();
  for(let i=0;i<7;i++){const x=140+i*125+Math.sin(phase)*12;ctx.beginPath();ctx.moveTo(x,170);ctx.lineTo(x+75,170);ctx.lineTo(x-75,600);ctx.lineTo(x-150,600);ctx.closePath();ctx.fillStyle=i%2?ink:dark;ctx.fill();}ctx.restore();
  ctx.fillStyle='#398eaf';ctx.fillRect(355,260,330,215);text('CUT',390,350,104);text('DIFFERENT.',388,414,35);text('02 / PRECISION LIVERY',100,634,22);
 }else if(option===3){
  ctx.save();ctx.translate(530,385);ctx.rotate(-.16+Math.sin(phase)*.02);
  for(let i=0;i<19;i++){const s=80+i*22;ctx.strokeStyle=i%3===0?ink:'#b8e1ed77';ctx.lineWidth=i%3===0?4:1;ctx.strokeRect(-s/2,-s*.31,s,s*.62);}ctx.restore();
  text('FORM',92,252,66);text('FOLLOWS YOU.',92,310,28);text('03',796,610,90);
 }else if(option===4){
  for(let i=0;i<13;i++){const y=185+i*32;ctx.beginPath();ctx.moveTo(100,y+75);ctx.bezierCurveTo(370,y+100,580,y-95+Math.sin(phase+i*.2)*15,930,y-15);ctx.lineTo(930,y+2);ctx.bezierCurveTo(580,y-70,370,y+125,100,y+92);ctx.closePath();ctx.fillStyle=i%4===0?ink:i%4===1?dark:'#c1e4ed88';ctx.fill();}
  ctx.fillStyle='#24576d';ctx.fillRect(94,490,355,116);text('APEX / 04',118,566,48);text('BUILT TO BREAK THE SAME.',98,644,20);
 }else{
  for(let i=0;i<12;i++){const r=72+i*18;ctx.beginPath();ctx.ellipse(540,370,r*1.44,r*.75,-.25,0,Math.PI*2);ctx.strokeStyle=i%3===0?ink:'#c2e2ec66';ctx.lineWidth=i%3===0?2.6:1;ctx.stroke();}
  const path=[[180,200],[790,160],[850,340],[550,560],[300,510],[180,200]];line(path,ink,6);
  text('SIGNED BY',100,596,26);text('YOUR CHARACTER.',100,642,43);text('05',782,615,72);
 }
 text('DECAL / WRAPPING / INDIVIDUALITY',570,680,12,muted);ctx.restore();
}
