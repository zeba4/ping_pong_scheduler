/*
index.js
*/
"use strict";

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBy-CYW3EOzYUZLoBR0kYwE9bOFt1pWeEU",
    authDomain: "ping-pong-tournament-a18d7.firebaseapp.com",
    databaseURL: "https://ping-pong-tournament-a18d7.firebaseio.com",
    projectId: "ping-pong-tournament-a18d7",
    storageBucket: "ping-pong-tournament-a18d7.appspot.com",
    messagingSenderId: "685269907531"
  };
  firebase.initializeApp(config);

const database = firebase.database();
const details_firebase_route = "details/";
const tournament_firebase_route = "tournament/";
const players_firebase_route = "players/";
const tournament_string = "tourString";
const detailsRef = database.ref(details_firebase_route);
const tournamentRef = database.ref(details_firebase_route + tournament_firebase_route);
const loadQuery = tournamentRef.orderByChild('date');
const updateTournamentRef = database.ref(details_firebase_route+tournament_firebase_route).limitToLast(1);
const screenSections = ["homeScreen","joinTournamentScreen","tournamentBracketScreen","winnerScreen"]
const connectedRef = database.ref(".info/connected");

var updatePlayersRef;
var updateBracketRef;
var screenState = "home";
var countDownDate;
var currentJoinKey;
var currentBracketKey;
var timerVariable;
var tournamentExists;
var isConnected;
var isTourOver;

connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    isConnected = true;
  } else {
    isConnected = false;
  }
});

//TODO:
// Timeout finish tournaments
// Create a Winner Screen once bracket is over?
//Add number of people in tournament next to dynamic list tags
//Add Start on max players
//Ask for full name of 1st-3rd place winners at end for storage purposes
//Shuffle player list

//Once both scores are entered for the final column, then update that tournament with a termination date 1 day after the event.

// Homepage Load Code

loadQuery.once('value', function(snapshot){
  if(snapshot.val() != null){
    snapshot.forEach(function(data){
      if(data.val().tourOver == true)
      {
        if(deleteTournament(data.val().date, data.key))
        {
          updateClosedTour(data.val().name, data.key, "Finished: ");
        }
    }else{
        if(hasStarted(data.val(),data.key) == false)
        {
          updateOpenTour(data.val().name, data.val().date, data.key);
        }else{
          updateClosedTour(data.val().name, data.key, "");
        }
    }
    });
    listenForNewTournaments();
  }else{
    tournamentExists = false;
  }
});

function deleteTournament(date,key){
  if(checkPastStartDate(date))
  {
    var deleteRef = database.ref(details_firebase_route + tournament_firebase_route + key);
    deleteRef.remove();
    return false;
  }
  return true;
}


function listenForCurrentBracketUpdates(key){
  updateBracketRef = database.ref(details_firebase_route+tournament_firebase_route + key);
  updateBracketRef.on('child_changed', function(snapshot) {
    if(myDiagram.model.toJSON() != snapshot.val())
    {
        updateModel(JSON.parse(snapshot.val()).nodeDataArray);
    }
  });
}

function killListenForCurrentBracketUpdates(){
  isTourOver = "";
  updateBracketRef.off();
}

function listenForNewTournaments(){
  updateTournamentRef.on('child_added', function(snapshot){
    checkForDuplicates(snapshot.val().name,snapshot.val().date,snapshot.key);
  });
}

