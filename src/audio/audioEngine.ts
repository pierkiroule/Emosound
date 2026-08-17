export class AudioEngine {
  context = new AudioContext(); buffer?: AudioBuffer; source?: AudioBufferSourceNode; startedAt=0; offset=0;
  async load(data: ArrayBuffer) { this.buffer=await this.context.decodeAudioData(data.slice(0)); this.offset=0; return this.buffer; }
  play(from=this.offset,onEnded?:()=>void) { if(!this.buffer)return; this.stop(false); this.source=this.context.createBufferSource(); this.source.buffer=this.buffer; this.source.connect(this.context.destination); this.startedAt=this.context.currentTime-from; this.offset=from; this.source.onended=()=>onEnded?.(); this.source.start(0,from); }
  pause(){this.offset=this.time;this.stop(false)}
  stop(reset=true){if(this.source){this.source.onended=null;try{this.source.stop()}catch{/* already stopped */}this.source.disconnect();this.source=undefined}if(reset)this.offset=0}
  seek(time:number,playing=false,onEnded?:()=>void){this.stop(false);this.offset=Math.max(0,Math.min(time,this.buffer?.duration??0));if(playing)this.play(this.offset,onEnded)}
  get time(){return this.source?Math.min(this.buffer?.duration??0,this.context.currentTime-this.startedAt):this.offset}
}
