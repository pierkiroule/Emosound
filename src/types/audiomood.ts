export type MoodId = 'calm' | 'spark' | 'curiosity' | 'surprise' | 'tension' | 'embrace';
export type SampleKind = 'oneShot' | 'phrase' | 'loop';
export interface Mood { id:MoodId; label:string; emoji:string; primary:string; secondary:string; motion:'breathe'|'spark'|'wander'|'burst'|'shake'|'orbit'; speed:number; density:number }
export interface MoodMarker { id:string; time:number; mood:MoodId; sampleId?:string }
export interface AudioFeatures { rms:number; low:number; mid:number; high:number; centroid:number; flux:number }
export interface AudioMoodSample { id:string; markerId:string; sourceStart:number; sourceEnd:number; duration:number; type:SampleKind; mood:MoodId; audioFeatures:AudioFeatures; visualSeed:number; loop?:{start:number;end:number;crossfade:number} }
export interface PerformanceEvent { time:number; sampleId:string; action:'play'|'stop'|'loopStart'|'loopStop' }
export interface AudioMoodPerformance { id:string; name:string; duration:number; events:PerformanceEvent[] }
export interface AudioMoodProject { id:string; audioName:string; duration:number; markers:MoodMarker[]; samples:AudioMoodSample[]; performance?:AudioMoodPerformance }
export interface Analysis { bands:[Float32Array,Float32Array,Float32Array]; rms:Float32Array; flux:Float32Array; frameDuration:number; gain:number; globalRms:number; peak:number; dynamicRange:number }
export const MOODS:Mood[]=[
{id:'calm',emoji:'😌',label:"Ça m’apaise",primary:'#83d7c0',secondary:'#c6f4e8',motion:'breathe',speed:.55,density:.35},
{id:'spark',emoji:'✨',label:'Ça pétille',primary:'#ffd56f',secondary:'#fff3bd',motion:'spark',speed:1.8,density:.8},
{id:'curiosity',emoji:'👀',label:"Ça m’intrigue",primary:'#ac9cff',secondary:'#ddd5ff',motion:'wander',speed:.8,density:.55},
{id:'surprise',emoji:'😮',label:'Ça me surprend',primary:'#ff8d67',secondary:'#ffd0be',motion:'burst',speed:2,density:.65},
{id:'tension',emoji:'😬',label:'Ça me tend',primary:'#ff6684',secondary:'#ffb2bf',motion:'shake',speed:1.5,density:.75},
{id:'embrace',emoji:'🤗',label:"Ça m’enveloppe",primary:'#ef9fcd',secondary:'#ffe0f2',motion:'orbit',speed:.65,density:.5},
];
export const moodById=(id:MoodId)=>MOODS.find(m=>m.id===id)!;
