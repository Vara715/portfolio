import {useEffect,useMemo,useRef,useState} from 'react'
import {Chess} from 'chess.js'
import {chess as cfg} from './data'

const GL={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟\uFE0E'}
const show=s=>import.meta.env.DEV||!String(s).startsWith('TODO')

function Board({fen,sel,legal=[],last=[],onSq,flip}){
  const rows=useMemo(()=>new Chess(fen).board(),[fen]),cells=[]
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const R=flip?7-r:r,F=flip?7-f:f,p=rows[R][F],sq='abcdefgh'[F]+(8-R)
    cells.push(<button key={sq} className={`sq ${(R+F)%2?'d':'l'}${sel===sq?' sel':''}${last.includes(sq)?' last':''}`} onClick={()=>onSq&&onSq(sq)} aria-label={sq+(p?` ${p.color==='w'?'white':'black'} ${p.type}`:'')}>
      {p&&<span className={'pc '+p.color}>{GL[p.type]}</span>}{legal.includes(sq)&&<i className="dot"/>}</button>)}
  return <div className="board" role="group" aria-label="Chess board">{cells}</div>
}

function Play(){
  const [g]=useState(()=>new Chess()),[fen,setFen]=useState(g.fen()),[sel,setSel]=useState(null),[last,setLast]=useState([]),[lvl,setLvl]=useState(2),[busy,setBusy]=useState(false),[quip,setQuip]=useState('Cheru is thinking...'),w=useRef()
  useEffect(()=>{w.current=new Worker(new URL('./engine.worker.js',import.meta.url),{type:'module'});return()=>w.current.terminate()},[])
  const refresh=m=>{setFen(g.fen());setLast(m?[m.from,m.to]:[])}
  const legal=sel?g.moves({square:sel,verbose:true}).map(m=>m.to):[]
  const bot=()=>{
    if(g.isGameOver())return
    setBusy(true);setQuip(['Cheru is thinking...','Cheru is plotting something...','Hmm, says Cheru...'][Math.floor(Math.random()*3)])
    w.current.onmessage=e=>{setBusy(false);if(e.data)refresh(g.move(e.data))}
    w.current.postMessage({fen:g.fen(),depth:lvl})}
  const click=sq=>{
    if(busy||g.isGameOver()||g.turn()!=='w')return
    if(sel&&legal.includes(sq)){const m=g.move({from:sel,to:sq,promotion:'q'});setSel(null);refresh(m);bot();return}
    const p=g.get(sq);setSel(p&&p.color==='w'?sq:null)}
  const undo=()=>{if(busy||g.history().length<2)return;g.undo();g.undo();setSel(null);refresh(null)}
  const reset=()=>{if(busy)return;g.reset();setSel(null);refresh(null)}
  const text=busy?quip:g.isCheckmate()?(g.turn()==='b'?'Checkmate. You beat Cheru!':'Checkmate. Cheru takes this one.'):g.isDraw()?'A draw. Cheru shakes your hand.':g.inCheck()?'You are in check. Your move.':'Your move. You play white against Cheru.'
  return(<div className="chess-grid"><Board fen={fen} sel={sel} legal={legal} last={last} onSq={click}/>
    <div><p className="prose" aria-live="polite"><strong>{text}</strong></p>
      <p className="cap">Tap a piece, then a highlighted square. Pawns promote to queens.</p>
      <div className="row2">{[['Easy',1],['Medium',2],['Hard',3]].map(([n,d])=><button key={n} className={lvl===d?'go':''} aria-pressed={lvl===d} onClick={()=>setLvl(d)}>{n}</button>)}</div>
      <p className="row2"><button onClick={undo}>Undo</button><button onClick={reset}>New game</button></p></div></div>)
}

