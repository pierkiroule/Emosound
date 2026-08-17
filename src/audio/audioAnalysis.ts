import type { Analysis } from '../types/emosound';

export function analyseAudio(buffer: AudioBuffer): Analysis {
  const samples = buffer.getChannelData(0), frame = 1024, count = Math.ceil(samples.length / frame);
  const bands: Analysis['bands'] = [new Float32Array(count), new Float32Array(count), new Float32Array(count)];
  let peak = 0, sum = 0, previous = 0;
  for (let n=0;n<count;n++) {
    let low=0, mid=0, high=0, rms=0;
    for(let i=n*frame;i<Math.min(samples.length,(n+1)*frame);i++) {
      const v=samples[i], slow=previous*.94+v*.06, detail=v-previous; previous=v;
      low+=slow*slow; mid+=(v-slow)*(v-slow); high+=detail*detail; rms+=v*v; peak=Math.max(peak,Math.abs(v));
    }
    const size=Math.min(frame,samples.length-n*frame); bands[0][n]=Math.sqrt(low/size); bands[1][n]=Math.sqrt(mid/size); bands[2][n]=Math.sqrt(high/size); sum+=rms;
  }
  const rms=Math.sqrt(sum/samples.length); const gain=Math.min(8,Math.max(1.1,.18/Math.max(.025,rms*.7+peak*.3)));
  for(const band of bands) { let smooth=0; for(let i=0;i<band.length;i++){ smooth += (band[i]-smooth)*(band[i]>smooth?.34:.09); band[i]=Math.min(1,smooth*gain); } }
  return {bands,frameDuration:frame/buffer.sampleRate,gain};
}
