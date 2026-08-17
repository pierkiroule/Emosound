export type Feeling = 'calm' | 'surprise' | 'spark' | 'curiosity' | 'tension' | 'embrace';
export interface FeelingMarker { id: string; time: number; duration: number; feeling: Feeling }
export interface EmoSoundProject { id: string; audioName: string; duration: number; markers: FeelingMarker[] }
export interface Analysis { bands: [Float32Array, Float32Array, Float32Array]; frameDuration: number; gain: number }
export const FEELINGS: {id: Feeling; emoji: string; label: string}[] = [
  {id:'calm',emoji:'😌',label:"Ça m'apaise"},{id:'surprise',emoji:'😮',label:'Ça me surprend'},
  {id:'spark',emoji:'✨',label:'Ça pétille'},{id:'curiosity',emoji:'👀',label:"Ça m'intrigue"},
  {id:'tension',emoji:'😬',label:'Ça me tend'},{id:'embrace',emoji:'🤗',label:"Ça m'enveloppe"},
];
