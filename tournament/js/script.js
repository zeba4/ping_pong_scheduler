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

const database = firebase.database();
const details_firebase_route = "details/";
const tournament_firebase_route = "tournament/";
const players_firebase_route = "players/";
const detailsRef = database.ref(details_firebase_route);
const tournamentRef = database.ref(details_firebase_route + tournament_firebase_route);
const loadQuery = tournamentRef.orderByChild('date');
const updateTournamentRef = database.ref(details_firebase_route+tournament_firebase_route).limitToLast(1);
const screenSections = ["homeScreen","joinTournamentScreen","tournamentBracketScreen"]


var updatePlayersRef;


var screenState = 1;
var countDownDate;
var currentJoinKey;
var currentBracketKey;
var timerVariable;


//TODO:
// Timeout finish tournaments
// Create a Winner Screen once bracket is over?
//Add number of people in tournament next to dynamic list tags
//Update to firebase on value entered(Tournament State) *Need to verify fix
//Instant feedback on entering score, creating tournament, joining tournament
//Add Start on max players
//Check to see if internet connection is lost
//Ask for full name of 1st-3rd place winners at end for storage purposes



// Homepage Load Code

loadQuery.once('value', function(snapshot){
  if(snapshot.val() != null){
    var keysOfTournaments = Object.keys(snapshot.val());
    var pos = 0;
    snapshot.forEach(function(data){
      if(hasStarted(data.val(),keysOfTournaments[pos]) == false)
      {
        updateOpenTour(data.val().name, data.val().date, keysOfTournaments[pos]);
      }else{
        updateClosedTour(data.val().name, keysOfTournaments[pos]);
      }
      pos++;
    });
    listenForNewTournaments();
  }
});

function listenForNewTournaments(){
  updateTournamentRef.on('child_added', function(snapshot){
    checkForDuplicates(snapshot.val().name,snapshot.val().date,snapshot.key);
  });
}

function checkForDuplicates(name, date, key){
  if(document.getElementById(key) == null)
  {
    updateOpenTour(name, date,key);
  }
}

function listenForNewPlayers(key){
  updatePlayersRef = database.ref(details_firebase_route+tournament_firebase_route + key +"/"+players_firebase_route);
  updatePlayersRef.on('child_added', function(snapshot) {
    updateList(snapshot.val().name);
  });
}

//Open Tournament Code

function loadTournament(key){
  detailsRef.once('value').then(function(snapshot) {
    // The Promise was "fulfilled" (it succeeded)
      displayTournament(snapshot.val(),key);
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
    console.log("Failed to load tournament data")
  });
}

function displayTournament(data, objKey){
    countDownDate = new Date(data.tournament[objKey].date).getTime();
    startTimer();
    document.getElementById("tNamePlace").innerHTML = "Tournament Name: " + data.tournament[objKey].name;
}

function updateList(name){
  
  document.getElementById("signedUp").innerHTML +=  name + "<br>";
}

function createTournament(){
  var tourValues = getDivValue(['tourName','datepicker','numPlayers','runMax'])
  if(tourValues[0] && tourValues[1] && tourValues[2] != "" || null || undefined )
  {
    var newPostRef = tournamentRef.push();
    newPostRef.set({
      name: tourValues[0],
      date: tourValues[1],
      maxPlayers: tourValues[2],
      startOnMax: tourValues[3],
      tourString: ""
    });
    clearDocument(["tourName","datepicker"])
    console.log("success");
  }else {
    console.log("failure");
  }
}

function getDivValue(ids){
  var listOfValues = [];
  for(let i = 0;i<ids.length;i++)
  {
    listOfValues.push(document.getElementById(ids[i]).value);
  }
  return listOfValues;
}




function joinTournament(){
  try{
    if(document.getElementById("playerName").value != "")
    {
      var newPostRef = database.ref(details_firebase_route+tournament_firebase_route+ currentJoinKey + '/' + players_firebase_route).push();
      newPostRef.set({
        name: document.getElementById("playerName").value
      });
      document.getElementById("playerName").value = "";
    }
  }catch(err){
    console.log(err)
  }
}

// Transition Code

