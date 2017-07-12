  var config = {
    apiKey: "AIzaSyBy-CYW3EOzYUZLoBR0kYwE9bOFt1pWeEU",
    authDomain: "ping-pong-tournament-a18d7.firebaseapp.com",
    databaseURL: "https://ping-pong-tournament-a18d7.firebaseio.com",
    projectId: "ping-pong-tournament-a18d7",
    storageBucket: "ping-pong-tournament-a18d7.appspot.com",
    messagingSenderId: "685269907531"
  };
  firebase.initializeApp(config);
  var totalTimeInSeconds;
  var flag=true;
  var designatedStart_time = localStorage.setItem('startTime', designatedStart_time)
  var countSec;
  var myStop;
  var database = firebase.database();
  var timeref =database.ref('timerInfo/');

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

      var onLoad=function(){
       addtodatabase(0,0,0);
    }

    function addtodatabase(h,m,t){
      database.ref('timerInfo/').set({
      hour: h,
      min: m,
      time:t
    })
    }
    function resetTimer()
    {
      document.getElementById('timer3').innerHTML='30:00';
      document.getElementById('timer2').innerHTML='20:00';
      document.getElementById('timer1').innerHTML='10:00';
    }

    function stop(){
     clearInterval(countSec);
     clearTimeout(myStop);
     hideTimerSections(["set1","set2","set3","stop"]);
     showTimerSections(["button1","button2","button3","para","select"])
     resetTimer();
      $("#button1").bind("click", startTenMinuteTimer);
      $("#button2").bind("click", startTwentyMinuteTimer);
      $("#button3").bind("click", startThirtyMinuteTimer);
       hideTimerWarning();
       addtodatabase(0,0,0);
    }
     var getCurrentTime= function(){
     var d= new Date();
      return {
        hours: d.getHours(),
        minutes: d.getMinutes()
      };
   }
  var startTenMinuteTimer= function() {
     startTimer(1);
    hideTimerSections(["button1", "button2","button3","para","select"]);
    showTimerSections(["stop","firstTimer","set1"]);
    var time = getCurrentTime();
    addtodatabase(time.hours,time.minutes, 10);
    myStop= setTimeout(function(){
      hideTimerSections(["stop", "set1"]);
      showTimerSections(["button1","button2","button3","para","select"]);
      addtodatabase(time.hours,time.minutes, 0);
        },600000);
  };

  var startTwentyMinuteTimer=function() {
     startTimer(2);
    hideTimerSections(["button1","button2", "button3","para","select"]);
    showTimerSections(["stop","set2","secondTimer"]);
    var time = getCurrentTime();
    addtodatabase(time.hours,time.minutes, 20);
    myStop=setTimeout(function(){
      hideTimerSections(["stop", "set2"]);
      showTimerSections(["button1","button2","button3","para","select"]);
      addtodatabase(time.hours,time.minutes, 0);
        },1200000);
  };
  var startThirtyMinuteTimer=function()  {
     startTimer(3);
    hideTimerSections(["button1", "button2","button3","para","select"]);
    showTimerSections(["stop","set3","thirdTimer"]);
    var time = getCurrentTime();
    addtodatabase(time.hours,time.minutes, 0);
    myStop = setTimeout(function(){
      hideTimerSections(["stop", "set3"]);
      showTimerSections(["button1","button2","button3","para","select"]);
      addtodatabase(time.hours,time.minutes, 0);
    },1800000);
  }

  $("document").ready(function(){
    $("#button3").bind("click", startThirtyMinuteTimer);
  });
  $("document").ready(function(){
    $("#button2").bind("click", startTwentyMinuteTimer);
  });
  $("document").ready(function(){
    $("#button1").bind("click", startTenMinuteTimer);
  });

  function showTimerWarning(){
    $("#timerWarningMessage").show();
  }

  function hideTimerWarning(){
    $("#timerWarningMessage").hide();
  }
  function hideTimerSections(idList){
    idList.forEach(function(eachId){
      $("#" + eachId).hide();
    });
  }
  function showTimerSections(idList){
    idList.forEach(function(eachId){
      $("#" + eachId).show();
    });
  }
