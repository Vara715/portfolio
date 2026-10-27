// TODO items are placeholders: replace with your own details.
export const me={
  name:'Varadraj',handle:'Vara715',
  tagline:'Backend and systems engineer who also builds with AI. I like distributed storage, correct ledgers and software that keeps working when things fail.',
  links:[{l:'GitHub',h:'https://github.com/'},{l:'LinkedIn',h:'https://linkedin.com/'},{l:'Resume (PDF)',h:'resume.pdf'},{l:'Email',h:'mailto:you@example.com'}],
  about:['I work across a lot of ground: web development, hackathons, DSA and competitive programming, open source, and learning AI. I also contribute in Rust and work on compilers.','My strongest pull is toward backend and systems, with AI alongside. TODO: add a short personal story and one human detail (a hobby, a running joke).']
}
export const projects=[
{slug:'p2p',viz:'kad',arch:['Client request','gRPC API','Kademlia peer lookup','SHA-256 chunk store','3-way replication'],name:'Distributed Peer-to-Peer Storage Network',line:'Decentralized, content-addressed storage across 20 nodes.',stack:['Go','gRPC','React','Kademlia DHT','Protocol Buffers'],
 problem:'Store and retrieve content without a central server, and keep it available when nodes fail.',
 hard:'Deciding how lookups are routed and how the DHT stays healthy as peers join and drop. TODO: describe how you solved it.',
 how:['Kademlia DHT with O(log N) peer discovery','SHA-256 chunking for content-addressed retrieval','Merkle DAGs and 3-way replication','gRPC between nodes with self-healing heartbeat monitoring','Fault-tolerant storage across 20 scattered nodes'],demo:'#',repo:'#'},
{slug:'bank',viz:'ledger',arch:['Request with JWT','Idempotency check','Double-entry ledger','ACID commit','Immutable audit log'],name:'Bank Transaction System',line:'Double-entry ledger with ACID-compliant payments.',stack:['Node.js','Express','MongoDB','Mongoose','JWT'],
 problem:'Move money safely: no double spends, no lost updates, and a full audit trail.',
 hard:'Building a ledger that stays correct under failures and retries. TODO: describe your approach.',
 how:['Double-entry ledger with ACID-compliant transactions','Idempotent fund transfers that survive duplicate requests','Immutable audit logs','JWT authentication, token blacklisting and role-based authorization'],demo:'#',repo:'#'},
{slug:'github-bounty',arch:['GitHub API data','Scoring engine','SVG renderer','PNG and SVG export'],name:'GitHub Bounty',line:'Deployed web app that turns GitHub activity into a shareable visual profile.',stack:['Next.js','TypeScript','GitHub API','SVG'],
 problem:'Make a developer\'s GitHub work easy to read and share at a glance.',
 hard:'TODO: describe the scoring engine or the hardest part of the build.',
 how:['Backend scoring engine on real GitHub API data','SVG output with PNG and SVG download','Next.js and TypeScript frontend, deployed live'],demo:'#',repo:'#'}
]
export const also={name:'Behavioral Biometric Authentication System',line:'Mouse-dynamics authentication from 4 mini-games, 40+ features, Random Forest and SVM at 88.5% accuracy, with a Tkinter app.',stack:['Python','Scikit-learn','Pandas','Tkinter']}
export const education={school:'Vishwakarma Institute of Technology',where:'Pune, Maharashtra',degree:'B.Tech in Computer Engineering (Software Engineering)',cgpa:'CGPA 8.96/10',when:'Aug 2024 - May 2028'}
export const skills={
 'Languages':['C/C++','Go','Python','JavaScript','SQL','HTML/CSS'],
 'Core concepts':['DSA','System design','OOP','Operating systems','DBMS','COA','Distributed systems','Computer networks','Mainframe computing'],
 'Technologies':['Node.js','Express.js','REST APIs','React','Next.js','Redis','OAuth 2.0','Ngrok'],
 'DevOps and cloud':['AWS EC2','GitHub Actions','CI/CD','Vercel','Render','Docker','Linux (Arch, Ubuntu)','Git'],
 'Databases':['MongoDB','MySQL','Supabase'],
 'AI/ML':['Scikit-learn','Pandas','NumPy','Random Forest','SVM']}
export const achievements=[
 {t:'Open source: Rust',d:'TODO: repository and merged pull requests',h:'#'},
 {t:'Compilers',d:'TODO: what you built or contributed to',h:'#'},
 {t:'Competitive programming',d:'TODO: rating and profile link',h:'#'},
 {t:'Hackathons',d:'TODO: results and projects',h:'#'}]
