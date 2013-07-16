var c=document.getElementById("c"),ctx=c.getContext("2d");
var W=320,H=480;
function rand(a,b){return a+Math.random()*(b-a)}
function clamp(v,mn,mx){return v<mn?mn:v>mx?mx:v}
function lerp(a,b,t){return a+(b-a)*t}
var CFG={W:320,H:480,gravity:0.25,flap:-5.5,pipeW:40,pipeGap:120,pipeSpeed:2,groundH:80,birdR:12,birdX:60};
var S={MENU:0,PLAYING:1,GAMEOVER:2};
var state=S.MENU,score=0,highScore=0;
try{highScore=parseInt(localStorage.getItem("skyhop_high"))||0}catch(e){}
var birdX=CFG.birdX,birdY=240,birdVy=0,birdR=CFG.birdR,birdRot=0;
var gravity=CFG.gravity,flap=CFG.flap;
var groundY=H-CFG.groundH;
var pipeW=CFG.pipeW,pipeGap=CFG.pipeGap,pipeSpeed=CFG.pipeSpeed;
var pipes=[];
var particles=[];
var scorePop=0,displayScore=0,goAlpha=0,restartDelay=0,menuBlink=0;
var shakeTimer=0,shakeIntensity=0,flashAlpha=0,slowMo=1;
var flapEase=0,frameCount=0,lastTime=Date.now();
var muted=false;
try{var savedMute=localStorage.getItem("skyhop_mute");if(savedMute)muted=savedMute==="true"}catch(e){}
var actx=null;
var scale=1;
var cloudOffset=0,starPhase=0,groundX=0;
var D={EASY:0,NORMAL:1,HARD:2,INSANE:3};
var difficulty=D.NORMAL;
var diffPresets=[{pipeGap:140,pipeSpeed:1.5,gravity:0.22,flap:-4.8},{pipeGap:120,pipeSpeed:2,gravity:0.25,flap:-5.5},{pipeGap:100,pipeSpeed:2.5,gravity:0.28,flap:-5.8},{pipeGap:85,pipeSpeed:3,gravity:0.32,flap:-6.2}];
var skyGrad=null;
function cacheSkyGradient(){var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1a1a2e");g.addColorStop(1,"#0f3460");skyGrad=g}
var PIPE_BODY="#73b543",PIPE_CAP="#5a9136";
var skin={body:"#f5c842",wing:"#e8a000",beak:"#ff6b35",eye:"#000"};
var skins={yellow:{body:"#f5c842",wing:"#e8a000",beak:"#ff6b35",eye:"#000"},red:{body:"#e74c3c",wing:"#c0392b",beak:"#f39c12",eye:"#000"},blue:{body:"#3498db",wing:"#2980b9",beak:"#f1c40f",eye:"#000"},gold:{body:"#f1c40f",wing:"#d4a017",beak:"#e67e22",eye:"#000"},raven:{body:"#2c3e50",wing:"#1a252f",beak:"#7f8c8d",eye:"#e74c3c"}};
var skinName="yellow";
try{var savedSkin=localStorage.getItem("skyhop_skin");if(savedSkin&&skins[savedSkin]){setSkin(savedSkin)}}catch(e){}
var skinUnlocks={blue:5,gold:15,raven:30};
var themes={default:{sky1:"#1a1a2e",sky2:"#0f3460",pipe:"#73b543",pipeCap:"#5a9136",ground1:"#4a3728",ground2:"#5c4433"},sunset:{sky1:"#2d1b3d",sky2:"#e74c3c",pipe:"#c0392b",pipeCap:"#a93226",ground1:"#4a3728",ground2:"#5c4433"},midnight:{sky1:"#0a0a0f",sky2:"#1a1a2e",pipe:"#2c3e50",pipeCap:"#1a252f",ground1:"#111",ground2:"#222"},arctic:{sky1:"#3498db",sky2:"#ecf0f1",pipe:"#7f8c8d",pipeCap:"#95a5a6",ground1:"#ecf0f1",ground2:"#bdc3c6"},swamp:{sky1:"#1e3a1e",sky2:"#2d5a2d",pipe:"#4a7a4a",pipeCap:"#3a6a3a",ground1:"#2d1f0e",ground2:"#3d2f1e"}};
var themeName="default";
var powerups=[],powerupTimer=0,hasShield=false,scoreMult=1;
var powerupTimers={slowmo:0,shield:0,magnet:0};
var comboTexts=[];
var lb=[];
try{lb=JSON.parse(localStorage.getItem("skyhop_lb"))||[]}catch(e){}
var newHighScore=false;
var bgCache=null;
var frameTime=0,touchTimer=null;
var landscapeWarn=false;
var stats={games:0,bestCombo:0,totalScore:0};
try{var s=JSON.parse(localStorage.getItem("skyhop_stats"));if(s){stats=s}}catch(e){}
var fps=0,fpsCount=0,fpsTime=0;
var achievements=[];
var ACHIEVEMENTS={firstFlap:{name:"First Flap",desc:"Play your first game",icon:"★"},score10:{name:"Double Digits",desc:"Score 10 points",icon:"★★"},score50:{name:"Half Century",desc:"Score 50 points",icon:"★★★"},score100:{name:"Centurion",desc:"Score 100 points",icon:"★★★★"},death100:{name:"Persistent",desc:"Die 100 times",icon:"★"}};
try{var a=JSON.parse(localStorage.getItem("skyhop_ach"));if(a){achievements=a}}catch(e){}
var notifications=[];
var konami=[38,38,40,40,37,39,37,39,66,65];var konamiIdx=0;var konamiActive=false;
var toasts=[];

function drawSky(){if(!skyGrad)cacheSkyGradient();ctx.fillStyle=skyGrad;ctx.fillRect(0,0,W,H)}
function drawStars(){for(var i=0;i<30;i++){var sx=(i*37+13)%W,sy=(i*53+7)%(groundY*0.6);var bright=0.3+0.7*Math.sin(starPhase+i*2);ctx.globalAlpha=bright;ctx.fillStyle="rgba(255,255,255,0.5)";ctx.fillRect(sx,sy,2,2)}ctx.globalAlpha=1}
function updateStars(){starPhase+=0.02}
function drawClouds(){ctx.fillStyle="rgba(255,255,255,0.03)";for(var i=0;i<3;i++){var cx=(i*120+cloudOffset)%(W+100)-50;ctx.beginPath();ctx.ellipse(cx,50+i*40,40,10,0,0,Math.PI*2);ctx.fill()}}
function updateClouds(){cloudOffset-=0.2}
function drawGround(){ctx.fillStyle="#4a3728";ctx.fillRect(0,groundY,W,CFG.groundH);ctx.fillStyle="#5c4433";for(var x=groundX;x<W;x+=24){ctx.fillRect(x,groundY,24,5);ctx.fillRect(x+12,groundY+8,12,5);ctx.fillRect(x,groundY+16,24,5)}}
function updateGround(){groundX-=pipeSpeed;if(groundX<=-24)groundX+=24}
function drawFog(){var g=ctx.createRadialGradient(W/2,H*0.3,0,W/2,H*0.3,200);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,0.3)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
function spawnPipe(){pipes.push({x:W+50,gapY:rand(140,300),scored:false})}
function updatePipes(){for(var i=pipes.length-1;i>=0;i--){var p=pipes[i];p.x-=getPipeSpeed();if(!p.scored&&p.x+pipeW<birdX){p.scored=true;addScore()}if(p.x+pipeW<0)pipes.splice(i,1)}}
function drawPipes(){for(var i=0;i<pipes.length;i++){var p=pipes[i];ctx.fillStyle=PIPE_BODY;ctx.fillRect(p.x,0,pipeW,p.gapY-pipeGap/2);ctx.fillRect(p.x,p.gapY+pipeGap/2,pipeW,H-groundY-p.gapY-pipeGap/2);ctx.fillStyle=PIPE_CAP;ctx.fillRect(p.x-4,p.gapY-pipeGap/2-15,pipeW+8,15);ctx.fillRect(p.x-4,p.gapY+pipeGap/2,pipeW+8,15)}}
function updateBird(){flapEase*=.9;birdVy+=gravity*lerp(1,0.7,1-flapEase);birdVy=clamp(birdVy,-20,12);birdY+=birdVy;birdY=clamp(birdY,birdR,groundY-birdR);if(state==S.GAMEOVER){birdRot+=0.1}else if(birdVy>0){birdRot=Math.min(birdRot+0.03,0.5)}else{birdRot=Math.max(birdRot-0.02,-0.5)}}
function birdFlap(){birdVy=flap;birdRot=-0.5;flapEase=1}
function drawBird(){ctx.save();ctx.translate(birdX,birdY);ctx.rotate(birdRot);ctx.fillStyle=skin.body;ctx.beginPath();ctx.ellipse(0,0,birdR,birdR*0.7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=skin.wing;ctx.beginPath();ctx.arc(birdR*0.5,-birdR*0.3,3,0,Math.PI*2);ctx.fill();ctx.fillStyle=skin.eye;ctx.beginPath();ctx.arc(birdR*0.7,-birdR*0.35,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle=skin.beak;ctx.beginPath();ctx.moveTo(birdR*0.5,0);ctx.lineTo(birdR*1.2,birdR*0.1);ctx.lineTo(birdR*0.5,birdR*0.3);ctx.closePath();ctx.fill();ctx.restore()}
function checkPipeCollision(){if(hasShield){hasShield=false;return false}for(var i=0;i<pipes.length;i++){var p=pipes[i];if(birdX+birdR>p.x&&birdX-birdR<p.x+pipeW){if(birdY-birdR<p.gapY-pipeGap/2||birdY+birdR>p.gapY+pipeGap/2)return true}}return false}
function addScore(){score+=scoreMult;scorePop=1;playScore();emitBurst(birdX,birdY,8,"#ffd700");emitComboText(birdX+20,birdY-10,"+"+scoreMult);if(score>highScore){highScore=score;newHighScore=true;try{localStorage.setItem("skyhop_high",highScore)}catch(e){}}checkAchievements()}
function drawScore(){ctx.textAlign="center";if(scorePop>0){ctx.font="48px monospace";scorePop-=0.05}else{ctx.font="32px monospace"}ctx.fillStyle="#fff";ctx.fillText(score,W/2,50);if(score>0&&score>=highScore&&scorePop>0){ctx.fillStyle="#ffd700";ctx.font="14px monospace";ctx.fillText("NEW BEST!",W/2,70)}if(konamiActive){ctx.fillStyle="rgba(255,255,255,0.3)";ctx.font="10px monospace";ctx.fillText("KONAMI MODE",W-80,H-10)}}
function drawMenu(){drawSky();drawGround();ctx.fillStyle="#fff";ctx.font="bold 36px monospace";ctx.textAlign="center";ctx.fillText("SKYHOP",W/2,120);ctx.fillStyle="#888";ctx.font="14px monospace";ctx.fillText("Tap to Flap",W/2,200);menuBlink+=0.05;if(Math.sin(menuBlink)>0){ctx.fillStyle="#aaa";ctx.font="12px monospace";ctx.fillText("~ tap to start ~",W/2,260)}var g=ctx.createLinearGradient(W/2-100,0,W/2+100,0);g.addColorStop(0,"transparent");g.addColorStop(0.5,"rgba(255,255,255,0.05)");g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fillRect(W/2-100,280,200,1);ctx.save();ctx.translate(W/2,320);ctx.rotate(Math.sin(Date.now()/500)*0.1);ctx.fillStyle="#f5c842";ctx.beginPath();ctx.ellipse(0,0,24,17,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ff6b35";ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(29,2);ctx.lineTo(12,7);ctx.closePath();ctx.fill();ctx.restore();ctx.fillStyle="#555";ctx.font="10px monospace";ctx.fillText("Best: "+highScore,W/2,380);drawDifficultySelector();drawSkinSelector();drawThemeSelector()}
function drawGameOver(){if(goAlpha<1)goAlpha+=0.05;if(displayScore<score)displayScore+=Math.ceil((score-displayScore)/3);ctx.fillStyle="rgba(0,0,0,"+(0.6*goAlpha)+")";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.font="bold 28px monospace";ctx.textAlign="center";ctx.fillText("GAME OVER",W/2,H/2-30);ctx.font="16px monospace";ctx.fillText("Score: "+displayScore,W/2,H/2+10);ctx.fillText("Best: "+highScore,W/2,H/2+40);ctx.fillStyle="#aaa";ctx.font="14px monospace";ctx.fillText("Tap to restart",W/2,H/2+80)}
function setGameOver(){if(state!=S.GAMEOVER){state=S.GAMEOVER;goAlpha=0;displayScore=0;restartDelay=30;submitScore();playHit();emitBurst(birdX,birdY,20,"#e74c3c");triggerShake(8,15);triggerFlash();triggerSlowMo();stats.games++;saveStats()}}
function resetGame(){score=0;scorePop=0;birdY=240;birdVy=0;birdRot=0;pipes=[];particles=[];flapEase=0;slowMo=1;hasShield=false;scoreMult=1;state=S.PLAYING;spawnPipe();checkAchievements()}
function render(){switch(state){case S.MENU:drawMenu();break;case S.PLAYING:drawSky();drawStars();drawClouds();drawFog();drawPipes();drawGround();drawPowerups();drawBird();drawScore();drawPowerupHUD();break;case S.GAMEOVER:drawSky();drawStars();drawClouds();drawFog();drawPipes();drawGround();drawBird();drawGameOver();drawLeaderboard();break}drawParticles();drawComboTexts();drawOrientationWarn();drawNotifications();drawToasts();drawFPS()}
function update(){if(restartDelay>0)restartDelay--;if(state==S.PLAYING){updateStars();updateClouds();updateGround();updateBird();updatePipes();checkPowerupCollision();updatePowerups();updateSlowMo();if(birdY+birdR>=groundY||checkPipeCollision())setGameOver()}updateParticles();updateComboTexts();updatePowerupTimers();applyShashake()}
function initAudio(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function playTone(freq,dur,type,vol){if(muted||!actx)return;var o=actx.createOscillator(),g=actx.createGain();o.connect(g);g.connect(actx.destination);o.type=type||"sine";o.frequency.setValueAtTime(freq,actx.currentTime);g.gain.setValueAtTime(vol||0.3,actx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+dur);o.start(actx.currentTime);o.stop(actx.currentTime+dur)}
function playFlap(){playTone(400,0.1,"sine",0.3)}
function playScore(){playTone(800,0.08,"sine",0.2)}
function playHit(){playTone(200,0.3,"sawtooth",0.3)}
function toggleMute(){muted=!muted;try{localStorage.setItem("skyhop_mute",muted)}catch(e){}}