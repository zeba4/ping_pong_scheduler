
var totalTime;
var designatedStart_time =
localStorage.setItem('startTime', designatedStart_time)
var countSec;

function start20()
{
totalTime=1200;
countSec=setInterval(function(){minuteTimer(totalTime,"2")}, 1000);
}

function start10()
{
totalTime = 600;
countSec=setInterval(function(){minuteTimer(totalTime,"1")}, 1000);
}

function start30()
{
  totalTime = 1800;
countSec=setInterval(function(){minuteTimer(totalTime,"3")}, 1000);
}

function minuteTimer(time, uid) //decreses the seconds value
{
    var minutes=Math.floor(time/60);
    var seconds=Math.floor(time%60);
    if(seconds<10)
    {
      seconds="0"+ seconds

    }
document.getElementById("timer" + uid).innerHTML=minutes +":" +seconds;

    if (time <= 0)
      {
         clearInterval(countSec);
         return;
      }
totalTime=totalTime-1;

}
