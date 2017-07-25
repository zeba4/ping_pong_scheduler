function viewWin(){
  screenState = "winner";
  transition(screenState);
}
function addWinnerNameToHtml(teamName,winningTeamName, date) {
    var str ='<tr><td>' + teamName + '</td><td>' + winningTeamName + '</td><td>' + date + '</td></tr>';
    $("#winnerRow").append(str);
}
