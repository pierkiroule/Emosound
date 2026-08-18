export type SensoryVerb='berce'|'petille'|'tourne'|'secoue'|'frissonne'|'enveloppe';
export type SampleKind='oneShot'|'phrase'|'loop';
export interface SensoryGrammar{id:SensoryVerb;label:string;prompt:string;emoji:string;primary:string;secondary:string;accent:string;attack:number;release:number}
export interface MoodMarker{id:string;time:number;sampleId?:string}
export interface AudioFeatures{rms:number;low:number;mid:number;high:number;centroid:number;flux:number;transient:number}
export interface AudioMoodSample{id:string;markerId:string;sourceStart:number;sourceEnd:number;duration:number;type:SampleKind;sensoryVerb?:SensoryVerb;audioFeatures:AudioFeatures;visualSeed:number;loop?:{start:number;end:number;crossfade:number}}
export interface PerformanceEvent{time:number;sampleId:string;action:'play'|'stop'|'loopStart'|'loopStop'|'silence'}
export interface AudioMoodPerformance{id:string;name:string;duration:number;events:PerformanceEvent[]}
export interface AudioMoodProject{id:string;audioName:string;duration:number;markers:MoodMarker[];samples:AudioMoodSample[];performance?:AudioMoodPerformance}
export interface Analysis{bands:[Float32Array,Float32Array,Float32Array];rms:Float32Array;flux:Float32Array;frameDuration:number;gain:number;globalRms:number;peak:number;dynamicRange:number}
export interface SoundBerry extends AudioMoodSample{sourceTime:number;branchId:string;position:{x:number;y:number};state:'hidden'|'seen'|'picked'}
export const SENSORY_VERBS:SensoryGrammar[]=[
 {id:'berce',emoji:'🫧',label:'BERCE',prompt:'Ça me berce',primary:'#65d9df',secondary:'#b9f5eb',accent:'#79aef5',attack:.045,release:.012},
 {id:'petille',emoji:'✨',label:'PÉTILLE',prompt:'Ça pétille en moi',primary:'#ffd75e',secondary:'#ff997e',accent:'#fff2ae',attack:.22,release:.055},
 {id:'tourne',emoji:'🌀',label:'TOURNE',prompt:'Ça me fait tourner',primary:'#8f83ef',secondary:'#67c9e8',accent:'#d8b9ff',attack:.09,release:.025},
 {id:'secoue',emoji:'💥',label:'SECOUE',prompt:'Ça me secoue',primary:'#ff795f',secondary:'#ff77ad',accent:'#ffd09c',attack:.32,release:.035},
 {id:'frissonne',emoji:'〰️',label:'FRISSONNE',prompt:'Ça me fait frissonner',primary:'#ef6d9d',secondary:'#72b8f3',accent:'#ffc5dc',attack:.2,release:.06},
 {id:'enveloppe',emoji:'🌊',label:'ENVELOPPE',prompt:'Ça m’enveloppe',primary:'#54d4ba',secondary:'#70bfe5',accent:'#c2f4dd',attack:.07,release:.016}
];
export const verbById=(id?:SensoryVerb)=>SENSORY_VERBS.find(v=>v.id===id)??SENSORY_VERBS[0];
