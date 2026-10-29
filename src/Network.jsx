import {useEffect,useRef} from 'react'
const T=[['projects','/projects'],['about','/about'],['contact','/contact'],['p2p','/projects/p2p'],['bank','/projects/bank'],['github-bounty','/projects/github-bounty']]
export default function Network({nav}){
  const cv=useRef()
  useEffect(()=>{
    const c=cv.current,x=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),rm=matchMedia('(prefers-reduced-motion: reduce)').matches
    let W,H,N=[],m={x:-999,y:-999},path=null,raf
    const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),col=n=>getComputedStyle(document.documentElement).getPropertyValue(n)
    let C;const setC=()=>{C={ink:col('--ink'),ac:col('--accent'),sea:col('--sea')}};setC();const mo=new MutationObserver(setC);mo.observe(document.documentElement,{attributes:true})
    const init=()=>{const r=c.getBoundingClientRect();W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)
      N=Array.from({length:W<640?16:30},(_,i)=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,t:T[i],adj:new Set()}))
      N.forEach((a,i)=>N.filter(b=>b!==a).sort((p,q)=>d(a,p)-d(a,q)).slice(0,3).forEach(b=>{a.adj.add(b);b.adj.add(a)}))}
    const route=to=>{const s=N[T.length],prev=new Map([[s,null]]),q=[s]
      while(q.length){const a=q.shift();if(a===to)break;a.adj.forEach(b=>{if(!prev.has(b)){prev.set(b,a);q.push(b)}})}
      const p=[];for(let a=to;a;a=prev.get(a))p.push(a);path={p:p.reverse(),t0:performance.now(),to:to.t[1]};if(p.length<2){nav(to.t[1]);path=null}}
    const hit=e=>{const r=c.getBoundingClientRect(),p={x:e.clientX-r.left,y:e.clientY-r.top};return N.find(a=>a.t&&d(a,p)<22)}
    const mm=e=>{const r=c.getBoundingClientRect();m={x:e.clientX-r.left,y:e.clientY-r.top};c.style.cursor=hit(e)?'pointer':'default'}
    const ck=e=>{const n=hit(e);if(n&&!path)route(n)}
    let vis=true;const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting});io.observe(c)
    const frame=now=>{
      if(!vis){raf=requestAnimationFrame(frame);return}
      x.clearRect(0,0,W,H);const {ink,ac,sea}=C
      N.forEach(a=>{if(rm||document.documentElement.dataset.calm==='on')return;a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1
        const dx=a.x-m.x,dy=a.y-m.y,r=Math.hypot(dx,dy);if(r>0&&r<110){a.x+=dx/r*(110-r)*.04;a.y+=dy/r*(110-r)*.04}})
      x.lineWidth=1;x.strokeStyle=ink;x.globalAlpha=.2
      N.forEach(a=>a.adj.forEach(b=>{x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}))
      N.forEach(a=>{if(d(a,m)<140){x.globalAlpha=.35;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(m.x,m.y);x.stroke()}})
      N.forEach((a,i)=>{x.globalAlpha=a.t?1:.5;x.fillStyle=a.t?ac:ink;x.beginPath();x.arc(a.x,a.y,a.t?5:2.5,0,7);x.fill()
        if(a.t){x.fillStyle=sea;x.font='13px JetBrains Mono, monospace';x.fillText('~/'+a.t[0],a.x+9,a.y+4)}
        if(i===T.length){x.strokeStyle=ac;x.lineWidth=2;x.beginPath();x.arc(a.x,a.y,9,0,7);x.stroke();x.lineWidth=1}})
      x.globalAlpha=1
      if(path){const L=path.p.length-1,k=Math.min(L,(now-path.t0)/380);x.strokeStyle=ac;x.lineWidth=3;x.beginPath();x.moveTo(path.p[0].x,path.p[0].y)
        for(let i=1;i<=Math.floor(k);i++)x.lineTo(path.p[i].x,path.p[i].y)
        const f=k%1,i=Math.floor(k);if(i<L)x.lineTo(path.p[i].x+(path.p[i+1].x-path.p[i].x)*f,path.p[i].y+(path.p[i+1].y-path.p[i].y)*f)
        x.stroke();if(k>=L){const to=path.to;path=null;nav(to)}}
      raf=requestAnimationFrame(frame)}
    init();raf=requestAnimationFrame(frame)
    c.addEventListener('mousemove',mm);c.addEventListener('mouseleave',()=>m={x:-999,y:-999});c.addEventListener('click',ck);addEventListener('resize',init)
    return()=>{mo.disconnect();io.disconnect();cancelAnimationFrame(raf);removeEventListener('resize',init)}
  },[])
  return <canvas ref={cv} className="net" aria-hidden="true"/>
}
