import type { Analysis } from '../types/audiomood';
export function analyseAudio(buffer:AudioBuffer):Analysis{
 const data=buffer.getChannelData(0),frame=1024,count=Math.ceil(data.length/frame),bands:Analysis['bands']=[new Float32Array(count),new Float32Array(count),new Float32Array(count)],rms=new Float32Array(count),flux=new Float32Array(count);let peak=0,sum=0,slow=0,previousEnergy=0,min=1,max=0;
 for(let n=0;n<count;n++){let lo=0,mi=0,hi=0,total=0,prev=0;const end=Math.min(data.length,(n+1)*frame);for(let i=n*frame;i<end;i++){const v=data[i];slow=slow*.96+v*.04;const detail=v-prev;prev=v;lo+=slow*slow;mi+=(v-slow)*(v-slow);hi+=detail*detail;total+=v*v;peak=Math.max(peak,Math.abs(v))}const size=Math.max(1,end-n*frame),energy=Math.sqrt(total/size);rms[n]=energy;bands[0][n]=Math.sqrt(lo/size);bands[1][n]=Math.sqrt(mi/size);bands[2][n]=Math.sqrt(hi/size);flux[n]=Math.max(0,energy-previousEnergy);previousEnergy=energy;sum+=total;min=Math.min(min,energy);max=Math.max(max,energy)}
 const globalRms=Math.sqrt(sum/data.length),gain=Math.min(9,Math.max(1,.2/Math.max(.018,globalRms)));
 for(const band of bands){let smooth=0;for(let i=0;i<band.length;i++){smooth+=(band[i]-smooth)*(band[i]>smooth?.35:.1);band[i]=Math.min(1,smooth*gain)}}
 return {bands,rms,flux,frameDuration:frame/buffer.sampleRate,gain,globalRms,peak,dynamicRange:max-min};
}
