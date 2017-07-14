  var config = {
    apiKey: "AIzaSyBy-CYW3EOzYUZLoBR0kYwE9bOFt1pWeEU",
    authDomain: "ping-pong-tournament-a18d7.firebaseapp.com",
    databaseURL: "https://ping-pong-tournament-a18d7.firebaseio.com",
    projectId: "ping-pong-tournament-a18d7",
    storageBucket: "ping-pong-tournament-a18d7.appspot.com",
    messagingSenderId: "685269907531"
  };
  firebase.initializeApp(config);
var updateDivTagContent= function(id,content){
  var x =document.getElementById(id);
  x.innerHTML = content;
};

var database = firebase.database();
var callData = database.ref("timerInfo/");
callData.on("value", function(snapshot) {
 displayNewTime(snapshot.val());
}, function (error) {
 console.log("Error: " + error.code);
});
var displayNewTime= function(data){
  var hour = data.hour;
  var minutes = data.min;
  var time = data.time;
  var checkforzero =false;
  minutes = minutes +time
  if(minutes >= 60){
    hour++;
    minutes = minutes % 60;
  }if(time==0){
    checkforzero=true;
  } if(checkforzero==false){
    if (hour>12){
      hour=hour-12;
    }else{
      hour=hour;
    }
    if(minutes<10){
      var newTime =hour+":0"+minutes
      updateDivTagContent();
      document.getElementById("table").style.display="";
    }else{
      var newTime= hour+":"+minutes;
      updateDivTagContent();
      document.getElementById("table").style.display="";}
    }else{
      document.getElementById("endTime").innerHTML="Table Is Open";
      document.getElementById("table").style.display="none";
    }
  }

  var createTag= function(){
    var startTime=displayNewTime();
    updateDivTagContent("endTime", startTime);
  }
