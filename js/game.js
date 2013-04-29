var c=document.getElementById("c"),ctx=c.getContext("2d");
var W=320,H=480;
function rand(a,b){return a+Math.random()*(b-a)}
function clamp(v,mn,mx){return v<mn?mn:v>mx?mx:v}
function lerp(a,b,t){return a+(b-a)*t}
var CFG={W:320,H:480,gravity:0.25,flap:-5.5,pipeW:40,pipeGap:120,pipeSpeed:2,groundH:80,birdR:12,birdX:60};