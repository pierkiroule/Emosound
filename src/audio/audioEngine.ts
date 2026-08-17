import type { AudioMoodSample } from '../types/audiomood';
type Voice={source:AudioBufferSourceNode;gain:GainNode};
export class AudioEngine{
 context=new AudioContext();buffer?:AudioBuffer;source?:AudioBufferSourceNode;startedAt=0;offset=0;private master=this.context.createGain();private voices=new Map<string,Voice>();
 constructor(){this.master.connect(this.context.destination)}
 async load(data:ArrayBuffer){this.stop();this.stopAll();this.buffer=await this.context.decodeAudioData(data.slice(0));this.offset=0;return this.buffer}
 play(from=this.offset,onEnded?:()=>void){if(!this.buffer)return;this.stop(false);this.source=this.context.createBufferSource();this.source.buffer=this.buffer;this.source.connect(this.master);this.startedAt=this.context.currentTime-from;this.offset=from;this.source.onended=()=>onEnded?.();this.source.start(0,from)}
 pause(){this.offset=this.time;this.stop(false)}
 stop(reset=true){if(this.source){this.source.onended=null;try{this.source.stop()}catch{/* ended */}this.source.disconnect();this.source=undefined}if(reset)this.offset=0}
 seek(time:number,playing=false,onEnded?:()=>void){this.stop(false);this.offset=Math.max(0,Math.min(time,this.buffer?.duration??0));if(playing)this.play(this.offset,onEnded)}
 async trigger(sample:AudioMoodSample,loop=false,onEnded?:()=>void){if(!this.buffer)return;await this.context.resume();this.stopVoice(sample.id);const source=this.context.createBufferSource(),gain=this.context.createGain(),now=this.context.currentTime;source.buffer=this.buffer;source.loop=loop;source.loopStart=sample.loop?.start??sample.sourceStart;source.loopEnd=sample.loop?.end??sample.sourceEnd;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+.025);source.connect(gain).connect(this.master);this.voices.set(sample.id,{source,gain});this.balance();source.onended=()=>{if(this.voices.get(sample.id)?.source===source){this.voices.delete(sample.id);this.balance();onEnded?.()}};source.start(now,sample.sourceStart,loop?undefined:sample.duration)}
 stopVoice(id:string){const voice=this.voices.get(id);if(!voice)return;const now=this.context.currentTime;voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setValueAtTime(voice.gain.gain.value,now);voice.gain.gain.linearRampToValueAtTime(0,now+.08);try{voice.source.stop(now+.09)}catch{/* ended */}this.voices.delete(id);this.balance()}
 stopAll(){for(const id of [...this.voices.keys()])this.stopVoice(id)}
 private balance(){this.master.gain.setTargetAtTime(1/Math.sqrt(Math.max(1,this.voices.size)),this.context.currentTime,.035)}
 get time(){return this.source?Math.min(this.buffer?.duration??0,this.context.currentTime-this.startedAt):this.offset}
}
