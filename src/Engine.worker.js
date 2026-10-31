import {Chess} from 'chess.js'
// Minimax with alpha-beta pruning, material evaluation and capture-first move ordering.
const V={p:100,n:320,b:330,r:500,q:900,k:0}
const ev=g=>{let s=0;for(const row of g.board())for(const p of row)if(p)s+=(p.color==='w'?1:-1)*V[p.type];return s}
const search=(g,d,a,b)=>{
  if(g.isCheckmate())return g.turn()==='w'?-1e5-d:1e5+d
  if(g.isDraw())return 0
  if(d===0)return ev(g)
  const max=g.turn()==='w'
  let best=max?-Infinity:Infinity
  const ms=g.moves({verbose:true}).sort((x,y)=>(y.captured?1:0)-(x.captured?1:0))
  for(const m of ms){
    g.move(m);const v=search(g,d-1,a,b);g.undo()
    if(max){best=Math.max(best,v);a=Math.max(a,v)}else{best=Math.min(best,v);b=Math.min(b,v)}
    if(b<=a)break}
  return best}
onmessage=e=>{
  const {fen,depth}=e.data,g=new Chess(fen),max=g.turn()==='w'
  let pick=null,bv=max?-Infinity:Infinity
  const ms=g.moves({verbose:true}).sort(()=>Math.random()-.5)
  for(const m of ms){
    g.move(m);const v=search(g,depth-1,-Infinity,Infinity)+Math.random()*(depth===1?120:8);g.undo()
    if(max?v>bv:v<bv){bv=v;pick=m}}
  postMessage(pick?{from:pick.from,to:pick.to,promotion:pick.promotion}:null)}