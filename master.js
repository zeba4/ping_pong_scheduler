
var totalTimeInSeconds;
var flag=true;
var designatedStart_time = localStorage.setItem('startTime', designatedStart_time)
var countSec;
function startTimer(numGames){
   totalTimeInSeconds = 600*numGames;
  countSec=setInterval(function()
    {
      minuteTimer(totalTimeInSeconds,numGames)
    }, 1000);
}

function minuteTimer(time, uid) //decreses the seconds value
{
  $("#button1").unbind("click", startTenMinuteTimer);
  $("#button2").unbind("click", startTwentyMinuteTimer);
  $("#button3").unbind("click", startThirtyMinuteTimer);
  var minutes=Math.floor(time/60);
  var seconds=Math.floor(time%60);
  if(seconds<10)
  {
    seconds="0"+ seconds
  }

  if (minutes==1 && seconds<59)

  {
    if(flag)
    {
      showTimerWarning();
      document.getElementById('audio').play();
      flag=false;
    }
  }
  document.getElementById("timer" + uid).innerHTML=minutes +":" +seconds;
if ((time < 0))
  { clearInterval(countSec);
   hideTimerWarning();
   $("#button1").bind("click", startTenMinuteTimer);
   $("#button2").bind("click", startTwentyMinuteTimer);
   $("#button3").bind("click", startThirtyMinuteTimer);
   document.getElementById('audio2').play();
   return;
    }
totalTimeInSeconds=totalTimeInSeconds-1;
}
