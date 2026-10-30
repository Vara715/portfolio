import {useEffect,useRef} from 'react'
const G=Array.from({length:93},(_,i)=>String.fromCharCode(33+i)) // printable ASCII 33-125, like the real cmatrix default
const BG='27,19,12',HEAD='#fff3d6',TAIL='#e8a91c' // warm palette; use '#9bffb0' and '#1fa84a' for classic green
const S=14
// Renders inside the terminal body (fills it), not over the page.
export default function Matrix({onExit}){
  const box=useRef(),cv=useRef()
  useEffect(()=>{
    const c=cv.current,x=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1)
    let W=0,H=0,drops=[],raf
    const pick=()=>G[Math.floor(Math.random()*G.length)]
    const init=()=>{
      const r=box.current.getBoundingClientRect()
      if(!r.width||!r.height){W=0;return}
      W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)
      x.fillStyle=`rgb(${BG})`;x.fillRect(0,0,W,H)
      drops=Array.from({length:Math.ceil(W/S)},()=>({y:Math.random()*-30,v:.2+Math.random()*.4,r:-999,g:'0'}))}
    const frame=()=>{
      if(!W)init()
      else{
        x.fillStyle=`rgba(${BG},.08)`;x.fillRect(0,0,W,H);x.font=`${S}px JetBrains Mono, monospace`
        drops.forEach((d,i)=>{
          d.y+=d.v;const r=Math.floor(d.y)
          if(r!==d.r&&r>=0){
            x.fillStyle=TAIL;x.fillText(d.g,i*S,r*S-S)
            d.g=pick();x.fillStyle=HEAD;x.fillText(d.g,i*S,r*S)}
          d.r=r
          if(r*S>H&&Math.random()>.96){d.y=Math.random()*-15;d.r=-999}})}
      raf=requestAnimationFrame(frame)}
    const kd=e=>{const k=e.key.toLowerCase()
      if((e.ctrlKey&&k==='c')||k==='q'||k==='escape'){e.preventDefault();onExit()}}
    const ro=new ResizeObserver(init);ro.observe(box.current)
    init();frame();addEventListener('keydown',kd,true)
    return()=>{cancelAnimationFrame(raf);ro.disconnect();removeEventListener('keydown',kd,true)}
  },[])
  return(
    <div ref={box} role="img" aria-label="Digital rain animation. Press Control plus C to exit." style={{position:'relative',margin:'-.8rem -1rem',height:'calc(100% + 1.6rem)',background:`rgb(${BG})`}}>
      <canvas ref={cv} style={{width:'100%',height:'100%',display:'block'}}/>
      <span style={{position:'absolute',left:10,bottom:6,font:'12px JetBrains Mono, monospace',color:'#b9a77f'}}>Ctrl+C to exit</span>
      <button onClick={onExit} aria-label="Exit digital rain" style={{position:'absolute',right:8,top:8,fontSize:'.75rem',padding:'.1rem .6rem',color:'#ecdfc3',borderColor:'#ecdfc3'}}>Exit</button>
    </div>)
}