function checkForDuplicates(name, date, key){
  if(document.getElementById(key) == null)
  {
    updateOpenTour(name, date,key);
    alert("Tournament Created");
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

  document.getElementById("signedUp").innerHTML +=  "<li>" + name + "</li>";
}

function createTournament(){
  if(isConnected == true){
    listenForNewTournaments();
    var tourValues = getDivValue(['tourName','datepicker']);//,'numPlayers'//,'runMax']);
    if(tourValues[0] && tourValues[1] && tourValues[2] != "" || null || undefined )
    {
      var newPostRef = tournamentRef.push();
      newPostRef.set({
        name: tourValues[0],
        date: tourValues[1],
        //maxPlayers: tourValues[2],
        //startOnMax: tourValues[3],
        tourString: "",
        tourOver: false
      });
      clearDocument(["tourName","datepicker"]);
      console.log("success");
    }else {
      console.log("failure");
      alert("fill in all the values");
    }
  }else{
    alert("Failed, you are not connected to the internet");
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
    if(isConnected == true){
      if(document.getElementById("playerName").value != "")
      {
        var newPostRef = database.ref(details_firebase_route+tournament_firebase_route+ currentJoinKey + '/' + players_firebase_route).push();
        newPostRef.set({
          name: document.getElementById("playerName").value
        });
        document.getElementById("playerName").value = "";
      }
    }else{
    alert("Failed, you are not connected to the internet");
  }
  }catch(err){
    console.log(err)
  }
}

// Transition Code
function transition(screen){
  // home is home page, join is join screen, bracket is the Bracket screen
  if(screen == "home"){
    changeClassName(screenSections,["visible","hidden","hidden","hidden"]);
    clearDocument(["signedUp","startTime"]);
  }else if(screen == "join"){
    changeClassName(screenSections,["hidden","visible","hidden","hidden"]);
  }else if(screen == "bracket"){
    changeClassName(screenSections,["hidden","hidden","visible","hidden"]);
  }else if(screen == "winner"){
    changeClassName(screenSections,["hidden","hidden","hidden","visible"])
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
  if(screenState == "join")
  {
    killCheckForNewPlayers();
  }
  if(screenState == "bracket")
  {
    saveTournamentState();
    killListenForCurrentBracketUpdates()
  }
  killTimer();

  isTourOver = ""
  screenState = "home";
  transition(screenState);
}

function killCheckForNewPlayers(){

  updatePlayersRef.off();
}


function viewTour(key){
  screenState = "join";
  currentJoinKey = key;
  transition(screenState);
  loadTournament(key);
  listenForNewPlayers(key);
}
function viewWin(){
  screenState = "winner";
  transition(screenState);
  
}
function viewBracket(key){
  if(isConnected == true){
    currentBracketKey = key;
    screenState = "bracket";
    transition(screenState);
    loadBracket(key);
  }else{
    alert("You are not connected to the internet.")
  }
}

// Time/DOM Code

$(function() {

  $( "#datepicker" ).datepicker({ minDate: 1});
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
        generateBracket(currentJoinKey);
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
  if (selectedDate <= now) {
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

function finishTournament(){
    killListenForCurrentBracketUpdates();
    if(isTourOver === false){
      var d = new Date();
      var temp = new Date(d.setDate(d.getDate() + 1));
      var m = temp.getMonth()+1;
      var d = temp.getDate();
      var y = temp.getFullYear();
      var endDate = m +"/" +d +"/"+ y;
      var updateStartRef = database.ref(details_firebase_route+tournament_firebase_route+ currentBracketKey);
      var updates = {};
      updates['/tourOver'] = true;
      updates['/date'] = endDate;
      updateStartRef.update(updates);
    }
}

// Tournament has started code

function hasStarted(data, key){
    if(checkPastStartDate(data.date))
    {
      if(data.tourString == "")
      {
        generateBracket(key);
      }
      return true;
    }
    return false;
}

function generateBracket(key){
  currentBracketKey = key;
  var playerArray = [];
  var tempRef = database.ref(details_firebase_route + tournament_firebase_route + key + "/" + players_firebase_route)
  tempRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(data1){
        playerArray.push(data1.val().name);
    });
      makeModel(playerArray);
      startTournament(myDiagram.model.toJSON(),key);
      }, function(error) {
    // The Promise was rejected.
    console.error(error);
    console.log("Failed to load list of players")
  });
}

function startTournament(tString, key){
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
        isTourOver = data.val().tourOver;
        displayBracket(data.val().tourString,key);
      }
    })
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
    console.log("Tournament failed to initialize")
  });
}

function displayBracket(dataString,key){
  var bracketString = JSON.parse(dataString);
  updateModel(bracketString.nodeDataArray);
  listenForCurrentBracketUpdates(key)
}

function updateOpenTour(name,date,key){
  var $button = $('<button/>', {
    type: 'button',
    id: key,
    text: 'Join',
    class: 'inlineButton',
    click: function() {
      viewTour(this.id)
    }
  }); 
  $button.appendTo('#listOpen');
  $("#listOpen").append('<li><span class="openTourneyName">' + name + "</span><br><span class='startDateLabel'>Start Date: </span> <span class='startDate'> " + date+ '</span></li><br>')
}


function updateClosedTour(name,key, finished){
  var $button = $('<button/>', {
    type: 'button',
    id: key,
    text: 'View',
    click: function() {
      viewBracket(this.id)
    }
  });
  $button.appendTo('#listClosed');
  $("#listClosed").append('<li>' + name + '</li><br>')
}


document.getElementById("playerName")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("enter").click();
    }
});
