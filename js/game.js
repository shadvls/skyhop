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