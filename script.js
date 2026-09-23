const pages=[...document.querySelectorAll('.page')];
const dots=document.getElementById('dots');
const progress=document.getElementById('progressBar');
let current=0;

pages.forEach((_,i)=>{
  const d=document.createElement('span');
  d.className='dot-page'+(i===0?' active':'');
  dots.appendChild(d);
  d.addEventListener('click',()=>go(i));
});

function go(index){
  current=Math.max(0,Math.min(pages.length-1,index));
  pages.forEach((p,i)=>p.classList.toggle('active',i===current));
  document.querySelectorAll('.dot-page').forEach((d,i)=>d.classList.toggle('active',i===current));
  progress.style.width=((current+1)/pages.length*100)+'%';
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>go(current+1)));
document.getElementById('prev').addEventListener('click',()=>go(current-1));
document.getElementById('nextNav').addEventListener('click',()=>go(current+1));
document.getElementById('restart').addEventListener('click',()=>go(0));

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='Enter') go(current+1);
  if(e.key==='ArrowLeft') go(current-1);
});

// Floating hearts
const hearts=document.getElementById('hearts');
function spawnHeart(){
  const h=document.createElement('span');
  h.className='heart';
  h.textContent=['♥','♡','❤','✦'][Math.floor(Math.random()*4)];
  h.style.left=(Math.random()*100)+'vw';
  h.style.fontSize=(10+Math.random()*18)+'px';
  h.style.animationDuration=(5+Math.random()*5)+'s';
  h.style.animationDelay=(Math.random()*1.5)+'s';
  hearts.appendChild(h);
  setTimeout(()=>h.remove(),11000);
}
setInterval(spawnHeart,700);
for(let i=0;i<7;i++) setTimeout(spawnHeart,i*300);

// Tiny ambient synth tone; no external audio file required.
let audioCtx=null, musicOn=false, timer=null;
const musicBtn=document.getElementById('musicBtn');
function startAmbient(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  const now=audioCtx.currentTime;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.type='sine'; osc.frequency.value=196;
  gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime(.018,now+.7); gain.gain.exponentialRampToValueAtTime(.001,now+4);
  osc.connect(gain).connect(audioCtx.destination); osc.start(now); osc.stop(now+4.1);
  timer=setTimeout(startAmbient,4500);
}
musicBtn.addEventListener('click',()=>{
  musicOn=!musicOn;
  musicBtn.textContent=musicOn?'♫':'♪';
  if(musicOn){startAmbient()}else{clearTimeout(timer)}
});

// Puzzle
const target='RAHANVI';
const letters=document.getElementById('puzzleLetters');
const answer=document.getElementById('answer');
const status=document.getElementById('puzzleStatus');
let typed='';
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function buildPuzzle(){
  letters.innerHTML='';
  typed='';
  answer.textContent='_ _ _ _ _ _ _';
  status.innerHTML='Start with <b>R</b> ✨';
  shuffle([...target]).forEach((ch)=>{
    const b=document.createElement('button');
    b.className='letter';
    b.textContent=ch;
    b.addEventListener('click',()=>{
      const expected=target[typed.length];
      if(ch===expected){
        typed+=ch; b.classList.add('correct','used');
        answer.textContent=typed.split('').join(' ') + (typed.length<target.length?'  _'.repeat(target.length-typed.length):'');
        if(typed.length===target.length){
          status.innerHTML='<b>Perfect! #RAHANVI 💜</b> — just like our story, one little step at a time.';
          burst();
        }else{
          status.innerHTML='Nice… next letter is <b>'+target[typed.length]+'</b> ✨';
        }
      }else{
        status.innerHTML='Hehe 😄 not that one. Try <b>'+expected+'</b>.';
        b.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:220});
      }
    });
    letters.appendChild(b);
  });
}
document.getElementById('resetPuzzle').addEventListener('click',buildPuzzle);
buildPuzzle();

function burst(){
  for(let i=0;i<22;i++) setTimeout(spawnHeart,i*55);
}
