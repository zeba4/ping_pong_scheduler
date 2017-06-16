/*
index.js
*/
"use strict";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCkugIWgBALhDDweghTdirBWhKpC59dBrs",
  authDomain: "ping-pong-scheduler.firebaseapp.com",
  databaseURL: "https://ping-pong-scheduler.firebaseio.com",
  projectId: "ping-pong-scheduler",
  storageBucket: "ping-pong-scheduler.appspot.com",
  messagingSenderId: "890197500377"
};
firebase.initializeApp(config);

var database = firebase.database();
var overallRef = database.ref("details/")
var tournamentRef = database.ref("details/tournament/");
var loadQuery = tournamentRef.orderByChild('date');
var playersRef = database.ref("details/players");
var updatePlayersRef = playersRef.limitToLast(1);

var openKeys  = [];
var openNames = [];
var openDates = [];

var closedKeys  = [];
var closedNames = [];
var closedDates = [];

var screenState = 1;
var countDownDate;
var currentJoinKey;
var timerVariable;
//TODO:
//Add number of people in tournament next to dynamic list tags
//Check to see if internet connection is lost

function createTournament()
{
  var tName = document.getElementById("tourName").value
  var tDate = document.getElementById("datepicker").value
  var tStart = document.getElementById("runMax").checked
  var tMax = document.getElementById("numPlayers").value

  if(tMax && tDate && tName != "" || null || undefined )
  {
    var newPostRef = tournamentRef.push()
    newPostRef.set({
      name: tName,
      date: tDate,
      maxPlayers: tMax,
      startOnMax: tStart,
      started: false
    });
    console.log("success")
  }else {
    console.log("failure")
  }
}

loadQuery.once('value', function(snapshot) {
    snapshot.forEach(function(data){
      if(data.val().started == false){
        if(hasStarted(data.val().date) == false)
        {
          openKeys.push(data.key);
          openNames.push(data.val().name);
          openDates.push(data.val().date);
        }else{
          closedKeys.push(data.key);
          closedNames.push(data.val().name);
          closedDates.push(data.key);
        }
      }else{
        closedKeys.push(data.key);
        closedNames.push(data.val().name);
        closedDates.push(data.key);
      }
    });
    updateOpenTour();
    updateClosedTour();
  });

  function hasStarted(data)
  {
    for(var i=0;i<openKeys.length;i++)
    {
      if(timeDiff(openDates[i]) != false)
      {
        startTournament(true, i)
      }
    }
  }

tournamentRef.on('child_changed', function(snapshot){
});

updatePlayersRef.on('child_added', function(snapshot) {
  if(snapshot.val()[currentJoinKey] != undefined)
  {
    updateList(snapshot.val()[currentJoinKey])
  }
});

function updateOpenTour()
{
  for(var i = 0;i<openKeys.length;i++)
  {
      $("#listOpen").append('<li>' + openNames[i] + " | Start Dates: " + openDates[i] + '</li>')
      var $button = $('<button/>', {
        type: 'button',
        id: openKeys[i],
        text: 'Join',
        click: function() {
          viewTour(this.id)
        }
      });
      $button.appendTo('#listOpen');
  }
}

function updateClosedTour()
{
  for(var i = 0;i<closedKeys.length;i++)
  {
      $("#listClosed").append('<li>' + closedNames[i] + '</li>')
      var $button = $('<button/>', {
        type: 'button',
        id: closedKeys[i],
        text: 'View',
        click: function() {
          //viewTour(this.id)
        }
      });
      $button.appendTo('#listClosed');
  }
}

function viewTour(indexK)
{
  screenState = 2;
  transition(screenState);
  loadTournament(indexK);
}

function loadTournament(key)
{
  overallRef.once('value').then(function(snapshot) {
    // The Promise was "fulfilled" (it succeeded).
    try{
      displayTournament(snapshot.val(),key);
    }catch(err){
      console.log(err)
    }
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
  });
}

function displayTournament(data, objKey)
{
    countDownDate = new Date(data.tournament[objKey].date).getTime();
    startTimer();
    document.getElementById("tNamePlace").innerHTML = "Tournament Name: " + data.tournament[objKey].name;
    currentJoinKey = objKey
    var objArray = Object.keys(data.players.playerId)
    for(var i=0;i<objArray.length;i++)
    {
      if(data.players.playerId[objArray[i]].tid == currentJoinKey){
        updateList(objArray[i], data);
      }
    }

}

function updateList(keyOrName, data)
{
    if(arguments.length == 2)
    {
      document.getElementById("signedUp").innerHTML += data.players.playerId[keyOrName].name + "<br>"
    }else{
      document.getElementById("signedUp").innerHTML += keyOrName + "<br>"
    }
}

function joinTournament()
{
    if(document.getElementById("name").value != null || undefined || "")
    {
      var newPostRef = database.ref('details/players/playerId').push()
      newPostRef.set({
        name: document.getElementById("name").value,
        tid: currentJoinKey
      });
      updateList(document.getElementById("name").value)
    }
}

function startTimer()
{
    timerVariable = setInterval(function() {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("startTime").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      if (distance < 0) {
        clearInterval(timerVariable);
        startTournament();
      }
  }, 1000);
}

function killTimer()
{
  clearTimeout(timerVariable)
}
// 1 is home page
// 2 is join screen
function transition(screen)
{
  if(screen == 1)
  {
    document.getElementById("screen1").className = "visile"
    document.getElementById("screen2").className = "hidden"
    document.getElementById("signedUp").innerHTML = ""
    document.getElementById("startTime").innerHTML = "00d 00h 00m 00s"
  }else if(screen == 2){
    document.getElementById("screen2").className = "visible"
    document.getElementById("screen1").className = "hidden"
  }else if(screen == 3){
    document.getElementById("screen2").className = "hidden"
    document.getElementById("screen1").className = "hidden"
  }
}

function homePage()
{
  screenState = 1
  killTimer()
  transition(screenState)
}

//In Progress
function hasStarted(data)
{
  for(var i=0;i<openKeys.length;i++)
  {
    if(timeDiff(openDates[i]) != false)
    {
      startTournament(true, i)
      return true;
    }
  }
  return false;
}

function timeDiff(data)
{
  var selectedDate = new Date(data);
  var now = new Date();
  now.setHours(0,0,0,0);
  if (selectedDate < now) {
    // selected date is in the past
    return true
  }else{
    return false
  }
}

function startTournament(data, pos)
{
    if(data == true)
    {
      var updateStartRef = database.ref('details/tournament/open/'+openKeys[pos]);
      var updates = {};
      updates['/started'] = true;
      updateStartRef.update(updates)
    }
}

$(function() {
  $( "#datepicker" ).datepicker({ minDate: 0});
});
