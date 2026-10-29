import {useEffect,useRef,useState} from 'react'
import Runner from './Runner'
import {me,projects,education} from './data'

const store={lines:[],open:true,best:0,hist:[]}
const PATHS=['','about','projects','contact',...projects.map(p=>'projects/'+p.slug)]
const LS={'':['about/','projects/','contact/'],about:['story.md','education.md','skills.md'],projects:projects.map(p=>p.slug+'/'),contact:['links.md']}
const SEC={about:'about',skills:'about',education:'about',projects:'projects',contact:'contact',home:''}
const HELP=['cd <page>      go to a page: cd about, cd projects/p2p, cd .., cd ~','ls, pwd       look around','cat <project>  summary of a project (p2p, bank, github-bounty)','open <project> open a live demo; open github, open linkedin','neofetch      about me at a glance','run           play the runner game','theme, sound, calm  switch theme, toggle sound, calm mode','tree, cat resume, ping, history, clear, help','Some commands are hidden. Try your luck.']

export default function Terminal({route,nav,toggleTheme,toggleCalm,party,dock}){
  const cwd=route.replace(/^\//,'')
  const [lines,setL]=useState(store.lines),[val,setVal]=useState(''),[open,setOpen]=useState(store.open),[play,setPlay]=useState(false)
  const snd=useRef(false),ac=useRef(null),body=useRef(null),inp=useRef(null),hi=useRef(store.hist.length)
  const out=(...t)=>setL(l=>(store.lines=[...l,...t]))
  const prompt=`${me.handle}@portfolio:~${cwd?'/'+cwd:''}$`

  useEffect(()=>{
    if(store.lines.length)return
    const boot=['booting vara-sh v1.0 ...',`welcome. this is ${me.name}'s portfolio.`,'type help, or use the nav. both work.']
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){out(...boot);return}
    const ids=boot.map((b,i)=>setTimeout(()=>out(b),400+i*650))
    return()=>ids.forEach(clearTimeout)
  },[])
  useEffect(()=>{body.current.scrollTop=body.current.scrollHeight},[lines,play])
  useEffect(()=>{
    const kd=e=>{if(e.key==='`'&&e.target.tagName!=='INPUT'){e.preventDefault();setOpen(o=>(store.open=!o));setTimeout(()=>inp.current?.focus(),50)}}
    addEventListener('keydown',kd);return()=>removeEventListener('keydown',kd)
  },[])

  const blip=()=>{if(!snd.current)return
    try{ac.current??=new (window.AudioContext||window.webkitAudioContext)()
      const o=ac.current.createOscillator(),g=ac.current.createGain();o.frequency.value=660;g.gain.value=.04
      o.connect(g);g.connect(ac.current.destination);o.start();o.stop(ac.current.currentTime+.07)}catch{}}
  const resolve=a=>{let p=/^[~/]/.test(a)?[]:cwd?cwd.split('/'):[]
    for(const s of a.replace(/^[~/]+/,'').split('/')){if(!s||s==='.')continue;s==='..'?p.pop():p.push(s)}
    return p.join('/')}
  const find=a=>projects.find(p=>p.slug===(a||cwd.split('/')[1]))

  const run=raw=>{
    const c=raw.trim();out(`${prompt} ${c}`);blip()
    if(!c)return
    store.hist.push(c);hi.current=store.hist.length
    const [cmd,...args]=c.split(/\s+/),k=cmd.toLowerCase(),a=args[0]
    if(k in SEC){nav('/'+SEC[k]);return out(`~/${SEC[k]}`)}
    switch(k){
      case 'help':return out(...HELP)
      case 'cd':{const t=a?resolve(a):'';if(PATHS.includes(t)){nav('/'+t);return out('~'+(t?'/'+t:''))}return out(`cd: no such directory: ${a}`)}
      case 'ls':return out(...(LS[cwd]||['README.md','stack.txt']))
      case 'pwd':return out('/home/vara715/portfolio'+(cwd?'/'+cwd:''))
      case 'cat':{const p=find(a);if(p)return out(p.name,p.line,'stack: '+p.stack.join(', '),'hardest part: '+p.hard)
        if(a==='education'||a==='education.md')return out(education.school,education.degree,`${education.cgpa}, ${education.when}`)
        if(a==='resume'||a==='resume.pdf'){open(me.links.find(x=>x.l.startsWith('Resume')).h,'_blank','noopener');return out('Opening resume.pdf...')}
        return out(`cat: ${a||''}: no such file`)}
      case 'open':{const p=find(a),l=me.links.find(x=>x.l.toLowerCase().startsWith((a||'').toLowerCase()))
        const u=p?p.demo:l?.h;if(u&&u!=='#'){open(u,'_blank','noopener');return out('Opening...')}return out('No link for that yet.')}
      case 'neofetch':return out(`${me.handle}@portfolio`,'-----------------','role    systems and backend engineer','focus   distributed systems, AI','langs   Go, C/C++, Python, JS, Rust','school  VIT Pune, B.Tech CE','shell   vara-sh 1.0')
      case 'whoami':return out(`${me.handle}: ${me.name}, systems engineer.`)
      case 'history':return out(...store.hist.map((h,i)=>`${i+1}  ${h}`))
      case 'tree':return out('portfolio','|-- about','|-- contact','`-- projects',...projects.map((p,i)=>'    '+(i===projects.length-1?'`-- ':'|-- ')+p.slug))
      case 'ping':return out('PING vara715 (static site): 64 bytes, time=0.4 ms','0% packet loss. Fast, because there is no server to wait for.')
      case 'ssh':return out('ssh: permission denied (publickey). Try hiring me instead: cd contact')
      case 'calm':toggleCalm();return out('Calm mode toggled.')
      case 'date':return out(new Date().toString())
      case 'echo':return out(args.join(' '))
      case 'theme':toggleTheme();return out('Theme switched.')
      case 'sound':snd.current=!snd.current;return out(`Sound ${snd.current?'on':'off'}.`)
      case 'run':case 'game':setPlay(true);return out('Dodge the # crates, grab the $ coins.')
      case 'gear5':case 'gear':party();return out('Gear 5 activated.')
      case 'clear':return setL(store.lines=[])
      case 'exit':nav('/');return out('Back home.')
      case 'sudo':return out(`${me.handle} is not in the sudoers file. This incident will be reported.`)
      case 'rm':return out('rm: permission denied. Nice try.')
      case 'vim':case 'vi':return out('You are now stuck in vim. Just kidding, type :q to leave.')
      case ':q':return out('Phew.')
      default:return out(`command not found: ${cmd}. Type help for the list.`)
    }
  }
  const onKey=e=>{
    if(e.key==='ArrowUp'&&store.hist.length){e.preventDefault();hi.current=Math.max(0,hi.current-1);setVal(store.hist[hi.current])}
    if(e.key==='ArrowDown'){e.preventDefault();hi.current=Math.min(store.hist.length,hi.current+1);setVal(store.hist[hi.current]||'')}
  }
  const end=(s,quit)=>{setPlay(false);if(s>store.best)store.best=s;out(quit?`Run ended. Score ${s}.`:`Game over. Score ${s}, best ${store.best}.`)}
  return(
    <div className={`term${dock?' dock':''}${dock&&!open?' closed':''}`} role="region" aria-label="Interactive terminal" onClick={()=>!play&&inp.current?.focus()}>
      <div className="bar" onClick={()=>dock&&setOpen(o=>(store.open=!o))}><i/><i/><i/><span>~{cwd?'/'+cwd:''}{dock?'   (press ` to toggle)':''}</span></div>
      <div className="tb" ref={body} aria-live="polite">
        {lines.map((l,i)=><p key={i} className={l.startsWith(me.handle+'@')?'cmd':''}>{l}</p>)}
        {play?<Runner onEnd={end}/>:
        <form onSubmit={e=>{e.preventDefault();run(val);setVal('')}}>
          <label htmlFor="ti" className="sr">Type a command</label><span>{prompt}</span>
          <input id="ti" ref={inp} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="off" spellCheck="false" placeholder="type help"/>
        </form>}
      </div>
    </div>)
}
