import { useRef } from 'react';
export function StartScreen({onFile,restored}:{onFile:(f:File)=>void;restored?:string}) { const ref=useRef<HTMLInputElement>(null); return <main className="start">
  <div className="brand-mark"><i/><i/><i/></div><p className="eyebrow">UNE ÉCOUTE À SOI</p><h1>Emo<span>Sound</span></h1>
  <p className="baseline">Écoute. Ressens.<br/>Fais danser les sons du vivant.</p>
  {restored&&<p className="restore">Retrouvé : <strong>{restored}</strong><br/>Recharge ton paysage sonore pour continuer.</p>}
  <button className="choose" onClick={()=>ref.current?.click()}><b>＋</b><span>CHOISIR UN PAYSAGE SONORE<small>MP3, WAV ou M4A</small></span></button>
  <input ref={ref} hidden type="file" accept="audio/mpeg,audio/wav,audio/mp4,.m4a" onChange={e=>e.target.files?.[0]&&onFile(e.target.files[0])}/>
  <p className="privacy">Ton écoute reste sur cet appareil.</p>
 </main> }
