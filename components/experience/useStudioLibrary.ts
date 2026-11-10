'use client';
import {useEffect,useState,useCallback} from 'react';
import {defaultStudioAssets,readStudioAssets,STUDIO_ASSETS_EVENT,STUDIO_ASSETS_KEY} from '../../lib/studio-assets';
export function useStudioLibrary(){
 const [library,setLibrary]=useState(defaultStudioAssets),[error,setError]=useState('');
 const refresh=useCallback(()=>{try{setLibrary(readStudioAssets());setError('')}catch(e){setError((e as Error).message)}},[]);
 useEffect(()=>{const frame=requestAnimationFrame(refresh);const storage=(event:StorageEvent)=>{if(event.key===STUDIO_ASSETS_KEY||event.key===null)refresh();};window.addEventListener('storage',storage);window.addEventListener('focus',refresh);window.addEventListener(STUDIO_ASSETS_EVENT,refresh);return()=>{cancelAnimationFrame(frame);window.removeEventListener('storage',storage);window.removeEventListener('focus',refresh);window.removeEventListener(STUDIO_ASSETS_EVENT,refresh)}},[refresh]);
 return {library,error,refresh};
}
