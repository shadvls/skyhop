var c=document.getElementById("c"),ctx=c.getContext("2d");
var W=320,H=480;
function rand(a,b){return a+Math.random()*(b-a)}
function clamp(v,mn,mx){return v<mn?mn:v>mx?mx:v}
function lerp(a,b,t){return a+(b-a)*t}