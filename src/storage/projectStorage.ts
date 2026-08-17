import type { AudioMoodProject } from '../types/audiomood';
const KEY='audiomood-project-v1';
export const saveProject=(project:AudioMoodProject)=>localStorage.setItem(KEY,JSON.stringify(project));
export const loadProject=():AudioMoodProject|null=>{try{return JSON.parse(localStorage.getItem(KEY)??'null')}catch{return null}};
export const exportProject=(project:AudioMoodProject)=>{const blob=new Blob([JSON.stringify({...project,format:'AudioMood/1'},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${project.audioName.replace(/\.[^.]+$/,'')}.audiomood`;a.click();URL.revokeObjectURL(a.href)};