function Stats({u:U}){
  const u=U.toLowerCase()
  const [d,setD]=useState(null),[err,setErr]=useState(false)
  useEffect(()=>{(async()=>{try{
    const j=url=>fetch(url).then(r=>{if(!r.ok)throw 0;return r.json()})
    const st=await j(`https://api.chess.com/pub/player/${u}/stats`)
    const ar=(await j(`https://api.chess.com/pub/player/${u}/games/archives`)).archives
    let games=[]
    for(let i=ar.length-1;i>=Math.max(0,ar.length-2)&&games.length<5;i--)games=[...games,...(await j(ar[i])).games.reverse()]
    setD({st,games:games.slice(0,5)})}catch{setErr(true)}})()},[u])
  const prof=`https://www.chess.com/member/${u}`
  if(err)return <p className="prose">Live stats could not load right now. <a href={prof}>View my Chess.com profile</a>.</p>
  if(!d)return <p className="cap">Loading from Chess.com...</p>
  const tile=(t,o)=>o&&<div key={t}><b>{o.last.rating}</b><span>{t} rating</span><p className="cap">best {o.best?.rating??'n/a'} / {o.record.win}W {o.record.loss}L {o.record.draw}D</p></div>
  const draws=['agreed','repetition','stalemate','insufficient','50move','timevsinsufficient']
  return(<><div className="cs">{tile('Rapid',d.st.chess_rapid)}{tile('Blitz',d.st.chess_blitz)}</div>
    <h3 style={{marginTop:'2rem'}}>Recent games</h3>
    {d.games.map(g=>{const me=g.white.username.toLowerCase()===u.toLowerCase()?'white':'black',o=g[me==='white'?'black':'white'],r=g[me].result
      const res=r==='win'?'Win':draws.includes(r)?'Draw':'Loss'
      return <a key={g.url} className="cg" href={g.url}><b className={res==='Win'?'win':''}>{res}</b><span>vs {o.username} ({o.rating})</span><span className="cap">{g.time_class}</span></a>})}
    <p><a href={prof}>Full profile on Chess.com</a></p></>)
}

function Replay({game}){
  const [pg,setPg]=useState(game.pgn||''),[meta,setMeta]=useState(null),[err,setErr]=useState(false)
  useEffect(()=>{
    if(pg||!game.gameId)return
    ;(async()=>{try{
      const j=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.json()})
      const ar=(await j(`https://api.chess.com/pub/player/${cfg.user.toLowerCase()}/games/archives`)).archives
      for(let i=ar.length-1;i>=Math.max(0,ar.length-24);i--){
        const f=(await j(ar[i])).games.find(x=>x.url.endsWith(game.gameId))
        if(f){setPg(f.pgn);setMeta(f);return}}
      setErr(true)}catch{setErr(true)}})()},[])
  const mv=useMemo(()=>{const g=new Chess();try{g.loadPgn(pg)}catch{return[]}return g.history({verbose:true})},[pg])
  const [i,setI]=useState(0),[auto,setAuto]=useState(false)
  useEffect(()=>{if(!auto)return;const t=setInterval(()=>setI(x=>{if(x>=mv.length){setAuto(false);return x}return x+1}),900);return()=>clearInterval(t)},[auto,mv.length])
  if(!pg)return err?<p className="prose">The game could not load right now. <a href={game.link}>Open it on Chess.com</a>.</p>:<p className="cap">Loading the game from Chess.com...</p>
  const flip=!!meta&&meta.black.username.toLowerCase()===cfg.user.toLowerCase()
  const fen=i===0?(mv[0]?.before||new Chess().fen()):mv[i-1].after
  const title=meta?`${meta.white.username} vs ${meta.black.username}`:game.title
  return(<div className="chess-grid"><Board fen={fen} flip={flip} last={i?[mv[i-1].from,mv[i-1].to]:[]}/>
    <div><p className="prose"><strong>{title}</strong>{show(game.why)&&<><br/>{game.why}</>}<br/><a href={game.link}>View on Chess.com</a></p>
      <p className="row2"><button onClick={()=>setI(0)}>Start</button><button onClick={()=>setI(x=>Math.max(0,x-1))}>Back</button><button className="go" onClick={()=>{if(i>=mv.length)setI(0);setAuto(a=>!a)}}>{auto?'Pause':'Play'}</button><button onClick={()=>setI(x=>Math.min(mv.length,x+1))}>Next</button><button onClick={()=>setI(mv.length)}>End</button></p>
      <ol className="moves">{mv.map((m,k)=><li key={k}><button className={k+1===i?'cur':''} onClick={()=>setI(k+1)}>{k%2===0?`${k/2+1}. `:''}{m.san}</button></li>)}</ol></div></div>)
}

export default function ChessPage(){
  return(<section><h1 className="h1s">Chess</h1>
    <p className="intro">I play on Chess.com. Play Cheru, my chess bot, check my live stats, or replay one of my games. Cheru's engine is written from scratch in JavaScript (minimax with alpha-beta pruning); move rules come from chess.js.</p>
    <section className="rv"><p className="sec">01 / Play</p><h2>Play Cheru</h2><Play/></section>
    {show(cfg.user)&&<section className="rv"><p className="sec">02 / Live</p><h2>My Chess.com stats</h2><Stats u={cfg.user}/></section>}
    {show(cfg.best.title)&&<section className="rv"><p className="sec">03 / Replay</p><h2>A game I like</h2><Replay game={cfg.best}/></section>}
  </section>)
}