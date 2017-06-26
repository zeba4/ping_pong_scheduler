// Initialize Firebase
var config = {
  apiKey: "AIzaSyDDrze4WIGeBYuyl_Y7RhmISYm_zGUz4OU",
  authDomain: "ping-pong-scheduler-1dd4f.firebaseapp.com",
  databaseURL: "https://ping-pong-scheduler-1dd4f.firebaseio.com",
  projectId: "ping-pong-scheduler-1dd4f",
  storageBucket: "ping-pong-scheduler-1dd4f.appspot.com",
  messagingSenderId: "290287324381"
};
firebase.initializeApp(config);
var updateDivTagContent= function(id,content){
  var x =document.getElementById(id);
  x.innerHTML = content;
};

var database = firebase.database();
var callData = database.ref("timerInfo/");
callData.on("value", function(snapshot) {
 display (snapshot.val());
}, function (error) {
 console.log("Error: " + error.code);
});
var display= function(data){
  var hour = data.hour;
  var displayMessage;
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
       displayMessage =hour+":0"+minutes
      document.getElementById("table").style.display="";
    }else{
       displayMessage= hour+":"+minutes;
      document.getElementById("table").style.display="";}
    }else{
      document.getElementById("table").style.display="none";
      displayMessage="Table Is Open";
    }
    updateDivTagContent("endTime", displayMessage);
  }

  var createTag= function(){
    var startTime=display();
    updateDivTagContent("endTime", startTime);
  }
