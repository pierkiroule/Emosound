import {useState} from 'react';
import {StartScreen} from './components/StartScreen';
import {BushExperience} from './components/BushExperience';
import {analyseAudio} from './audio/audioAnalysis';
import {detectBerries} from './bush/berryDetector';
import {useAudioPlayer} from './hooks/useAudioPlayer';
import type {Analysis,SoundBerry} from './types/audiomood';

export default function App(){
 const [analysis,setAnalysis]=useState<Analysis>();
 const [berries,setBerries]=useState<SoundBerry[]>([]);
 const [loading,setLoading]=useState(false);
 const player=useAudioPlayer();
 const load=async(file:File)=>{setLoading(true);try{const buffer=await player.engine.load(await file.arrayBuffer());const next=analyseAudio(buffer);setAnalysis(next);setBerries(detectBerries(buffer.duration,next));}catch{alert('Ce paysage sonore ne peut pas être ouvert ici.')}finally{setLoading(false)}};
 return <>{analysis?<BushExperience analysis={analysis} berries={berries} setBerries={setBerries} engine={player.engine}/>:<StartScreen onFile={load}/>} {loading&&<div className="loading"><i/><span>Le BuisSon pousse…</span></div>}</>;
}
