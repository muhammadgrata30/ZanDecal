interface ZoomControl { enableZoom:boolean; enabled:boolean }
type StudioWheelEvent=WheelEvent&{lenisStopPropagation?:boolean};

/** Gate OrbitControls' wheel handler without interrupting page-scroll bubbling. */
export function bindStudioWheel(element:HTMLElement,controls:ZoomControl){
  const originalZoom=controls.enableZoom;
  const originalTouchAction=element.style.touchAction;
  let restoreTimer:ReturnType<typeof setTimeout>|undefined;
  element.style.touchAction="pan-y";
  const restoreZoom=()=>{controls.enableZoom=originalZoom;};
  const wheel=(event:StudioWheelEvent)=>{
    const zoom=controls.enabled&&(event.ctrlKey||event.metaKey);
    controls.enableZoom=zoom;
    // Lenis already ignores Ctrl, but Meta must also remain a camera gesture.
    if(zoom)event.lenisStopPropagation=true;
    // OrbitControls runs next on this target. Restore pinch support afterward.
    // Use a task, not a microtask: browsers may run microtasks between listeners.
    clearTimeout(restoreTimer);
    restoreTimer=setTimeout(restoreZoom,0);
  };
  element.addEventListener("wheel",wheel,{capture:true,passive:true});
  element.addEventListener("pointerdown",restoreZoom,{capture:true,passive:true});
  return()=>{
    clearTimeout(restoreTimer);
    element.removeEventListener("wheel",wheel,true);
    element.removeEventListener("pointerdown",restoreZoom,true);
    controls.enableZoom=originalZoom;
    element.style.touchAction=originalTouchAction;
  };
}
