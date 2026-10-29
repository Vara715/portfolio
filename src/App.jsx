import {useEffect,useRef,useState} from 'react'
import Terminal from './Terminal'
import Network from './Network'
import {Kad,Ledger,Shot,Arch,Trail} from './Viz'
import Ink from './Ink'
import {me,projects,also,education,skills,achievements} from './data'
const ach=achievements.filter(a=>import.meta.env.DEV||!a.d.startsWith('TODO'))

const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
const TOOLS=['Go','Rust','C/C++','Python','JavaScript','Node.js','React','Next.js','gRPC','Kademlia DHT','Redis','MongoDB','Docker','AWS EC2','Linux','System design','Distributed systems']
const TOD=(h=>h<5||h>=20?'night':h<8?'dawn':h<17?'day':'dusk')(new Date().getHours())
const initTheme=()=>{try{const t=localStorage.getItem('theme');if(t)return t}catch{}
  return TOD==='night'?'dark':'light'}
const initCalm=()=>{try{const c=localStorage.getItem('calm');if(c)return c==='on'}catch{}return matchMedia('(prefers-reduced-motion: reduce)').matches}
const getRoute=()=>location.hash.replace(/^#/,'')||'/'
const nav=p=>{location.hash='#'+p}

function Count({to,suf='',dec=0}){
  const r=useRef(),[v,setV]=useState(0)
  useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const t0=performance.now()
    const f=t=>{const k=Math.min(1,(t-t0)/1200);setV(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})
    io.observe(r.current);return()=>io.disconnect()},[to])
  return <span ref={r}>{v.toFixed(dec)}{suf}</span>
}
const Row=({p,i})=>(<a className="row rv" style={{'--d':i*90+'ms'}} href={`#/projects/${p.slug}`}><span className="n">0{i+1}</span><div><h3>{p.name}</h3><p>{p.line}</p></div><span className="st">{p.stack.slice(0,3).join(' / ')}</span></a>)
const Sec=({n,t,children})=>(<section className="rv"><p className="sec">{n}</p><h2>{t}</h2>{children}</section>)

function Project({p,i}){
  const next=projects[(i+1)%projects.length]
  return(<article className="pj"><aside className="side"><p className="crumb"><a href="#/projects">~/projects</a> / {p.slug}</p>
    <h4>Stack</h4><p className="stack">{p.stack.map(s=><code key={s}>{s}</code>)}</p>
    <p className="links col"><a href={p.demo}>Live demo</a><a href={p.repo}>Source code</a></p></aside>
    <div><div className="seal" aria-hidden="true">V<small>715</small></div><h1 className="h1s">{p.name}</h1><p className="lead">{p.line}</p>
      <Sec n="01 / Problem" t="What it solves"><p className="prose">{p.problem}</p></Sec>
      <Sec n="02 / Challenge" t="The hard part"><p className="prose">{p.hard}</p></Sec>
      <Sec n="03 / Build" t="How it works"><ul className="prose">{p.how.map(h=><li key={h}>{h}</li>)}</ul></Sec>
      {p.arch&&<Sec n="04 / Architecture" t="How the pieces connect"><Arch steps={p.arch}/></Sec>}
      <Shot slug={p.slug}/>
      {p.viz&&<Sec n="05 / Try it" t={p.viz==='kad'?'Watch a lookup':'Watch a transfer'}>{p.viz==='kad'?<Kad/>:<Ledger/>}</Sec>}
      <p className="links"><a href={`#/projects/${next.slug}`}>Next: {next.name}</a></p></div></article>)
}