function transition(screen){
  // 1 is home page, 2 is join screen, 3 is the Bracket screen
  if(screen == 1)
  {
    changeClassName(screenSections,["visible","hidden","hidden"]);
    clearDocument(["signedUp","startTime"]);
  }else if(screen == 2){
    changeClassName(screenSections,["hidden","visible","hidden"]);
  }else if(screen == 3){
    changeClassName(screenSections,["hidden","hidden","visible"]);
  }
}


function changeClassName(ids,state){
  for(var i = 0; i<state.length;i++){
    document.getElementById(ids[i]).className = state[i]
  }
}

function clearDocument(ids){
  for(var i = 0; i<ids.length;i++){
    if(ids[i] == "startTime")
    {
      document.getElementById(ids[i]).innerHTML = "00d 00h 00m 00s";
    }else{
      document.getElementById(ids[i]).innerHTML = "";
    }
    
  }
}

function homePage(){
  if(screenState == 2)
  {
    killCheckForNewPlayers();
  }
  if(screenState == 3)
  {
    saveTournamentState();
  }
  killTimer();
  screenState = 1;
  transition(screenState);
}

function killCheckForNewPlayers(){

  updatePlayersRef.off();
}


function viewTour(key){
  screenState = 2;
  currentJoinKey = key;
  transition(screenState);
  loadTournament(key);
  listenForNewPlayers(key);
}

function viewBracket(key){
  currentBracketKey = key;
  screenState = 3;
  transition(screenState);
  loadBracket(key);
}

// Time/DOM Code

$(function() {

  $( "#datepicker" ).datepicker({ minDate: 0});
});

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

function killTimer(){

  clearTimeout(timerVariable);
}

function checkPastStartDate(data){
  var selectedDate = new Date(data);
  var now = new Date();
  now.setHours(0,0,0,0);
  if (selectedDate < now) {
    // selected date is in the past
    return true;
  }else{
    return false;
  }
};

// Saving the State of the tournament

function saveTournamentState(){
    var dataT = myDiagram.model.toJSON();
    var updateStartRef = database.ref(details_firebase_route+tournament_firebase_route+ currentBracketKey);
    var updates = {};
    updates['/tourString'] = dataT;
    updateStartRef.update(updates);
}

// Tournament has started code

function hasStarted(data, key,override){
    if(checkPastStartDate(data.date))
    {
      if(data.tourString == "")
      {
        generateBracket(data,key);
      }
      return true;
    }
    return false;
}

function generateBracket(data,key){
  currentBracketKey = key;
  var playerArray = [];
  var tempRef = database.ref(details_firebase_route + tournament_firebase_route + key + "/" + players_firebase_route)
  tempRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(data1){
        playerArray.push(data1.val().name);
    });
      makeModel(playerArray);
      startTournament(myDiagram.model.toJSON(),data,key);
      }, function(error) {
    // The Promise was rejected.
    console.error(error);
    console.log("Failed to load list of players")
  });
}

function startTournament(tString,data, key){
      var updateStartRef = database.ref(details_firebase_route+tournament_firebase_route + key);
      var updates = {};
      updates['/tourString'] = tString;
      updateStartRef.update(updates);
}

function loadBracket(key){
  tournamentRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(data){
      if(data.key == key)
      {
        displayBracket(data.val().tourString);
      }
    })
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
    console.log("Tournament failed to initialize")
  });
}

function displayBracket(dataString){
  var bracketString = JSON.parse(dataString);
  updateModel(bracketString.nodeDataArray);
}

function updateOpenTour(name,date,key){
  $("#listOpen").append('<li>' + name + " | Start Dates: " + date+ '</li>')
  var $button = $('<button/>', {
    type: 'button',
    id: key,
    text: 'Join',
    click: function() {
      viewTour(this.id)
    }
  });
  $button.appendTo('#listOpen');
}

function updateClosedTour(name,key){
  $("#listClosed").append('<li>' + name + '</li>')
  var $button = $('<button/>', {
    type: 'button',
    id: key,
    text: 'View',
    click: function() {
      viewBracket(this.id)
    }
  });
  $button.appendTo('#listClosed');
}