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
var currentBracketKey;
var timerVariable;
//TODO:
//Add number of people in tournament next to dynamic list tags
//Check to see if internet connection is lost
//GOTTA UPDATE THAT TOURNAMENT ONCE CREATED

//URGENT: FIX LOAD QUERY DOWN

loadQuery.once('value', function(snapshot) {
    if(snapshot.val() != null)
    {
    var keysOfTournaments = Object.keys(snapshot.val())
    var pos = 0;
    snapshot.forEach(function(data){
      if(data.val().started == false){
        if(hasStarted(data.val(),keysOfTournaments[pos]) == false)
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
        hasStarted(data.val(),keysOfTournaments[pos])//, "override")
        closedKeys.push(data.key);
        closedNames.push(data.val().name);
        closedDates.push(data.key);
      }
      pos++;
    });
    updateOpenTour();
    updateClosedTour();
    }
});

function hasStarted(data, key,override){
 
  if(override != "override")
  {
    if(timeDiff(data.date) != false)
    {
      generateBracket(data,key)
      return true;
    }
    return false;
  }else{
    generateBracket(data, key)
  }
}

function startTournament(tString,data, key){
      var updateStartRef = database.ref('details/tournament/' + key);
      var updates = {};
      updates[ '/started'] = true;
      updates['/tourString'] = tString;
      updateStartRef.update(updates)
}

function generateBracket(data,key){
  var playerArray = [];
  var tempRef = database.ref("details/players/playerId")
  tempRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(data1){
      if(data1.val().tid == key)
      {
        playerArray.push(data1.val().name)
      }
      
    });

      makeModel(playerArray)
      console.log(myDiagram.model.toJSON())
      startTournament(myDiagram.model.toJSON(),data,key)
      }, function(error) {
    // The Promise was rejected.
    console.error(error);
  });
}

function updateClosedTour(){
  for(var i = 0;i<closedKeys.length;i++)
  {
      $("#listClosed").append('<li>' + closedNames[i] + '</li>')
      var $button = $('<button/>', {
        type: 'button',
        id: closedKeys[i],
        text: 'View',
        click: function() {
          viewBracket(this.id)
        }
      });
      $button.appendTo('#listClosed');
  }
}

function loadBracket(key){
  tournamentRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(data){
      if(data.key == key)
      {
        console.log("1")
        displayBracket(data.val().tourString);
      }
    })
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
  });
}


// 1 is home page
// 2 is join screen
// 3 is the Bracket screen
function transition(screen){
  if(screen == 1)
  {
    document.getElementById("screen1").className = "visible"
    document.getElementById("screen2").className = "hidden"
    document.getElementById("screen3").className = 'hidden'
    document.getElementById("signedUp").innerHTML = ""
    document.getElementById("startTime").innerHTML = "00d 00h 00m 00s"
  }else if(screen == 2){
    document.getElementById("screen1").className = "hidden"
    document.getElementById("screen2").className = "visible"
    document.getElementById("screen3").className = 'hidden'
  }else if(screen == 3){
    document.getElementById("screen1").className = "hidden"
    document.getElementById("screen2").className = "hidden"
    document.getElementById("screen3").className = "visible"
  }
}

function viewBracket(key){
  currentBracketKey = key
  screenState = 3;
  transition(screenState);
  loadBracket(key);
}

function viewTour(key){
  screenState = 2;
  transition(screenState);
  loadTournament(key);
}

function homePage(){
  saveTournamentState();
  killTimer()
  screenState = 1
  transition(screenState)
}

function saveTournamentState(){
  if(screenState == 3)
  {
    var dataT = myDiagram.model.toJSON();
    console.log(dataT)
    var updateStartRef = database.ref('details/tournament/' + currentBracketKey);
    var updates = {};
    updates['/tourString'] = dataT;
    updateStartRef.update(updates)
  }
}

function joinTournament(){
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

function createTournament(){
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
      started: false,
      tourString: ":)"

    });
    console.log("success")
  }else {
    console.log("failure")
  }
}

function startTimer(){
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

function timeDiff(data){
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

function killTimer(){
  clearTimeout(timerVariable)
}

function updateList(keyOrName, data){
    if(arguments.length == 2)
    {
      document.getElementById("signedUp").innerHTML += data.players.playerId[keyOrName].name + "<br>"
    }else{
      document.getElementById("signedUp").innerHTML += keyOrName + "<br>"
    }
}

function loadTournament(key){
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

function displayTournament(data, objKey){
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

function updateOpenTour(){
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


function displayBracket(dataString){
  console.log(dataString)
  myDiagram.model = go.Model.fromJson(dataString)
}



updatePlayersRef.on('child_added', function(snapshot) {
  if(snapshot.val()[currentJoinKey] != undefined)
  {
    updateList(snapshot.val()[currentJoinKey])
  }
});

/*
tournamentRef.on('child_changed', function(snapshot){
});
*/

$(function() {
  $( "#datepicker" ).datepicker({ minDate: 0});
});