export default function App(){
  const [theme,setTheme]=useState(initTheme),[g5,setG5]=useState(false),[route,setRoute]=useState(getRoute),ring=useRef(null),termNav=useRef(false),first=useRef(true),[calm,setCalm]=useState(initCalm)
  const toggleTheme=()=>setTheme(t=>t==='dark'?'light':'dark')
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.tod=TOD;try{localStorage.setItem('theme',theme)}catch{}},[theme])
  useEffect(()=>{
    let i=0
    const hc=()=>{setRoute(getRoute());scrollTo(0,0)}
    const kd=e=>{i=e.key===KONAMI[i]?i+1:(e.key===KONAMI[0]?1:0);if(i===KONAMI.length){setG5(v=>!v);i=0}}
    const mv=e=>{const r=ring.current;if(!r)return;r.style.opacity=e.target.closest('a,button,summary,input,label,.row')?1:0;r.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;r.classList.toggle('big',!!e.target.closest('a,button,summary,input'))}
    addEventListener('hashchange',hc);addEventListener('keydown',kd);addEventListener('mousemove',mv)
    return()=>{removeEventListener('hashchange',hc);removeEventListener('keydown',kd);removeEventListener('mousemove',mv)}
  },[])
  useEffect(()=>{
    let last=null
    const mv=e=>{if(document.documentElement.dataset.calm==='on')return;const t=e.target.closest?.('.links a,.go,.nav button,.avatar')
      if(last&&last!==t){last.style.transform='';last=null}
      if(!t)return
      const r=t.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5
      t.style.transform=t.matches('.avatar')?`perspective(600px) rotateY(${px*18}deg) rotateX(${-py*18}deg) rotate(3deg)`:`translate(${px*12}px,${py*12}px)`;last=t}
    addEventListener('mousemove',mv);return()=>removeEventListener('mousemove',mv)},[])
  useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12})
    document.querySelectorAll('.rv').forEach(n=>io.observe(n));return()=>io.disconnect()},[route])

  useEffect(()=>{document.documentElement.dataset.calm=calm?'on':'off';try{localStorage.setItem('calm',calm?'on':'off')}catch{}},[calm])
  useEffect(()=>{const n=projects.find(p=>p.slug===route.split('/')[2])?.name;document.title=route==='/'?'Varadraj | Systems Engineer':`${n||route.slice(1)} | Varadraj`
    if(first.current){first.current=false;return}
    if(termNav.current){termNav.current=false;setTimeout(()=>document.getElementById('ti')?.focus({preventScroll:true}),80);return}
    document.getElementById('main')?.focus({preventScroll:true})},[route])
  const tp={route,nav:p=>{termNav.current=true;nav(p)},toggleTheme,toggleCalm:()=>setCalm(c=>!c),party:()=>setG5(v=>!v)}
  const resume=me.links.find(l=>l.l.startsWith('Resume')).h
  const slug=route.split('/')[2],pi=projects.findIndex(p=>p.slug===slug)
  let page,home=route==='/'
  if(home)page=<>
    <section className="hero"><Network nav={nav}/><div className="wrap hg"><div className="ht"><p className="eyebrow">systems / backend / AI</p><h1>{me.name}</h1><p className="lead">{me.tagline}</p>
      <p className="links"><a href="#/projects">See my work</a><a href={resume}>Resume</a></p></div>
      <figure className="avatar"><img src={import.meta.env.BASE_URL+'avatar.png'} alt="Hand-drawn portrait of Varadraj"/></figure></div>
      <p className="hint">The dots are a tiny peer-to-peer network. Click a labelled node to route there.</p></section>
    <div className="marq" aria-hidden="true"><div>{[...TOOLS,...TOOLS].map((s,i)=><span key={i}>{s}</span>)}</div></div>
    <div className="wrap">
      <Sec n="01 / Terminal" t="Prefer a shell?"><Terminal {...tp}/></Sec>
      <Sec n="02 / Selected work" t="Things I've built">{projects.map((p,i)=><Row key={p.slug} p={p} i={i}/>)}</Sec>
      <Sec n="03 / By the numbers" t="From the projects"><div className="stats">
        <div><b><Count to={20}/></b><span>nodes in the P2P storage network</span></div><div><b><Count to={3} suf="x"/></b><span>replication for fault tolerance</span></div>
        <div><b><Count to={40} suf="+"/></b><span>behavioral features extracted</span></div><div><b><Count to={88.5} dec={1} suf="%"/></b><span>authentication accuracy</span></div></div></Sec>
      <Sec n="04 / Education" t={education.school}><p className="prose">{education.degree}, {education.cgpa}. {education.where}, {education.when}.</p><p className="links"><a href="#/about">More about me</a><a href="#/contact">Contact</a></p></Sec></div></>
  else if(route==='/projects')page=<div className="wrap"><section><h1 className="h1s">Projects</h1><p className="intro">Each project has its own page: the problem, the hard part and the architecture.</p>
    {projects.map((p,i)=><Row key={p.slug} p={p} i={i}/>)}
    <Sec n="Also built" t={also.name}><p className="prose">{also.line}</p><p className="stack">{also.stack.map(s=><code key={s}>{s}</code>)}</p></Sec></section></div>
  else if(pi>=0)page=<div className="wrap"><Project p={projects[pi]} i={pi}/></div>
  else if(route==='/about')page=<div className="wrap"><section><h1 className="h1s">About</h1>{me.about.map((t,i)=><p key={i} className="prose big">{t}</p>)}
    <Sec n="Path" t="The route so far"><Trail/></Sec>
    <Sec n="Education" t={education.school}><p className="prose">{education.degree}, {education.cgpa}. {education.where}, {education.when}.</p></Sec>
    {ach.length>0&&<Sec n="Achievements" t="Open source and beyond">{ach.map(a=><a key={a.t} className="row" href={a.h}><span className="n">+</span><div><h3>{a.t}</h3><p>{a.d}</p></div></a>)}</Sec>}
    <Sec n="Skills" t="What I work with"><div className="crew">{Object.entries(skills).map(([g,it])=><div key={g}><h3>{g}</h3><ul>{it.map(s=><li key={s}>{s}</li>)}</ul></div>)}</div></Sec></section></div>
  else if(route==='/contact')page=<div className="wrap"><section><h1 className="h1s">Let's talk</h1><p className="intro">Hiring, collaborating or just saying hi? Pick a link.</p><p className="links">{me.links.map(l=><a key={l.l} href={l.h}>{l.l}</a>)}</p></section></div>
  else page=<div className="wrap"><section><h1 className="h1s">Page not found</h1><p className="intro">Nothing lives at {route}.</p><p className="links"><a href="#/">Go home</a></p></section></div>
  const cur=s=>route.startsWith(s)?'page':undefined
  return(
    <div className={g5?'g5':''}>
      <a className="skip" href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus()}}>Skip to content</a>
      <div className="ring" ref={ring} aria-hidden="true"/>
      <Ink/>
      <header className="nav"><a href="#/" className="logo">{me.handle}</a>
        <nav aria-label="Pages">{['projects','about','contact'].map(s=><a key={s} href={`#/${s}`} aria-current={cur('/'+s)}>{s}</a>)}
          <button onClick={toggleTheme} aria-label={`Switch to ${theme==='dark'?'light':'dark'} mode`}>{theme==='dark'?'Light':'Dark'}</button></nav></header>
      <main id="main" tabIndex={-1} key={route} className="page">{page}</main>
      <footer className="wrap">Built with React and Vite. The palette follows your local time ({TOD}). Press ` for the terminal, or try the Konami code. <button className="calm" onClick={()=>setCalm(c=>!c)} aria-pressed={calm}>Calm mode: {calm?'on':'off'}</button></footer>
      {!home&&<Terminal {...tp} dock/>}
    </div>)
}
