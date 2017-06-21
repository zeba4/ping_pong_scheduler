var config = {
  apiKey: "AIzaSyDDrze4WIGeBYuyl_Y7RhmISYm_zGUz4OU",
  authDomain: "ping-pong-scheduler-1dd4f.firebaseapp.com",
  databaseURL: "https://ping-pong-scheduler-1dd4f.firebaseio.com",
  projectId: "ping-pong-scheduler-1dd4f",
  storageBucket: "ping-pong-scheduler-1dd4f.appspot.com",
  messagingSenderId: "290287324381"
};
firebase.initializeApp(config);

var onLoad=function(){
   addtodatabase(0,0,0);
}

  var database = firebase.database();
  var timeref =database.ref('timerInfo/');
  var hour,minutes
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
  var myStop;
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
    var h = (d.getHours());
    var m = (d.getMinutes());
    hour = h;
    minutes = m;

 }
  var startTenMinuteTimer= function() {
    start10()
    hideTimerSections(["button1", "button2","button3","para","select"]);
    showTimerSections(["stop","firstTimer","set1"]);
    getCurrentTime();
    addtodatabase(hour,minutes,10);
    myStop= setTimeout(function(){
      hideTimerSections(["stop", "set1"]);
      showTimerSections(["button1","button2","button3","para","select"]);
      addtodatabase(hour,minutes,0);
        },600000);
  };

  var startTwentyMinuteTimer=function() {
    start20()
    hideTimerSections(["button1","button2", "button3","para","select"]);
    showTimerSections(["stop","set2","secondTimer"]);
    getCurrentTime();
    addtodatabase(hour,minutes,20);
    myStop=setTimeout(function(){
      hideTimerSections(["stop", "set2"]);
      showTimerSections(["button1","button2","button3","para","select"]);
      addtodatabase(hour,minutes,0);
        },1200000);
  };
  var startThirtyMinuteTimer=function()  {
    start30();
    hideTimerSections(["button1", "button2","button3","para","select"]);
    showTimerSections(["stop","set3","thirdTimer"]);
    getCurrentTime();
    addtodatabase(hour,minutes,30);
    myStop = setTimeout(function(){
      hideTimerSections(["stop", "set3"]);
      showTimerSections(["button1","button2","button3","para","select"]);
      addtodatabase(hour,minutes,0);
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
