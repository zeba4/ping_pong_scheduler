var config = {
  apiKey: "AIzaSyDDrze4WIGeBYuyl_Y7RhmISYm_zGUz4OU",
  authDomain: "ping-pong-scheduler-1dd4f.firebaseapp.com",
  databaseURL: "https://ping-pong-scheduler-1dd4f.firebaseio.com",
  projectId: "ping-pong-scheduler-1dd4f",
  storageBucket: "ping-pong-scheduler-1dd4f.appspot.com",
  messagingSenderId: "290287324381"
};
firebase.initializeApp(config);

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
      document.getElementById("endTime").innerHTML=newTime;
      document.getElementById("table").style.display="";
    }else{
      var newTime= hour+":"+minutes;
      document.getElementById("endTime").innerHTML=newTime;
      document.getElementById("table").style.display="";}
    }else{
      document.getElementById("endTime").innerHTML="Table Is Open";
      document.getElementById("table").style.display="none";
    }
  }
  var updateDivTagContent= function(id,content){
    var x =document.getElementById(id);
    x.innerHTML = content;
  };
  var createTag= function(){
    var startTime=displayNewTime();
    updateDivTagContent("endTime", startTime);
  }