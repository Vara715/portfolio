import {useEffect,useRef,useState} from 'react'
const bin=n=>n.toString(2).padStart(4,'0')
export function Shot({slug}){
  const [ok,setOk]=useState(true)
  if(!ok)return import.meta.env.DEV?<figure className="shot"><div>Add a screenshot at public/shots/{slug}.png</div></figure>:null
  return <figure className="shot"><img src={`${import.meta.env.BASE_URL}shots/${slug}.png`} alt={`Screenshot of ${slug}`} onError={()=>setOk(false)}/></figure>
}
export function Kad(){
  const [key,setKey]=useState(13),[path,setPath]=useState([0]),[busy,setBusy]=useState(false)
  const P=i=>{const a=i/16*Math.PI*2-Math.PI/2;return[150+115*Math.cos(a),150+115*Math.sin(a)]}
  const run=()=>{
    if(busy)return;let cur=0;const p=[0];setPath([0]);setBusy(true)
    const step=()=>{if(cur===key){setBusy(false);return}
      cur=[0,1,2,3].map(b=>cur^(1<<b)).reduce((a,b)=>((a^key)<=(b^key)?a:b));p.push(cur);setPath([...p]);setTimeout(step,700)}
    setTimeout(step,400)}
  const last=path[path.length-1]
  return(<div className="viz"><svg viewBox="0 0 300 300" role="img" aria-label="Lookup across a ring of 16 nodes">
    {path.slice(1).map((n,i)=>{const[a,b]=P(path[i]),[c,d]=P(n);return<line key={i} x1={a} y1={b} x2={c} y2={d} style={{stroke:'var(--accent)',strokeWidth:3}}/>})}
    {Array.from({length:16},(_,i)=>{const[x,y]=P(i);return<g key={i}><circle cx={x} cy={y} r={i===key?9:6} style={{fill:path.includes(i)?'var(--accent)':'var(--paper)',stroke:i===key?'var(--sea)':'var(--ink)',strokeWidth:i===key?3:1.5}}/>
      <text x={x} y={y-13} textAnchor="middle" style={{fontSize:8,fill:'var(--mute)',fontFamily:'JetBrains Mono'}}>{bin(i)}</text></g>})}</svg>
    <div><p className="prose">Each node knows one peer per bit of the ID. Every hop moves to the known peer with the smallest XOR distance to the key, which fixes one more bit, so a lookup takes at most log2(N) hops. This is a simplified 16-node model.</p>
      <label className="cap">target key {bin(key)}<input type="range" min="1" max="15" value={key} disabled={busy} onChange={e=>{setKey(+e.target.value);setPath([0])}}/></label>
      <p><button className="go" onClick={run} disabled={busy}>Run lookup from 0000</button></p>
      <p className="cap">hops: {path.length-1} / XOR distance left: {bin(last^key)}</p></div></div>)
}
export function Ledger(){
  const [bal,setBal]=useState({A:100,B:50}),[log,setLog]=useState([]),[k,setK]=useState(1),[seen,setSeen]=useState([]),[msg,setMsg]=useState('Send money, then retry the same request.')
  const send=key=>{
    if(seen.includes(key))return setMsg(`Request #${key} was already applied, so the retry is ignored. Nothing is charged twice.`)
    if(bal.A<20)return setMsg('Insufficient funds: the transaction is rejected and nothing changes.')
    setBal({A:bal.A-20,B:bal.B+20});setSeen([...seen,key]);setLog([`#${key}  debit A 20 / credit B 20`,...log].slice(0,5));setMsg(`Request #${key} applied atomically.`)}
  const reset=()=>{setBal({A:100,B:50});setLog([]);setK(1);setSeen([]);setMsg('Reset.')}
  return(<div className="viz"><div className="accts"><div className="acct"><h4>Account A</h4><b>{bal.A}</b></div><div className="acct"><h4>Account B</h4><b>{bal.B}</b></div></div>
    <div><p className="prose">Each transfer writes a matching debit and credit, so the total never changes. A request ID makes retries idempotent.</p>
      <p className="row2"><button className="go" onClick={()=>{send(k);setK(k+1)}}>Send 20 (new request)</button><button onClick={()=>k>1&&send(k-1)}>Retry last request</button><button onClick={reset}>Reset</button></p>
      <p className="cap">{msg} Total: {bal.A+bal.B}</p><ul className="cap">{log.map(l=><li key={l}>{l}</li>)}</ul></div></div>)
}

export function Arch({steps}){
  const H=84,n=steps.length
  return(<div className="arch"><svg viewBox={`0 0 320 ${n*H-28}`} role="img" aria-label={'Architecture: '+steps.join(', then ')}>
    {steps.map((s,i)=><g key={s}><rect className="d" pathLength="1" x="10" y={i*H} width="300" height="56" rx="10" style={{'--dl':i*0.35+'s'}}/>
      <text className="t" x="160" y={i*H+33} textAnchor="middle" style={{'--dl':i*0.35+.4+'s'}}>{s}</text>
      {i<n-1&&<path className="d" pathLength="1" d={`M160 ${i*H+56} V${(i+1)*H-8} m-6 -8 l6 8 l6 -8`} style={{'--dl':i*0.35+.3+'s'}}/>}</g>)}</svg></div>)
}
const MS=[['Aug 2024','Started B.Tech in Computer Engineering at VIT Pune'],['DSA and competitive programming','Problem solving as the foundation'],['Hackathons','Shipping under a deadline'],['Open source, Rust and compilers','Reading and contributing to real codebases'],['Systems projects','A P2P storage network and a double-entry bank ledger'],['Deployed work and AI','GitHub Bounty, plus ML-based biometric authentication']]
export function Trail(){
  const r=useRef(),[p,setP]=useState(0)
  useEffect(()=>{let q=0
    const f=()=>{cancelAnimationFrame(q);q=requestAnimationFrame(()=>{const b=r.current.getBoundingClientRect();setP(Math.max(0,Math.min(1,(innerHeight*.65-b.top)/b.height)))})}
    f();addEventListener('scroll',f,{passive:true});addEventListener('resize',f)
    return()=>{removeEventListener('scroll',f);removeEventListener('resize',f);cancelAnimationFrame(q)}},[])
  return(<ol className="trail" ref={r} style={{'--p':p}}>{MS.map(([t,d],i)=><li key={t} className={p*MS.length>i+.3?'on':''}><h3>{t}</h3><p>{d}</p></li>)}</ol>)
}
