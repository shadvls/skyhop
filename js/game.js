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