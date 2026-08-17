import { useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../audio/audioEngine';

export function useAudioPlayer() {
  const engine=useRef<AudioEngine | null>(null); if(!engine.current)engine.current=new AudioEngine();
  const [isPlaying,setPlaying]=useState(false), [currentTime,setTime]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setTime(engine.current!.time),100);return()=>clearInterval(id)},[]);
  const ended=()=>setPlaying(false);
  const toggle=async()=>{await engine.current!.context.resume();if(isPlaying)engine.current!.pause();else engine.current!.play(undefined,ended);setPlaying(!isPlaying)};
  const seek=(t:number)=>{engine.current!.seek(t,isPlaying,ended);setTime(t)};
  return {engine:engine.current,isPlaying,currentTime,toggle,seek,setPlaying};
}
