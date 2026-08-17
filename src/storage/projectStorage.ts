import type { EmoSoundProject } from '../types/emosound';
const KEY='emosound-project';
export const saveProject=(project:EmoSoundProject)=>localStorage.setItem(KEY,JSON.stringify(project));
export const loadProject=():EmoSoundProject|null=>{try{return JSON.parse(localStorage.getItem(KEY)??'null')}catch{return null}};
