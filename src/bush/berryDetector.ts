import {extractSample} from '../audio/sampleExtractor';
import type {Analysis,SoundBerry} from '../types/audiomood';

export function detectBerries(duration:number,a:Analysis):SoundBerry[]{
 const wanted=Math.max(12,Math.min(18,Math.round(duration/12))),gap=duration/(wanted+1),used:number[]=[];
 return Array.from({length:wanted},(_,n)=>{const center=gap*(n+1),radius=Math.max(.8,gap*.42);let best=center,score=-1;for(let t=Math.max(.2,center-radius);t<Math.min(duration-.2,center+radius);t+=a.frameDuration){const i=Math.min(a.flux.length-1,Math.round(t/a.frameDuration)),novelty=a.flux[i]*2+a.rms[i]*.35;if(novelty>score&&used.every(x=>Math.abs(x-t)>gap*.45)){score=novelty;best=t}}used.push(best);const sample=extractSample(`branch-${n%7}`,best,duration,a),angle=n*2.399+sample.visualSeed%1;return {...sample,sourceTime:best,branchId:`branch-${n%7}`,position:{x:1100+Math.cos(angle)*(350+(n%4)*125),y:750+Math.sin(angle)*(260+(n%3)*115)},state:'hidden'};});
}
