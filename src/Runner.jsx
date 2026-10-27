import {useEffect,useRef,useState} from 'react'
const W=36,L=3,PX=3
export default function Runner({onEnd}){
  const g=useRef({lane:1,obs:[],t:0,score:0}),[f,setF]=useState('')
  const mv=d=>{g.current.lane=Math.max(0,Math.min(L-1,g.current.lane+d))}
  useEffect(()=>{
    const s=g.current
    const kd=e=>{const k=e.key.toLowerCase()
      if(k==='arrowup'||k==='w')mv(-1);else if(k==='arrowdown'||k==='s')mv(1)
      else if(k==='q'||k==='escape'){onEnd(s.score,true);return}else return
      e.preventDefault()}
    addEventListener('keydown',kd)
    const id=setInterval(()=>{
      s.t++;if(s.t%3===0)s.score++
      s.obs.forEach(o=>o.x--)
      if(s.t%7===0&&Math.random()<.85)s.obs.push({x:W-1,lane:Math.floor(Math.random()*L),coin:Math.random()<.4})
      const hit=s.obs.find(o=>o.x===PX&&o.lane===s.lane)
      if(hit){if(hit.coin){s.score+=10;hit.x=-1}else{onEnd(s.score,false);return}}
      s.obs=s.obs.filter(o=>o.x>=0)
      const rows=Array.from({length:L},()=>Array(W).fill('.'))
      s.obs.forEach(o=>{rows[o.lane][o.x]=o.coin?'$':'#'})
      rows[s.lane][PX]='>'
      setF(`score ${s.score}   up/down or w/s to move, q to quit\n`+rows.map(r=>r.join('')).join('\n'))
    },90)
    return()=>{clearInterval(id);removeEventListener('keydown',kd)}
  },[])
  return(<div><pre className="run" aria-label="Runner game">{f}</pre>
    <p className="rb"><button onClick={()=>mv(-1)} aria-label="Move up">Up</button><button onClick={()=>mv(1)} aria-label="Move down">Down</button></p></div>)
}
