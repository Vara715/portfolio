import {useEffect,useRef} from 'react'
export default function Ink(){
  const cv=useRef()
  useEffect(()=>{
    if(matchMedia('(pointer: coarse)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const c=cv.current,x=c.getContext('2d');let P=[],raf=0
    const size=()=>{c.width=innerWidth;c.height=innerHeight}
    const add=(px,py,r,v)=>{P.push({x:px,y:py,r,vx:(Math.random()-.5)*v,vy:(Math.random()-.5)*v,t:performance.now()});if(!raf)raf=requestAnimationFrame(draw)}
    const draw=now=>{x.clearRect(0,0,c.width,c.height);const col=getComputedStyle(document.documentElement).getPropertyValue('--accent')
      P=P.filter(p=>now-p.t<700)
      P.forEach(p=>{const k=1-(now-p.t)/700;p.x+=p.vx;p.y+=p.vy;x.globalAlpha=k*.55;x.fillStyle=col;x.beginPath();x.arc(p.x,p.y,p.r*k,0,7);x.fill()})
      raf=P.length?requestAnimationFrame(draw):0}
    const mv=e=>add(e.clientX,e.clientY,4+Math.random()*4,0)
    const ck=e=>{for(let i=0;i<16;i++)add(e.clientX,e.clientY,4+Math.random()*9,5)}
    size();addEventListener('resize',size);addEventListener('mousemove',mv);addEventListener('click',ck)
    return()=>{removeEventListener('resize',size);removeEventListener('mousemove',mv);removeEventListener('click',ck);cancelAnimationFrame(raf)}
  },[])
  return <canvas ref={cv} className="ink" aria-hidden="true"/>
}
