import{verbById,type AudioMoodSample,type SensoryVerb}from'../types/audiomood';

type Quality='HIGH'|'MEDIUM'|'LOW';
type Smoothed={low:number;mid:number;high:number;rms:number;centroid:number;flux:number;transient:number};
type Particle={angle:number;radius:number;size:number;speed:number;phase:number;drift:number};
const TAU=Math.PI*2;
const seeded=(seed:number,n:number)=>{const x=Math.sin(seed*12.9898+n*78.233)*43758.5453;return x-Math.floor(x)};

/** One lightweight renderer shared by the stage and previews. */
export class SensoryVisualEngine{
 private smooth=new Map<string,Smoothed>();
 private presence=new Map<string,number>();
 private quality:Quality='HIGH';
 private slowFrames=0;
 private offsets=new Map<string,Float32Array>();
 private particles=new Map<string,Particle[]>();
 constructor(private ctx:CanvasRenderingContext2D){}
 setQuality(q:Quality){this.quality=q}
 reportFrame(ms:number){this.slowFrames=ms>22?this.slowFrames+1:Math.max(0,this.slowFrames-2);if(this.slowFrames>35){this.quality=this.quality==='HIGH'?'MEDIUM':'LOW';this.slowFrames=0}}
 render(samples:AudioMoodSample[],active:Set<string>,t:number,w:number,h:number){
  const x=this.ctx;x.globalCompositeOperation='source-over';x.globalAlpha=1;
  const bg=x.createRadialGradient(w*.5,h*.48,4,w*.5,h*.48,Math.max(w,h)*.72);bg.addColorStop(0,'#243142');bg.addColorStop(.58,'#111a25');bg.addColorStop(1,'#080c14');x.fillStyle=bg;x.fillRect(0,0,w,h);
  for(const s of samples){const target=active.has(s.id)?1:active.size?0:.12,old=this.presence.get(s.id)??target,p=old+(target-old)*(target>old?.16:.035);this.presence.set(s.id,p);if(p>.008)this.drawSample(s,t,w,h,p)}
 }
 private values(s:AudioMoodSample){
  const v=verbById(s.sensoryVerb),f=s.audioFeatures,target={...f,transient:f.transient??f.flux},old=this.smooth.get(s.id)??{...target};
  for(const k of Object.keys(old)as(keyof Smoothed)[]){const rate=target[k]>old[k]?v.attack:v.release;old[k]+=(target[k]-old[k])*rate}this.smooth.set(s.id,old);return old
 }
 private irregular(s:AudioMoodSample){let a=this.offsets.get(s.id);if(!a){a=new Float32Array(24);for(let i=0;i<a.length;i++)a[i]=seeded(s.visualSeed,i)*2-1;this.offsets.set(s.id,a)}return a}
 private particleSet(s:AudioMoodSample){let list=this.particles.get(s.id);if(!list){list=Array.from({length:28},(_,i)=>({angle:seeded(s.visualSeed,i*6)*TAU,radius:.25+seeded(s.visualSeed,i*6+1)*.95,size:1+seeded(s.visualSeed,i*6+2)*4,speed:.35+seeded(s.visualSeed,i*6+3)*1.2,phase:seeded(s.visualSeed,i*6+4)*TAU,drift:seeded(s.visualSeed,i*6+5)*2-1}));this.particles.set(s.id,list)}return list}
 private blob(cx:number,cy:number,r:number,phase:number,noise:Float32Array,stretch=1){const x=this.ctx,n=noise.length;x.beginPath();for(let i=0;i<=n;i++){const a=i/n*TAU,j=i%n,rr=r*(1+noise[j]*.09+Math.sin(phase+i*.7)*.035),px=cx+Math.cos(a)*rr*stretch,py=cy+Math.sin(a)*rr;if(i===0)x.moveTo(px,py);else x.lineTo(px,py)}x.closePath()}
 private wash(cx:number,cy:number,r:number,phase:number,s:AudioMoodSample,alpha:number,stretch=1){const x=this.ctx,v=verbById(s.sensoryVerb),noise=this.irregular(s);for(let layer=0;layer<(this.quality==='LOW'?2:3);layer++){this.blob(cx,cy,r*(1+layer*.12),phase+layer,noise,stretch);x.fillStyle=layer===0?v.primary:v.secondary;x.globalAlpha=alpha/(layer+1);x.fill();if(layer===0){x.strokeStyle=v.accent;x.globalAlpha=alpha*.72;x.lineWidth=1.2;x.stroke()}}}
 private filament(cx:number,cy:number,r:number,a:number,bend:number,color:string,alpha:number,width=.7){const x=this.ctx;x.beginPath();x.moveTo(cx,cy);x.bezierCurveTo(cx+Math.cos(a+.5)*r*.35,cy+Math.sin(a+.5)*r*.35,cx+Math.cos(a-bend)*r*.72,cy+Math.sin(a-bend)*r*.72,cx+Math.cos(a)*r,cy+Math.sin(a)*r);x.strokeStyle=color;x.globalAlpha=alpha;x.lineWidth=width;x.stroke()}
 private dot(px:number,py:number,size:number,color:string,alpha:number,soft=false){const x=this.ctx;if(soft){const g=x.createRadialGradient(px,py,0,px,py,size*3);g.addColorStop(0,color);g.addColorStop(1,'transparent');x.fillStyle=g;x.globalAlpha=alpha;x.beginPath();x.arc(px,py,size*3,0,TAU);x.fill()}else{x.fillStyle=color;x.globalAlpha=alpha;x.beginPath();x.arc(px,py,size,0,TAU);x.fill()}}
 private particleCount(verb:SensoryVerb,high:number){const max=this.quality==='LOW'?10:this.quality==='MEDIUM'?18:28;const base=verb==='petille'||verb==='frissonne'?12:8;return Math.min(max,Math.round(base+high*(max-base)))}
 private drawParticles(s:AudioMoodSample,f:Smoothed,t:number,cx:number,cy:number,base:number,presence:number){
  const v=verbById(s.sensoryVerb),list=this.particleSet(s),count=this.particleCount(v.id,f.high);this.ctx.globalCompositeOperation='screen';
  for(let i=0;i<count;i++){const p=list[i];let px=cx,py=cy,size=p.size*(.65+f.high);const alpha=presence*(.12+f.rms*.28);
   if(v.id==='berce'){const rise=((t*p.speed*.08+p.phase/TAU)%1);px+=p.drift*base+Math.sin(t*.45+p.phase)*base*.18;py+=base*(.9-rise*1.8);size*=1.2;this.ctx.strokeStyle=v.secondary;this.ctx.globalAlpha=alpha;this.ctx.lineWidth=.65;this.ctx.beginPath();this.ctx.arc(px,py,size*1.5,0,TAU);this.ctx.stroke()}
   else if(v.id==='petille'){const grow=(t*(.35+f.flux*.7)*p.speed+p.phase)%1,r=base*p.radius*grow,a=p.angle+Math.sin(t+p.phase)*.12;px+=Math.cos(a)*r;py+=Math.sin(a)*r;size*=.5+Math.sin(grow*Math.PI);this.dot(px,py,size,v.accent,alpha*(1-grow*.55),i%4===0)}
   else if(v.id==='tourne'){const direction=Math.sin(t*.13+s.visualSeed)>.15?1:-1,a=p.angle+direction*t*(.16+f.rms*.42)*p.speed,r=base*p.radius*(1+f.low*.5);px+=Math.cos(a)*r;py+=Math.sin(a)*r*.62;this.dot(px,py,size,v.secondary,alpha,i%5===0)}
   else if(v.id==='secoue'){const life=(t*(.22+f.transient*.5)*p.speed+p.phase)%1,a=p.angle+f.mid*p.drift*.2,r=base*life*(.7+f.low)*p.radius;px+=Math.cos(a)*r;py+=Math.sin(a)*r+life*life*base*.18;this.dot(px,py,size*(1-life*.7),i%2?v.accent:v.secondary,alpha*(1-life))}
   else if(v.id==='frissonne'){const travel=(t*(.12+f.flux*.35)*p.speed+p.phase)%1;px+=base*(travel*2-1);py+=p.drift*base*.8+Math.sin(t*(3+f.high*7)+p.phase)*base*(.015+f.high*.055);this.dot(px,py,size*.55,v.accent,alpha*.8)}
   else{const a=p.angle+t*(.05+f.rms*.09)*p.speed,r=base*(.6+p.radius*.75)*(1+Math.sin(t*.45+p.phase)*.1);px+=Math.cos(a)*r;py+=Math.sin(a)*r*.78;this.dot(px,py,size*.8,v.accent,alpha,i%6===0)}
  }
 }
 private drawSample(s:AudioMoodSample,t:number,w:number,h:number,presence:number){
  const x=this.ctx,f=this.values(s),v=verbById(s.sensoryVerb),seed=s.visualSeed,cx=w*(.5+(seeded(seed,2)-.5)*.24),cy=h*(.5+(seeded(seed,3)-.5)*.18),base=Math.min(w,h)*(.13+f.low*.1),phase=t+seed;x.globalCompositeOperation='screen';
  if(v.id==='berce'){const sway=Math.sin(phase*.42)*base*(.12+f.low*.2);this.wash(cx+sway,cy,base*(1+Math.sin(phase*.65)*.08),phase,s,presence*(.2+f.rms*.28),1.45+f.mid*.35);for(let i=0;i<8;i++)this.filament(cx+sway,cy,base*1.8,i/8*TAU+Math.sin(phase*.25)*.12,f.mid*.5,v.accent,presence*.16)}
  if(v.id==='petille'){this.wash(cx,cy,base*.58,phase,s,presence*.2);for(let i=0;i<8;i++){const a=i/8*TAU+seeded(seed,i),r=base*(.55+seeded(seed,i+20));this.filament(cx,cy,r,a,f.mid,v.accent,presence*.25,1);this.wash(cx+Math.cos(a)*r,cy+Math.sin(a)*r,4+f.high*7,phase+i,s,presence*.25)}}
  if(v.id==='tourne'){for(let i=0;i<6;i++){const a=i/6*TAU+phase*(.1+f.rms*.18)*(i%2?.8:1),r=base*(.6+i*.22+f.low*.7),px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r*.65;this.filament(cx,cy,r*1.35,a,f.mid*.8,v.secondary,presence*.3,1.1);this.wash(px,py,base*.2,phase+i,s,presence*.24,1.8)}}
  if(v.id==='secoue'){const burst=.2+.8*Math.pow((Math.sin(phase*(.7+f.transient))+1)/2,6),r=base*(.65+burst*(1+f.low));this.wash(cx,cy,r*.55,phase,s,presence*.34);for(let i=0;i<12;i++){const a=i/12*TAU+seeded(seed,i)*.3;this.filament(cx,cy,r*(.8+seeded(seed,i+4)),a,f.mid*.7,v.accent,presence*(.1+burst*.35),.8+f.high)}}
  if(v.id==='frissonne'){const count=this.quality==='LOW'?7:14;for(let i=0;i<count;i++){const a=-Math.PI*.15+i/(count-1)*Math.PI*1.3,r=base*(1.1+seeded(seed,i)*.7),micro=Math.sin(phase*(4+f.high*5)+i)*(.03+f.high*.09);this.filament(cx-base*.2,cy+Math.sin(i)*5,r,a+micro,f.mid*.55,v.primary,presence*.32,.45+f.centroid*.5)}}
  if(v.id==='enveloppe'){const count=this.quality==='LOW'?3:5;for(let i=0;i<count;i++){const a=phase*.08+i/count*TAU,open=1+f.low*.4+Math.sin(phase*.5+i)*.08;this.wash(cx+Math.cos(a)*base*.18,cy+Math.sin(a)*base*.12,base*open*(1-i*.08),phase+i,s,presence*(.12+i*.025),1.25+f.mid*.25)}}
  this.drawParticles(s,f,t,cx,cy,base,presence);x.globalAlpha=1;x.globalCompositeOperation='source-over'
 }
}
