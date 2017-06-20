           var anActualVariableName = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =
      anActualVariableName(go.Diagram, "myDiagramDiv",  // create a Diagram for the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,  // center the content
          "textEditingTool.starting": go.TextEditingTool.SingleClick,
          "textEditingTool.textValidation": isValidScore,
          layout: anActualVariableName(go.TreeLayout, { angle: 180 }),
          "undoManager.isEnabled": true
        });
    // validation function for editing text
    function isValidScore(textblock, oldstr, newstr) {
      if (newstr === "") return true;
      var num = parseInt(newstr, 10);
      return !isNaN(num) && num >= 0 && num < 1000;
    }
    // define a simple Node template
    myDiagram.nodeTemplate =
      anActualVariableName(go.Node, "Auto",
        { selectable: false },
        anActualVariableName(go.Shape, "Rectangle",
          { fill: '#8C8C8C', stroke: null },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")),
        anActualVariableName(go.Panel, "Table",
          anActualVariableName(go.RowColumnDefinition, { column: 0, separatorStroke: "black" }),
          anActualVariableName(go.RowColumnDefinition, { column: 1, separatorStroke: "black", background: "#BABABA" }),
          anActualVariableName(go.RowColumnDefinition, { row: 0, separatorStroke: "black" }),
          anActualVariableName(go.RowColumnDefinition, { row: 1, separatorStroke: "black" }),
          anActualVariableName(go.TextBlock, "",
            { row: 0,
              wrap: go.TextBlock.None, margin: 5, width: 90,
              isMultiline: false, textAlign: 'left',
              font: '10pt  Segoe UI,sans-serif', stroke: 'white' },
            new go.Binding("text", "player1").makeTwoWay()),
          anActualVariableName(go.TextBlock, "",
            { row: 1,
              wrap: go.TextBlock.None, margin: 5, width: 90,
              isMultiline: false, textAlign: 'left',
              font: '10pt  Segoe UI,sans-serif', stroke: 'white' },
            new go.Binding("text", "player2").makeTwoWay()),
          anActualVariableName(go.TextBlock, "",
            { column: 1, row: 0,
              wrap: go.TextBlock.None, margin: 2, width: 25,
              isMultiline: false, editable: true, textAlign: 'center',
              font: '10pt  Segoe UI,sans-serif', stroke: 'black' },
            new go.Binding("text", "score1").makeTwoWay()),
          anActualVariableName(go.TextBlock, "",
            { column: 1, row: 1,
              wrap: go.TextBlock.None, margin: 2, width: 25,
              isMultiline: false, editable: true, textAlign: 'center',
              font: '10pt  Segoe UI,sans-serif', stroke: 'black' },
            new go.Binding("text", "score2").makeTwoWay())
        )
      );
    // define the Link template
    myDiagram.linkTemplate =
      anActualVariableName(go.Link,
        { routing: go.Link.Orthogonal,
          selectable: false },
        anActualVariableName(go.Shape, { strokeWidth: 2, stroke: 'white' }));
    // Generates the original graph from an array of player names
    function createPairs(players) {
      if (players.length % 2 !== 0) players.push('(empty)');
      var startingGroups = players.length / 2;
      var currentLevel = Math.ceil(Math.log(startingGroups) / Math.log(2));
      var levelGroups = [];
      var currentLevel = Math.ceil(Math.log(startingGroups) / Math.log(2));
      for (var i = 0; i < startingGroups; i++) {
        levelGroups.push(currentLevel + '-' + i);
      }
      var totalGroups = [];
      makeLevel(levelGroups, currentLevel, totalGroups, players);
      return totalGroups;
    }
    function makeLevel(levelGroups, currentLevel, totalGroups, players) {
      currentLevel--;
      var len = levelGroups.length;
      var parentKeys = [];
      var parentNumber = 0;
      var p = '';
      for (var i = 0; i < len; i++) {
        if (parentNumber === 0) {
          p = currentLevel + '-' + parentKeys.length;
          parentKeys.push(p);
        }
        if (players !== null) {
          var p1 = players[i*2];
          var p2 = players[(i*2) + 1];
          totalGroups.push({
            key: levelGroups[i], parent: p, player1: p1, player2: p2, parentNumber: parentNumber
          });
        } else {
          totalGroups.push({ key: levelGroups[i], parent: p, parentNumber: parentNumber });
        }
        parentNumber++;
        if (parentNumber > 1) parentNumber = 0;
      }
      // after the first created level there are no player names
      if (currentLevel >= 0) makeLevel(parentKeys, currentLevel, totalGroups, null)
    }
    function makeModel(players) {
      var model = new go.TreeModel(createPairs(players));
      model.addChangedListener(function(e) {
        if (e.propertyName !== 'score1' && e.propertyName !== 'score2') return;
        var data = e.object;
        if (isNaN(data.score1) || isNaN(data.score2)) return;
        var parent = myDiagram.findNodeForKey(data.parent);
        if (parent === null) return;
        var playerName = parseInt(data.score1) > parseInt(data.score2) ? data.player1 : data.player2;
        if (parseInt(data.score1) === parseInt(data.score2)) playerName = "";
        myDiagram.model.setDataProperty(parent.data, (data.parentNumber === 0 ? "player1" : "player2"), playerName);
      });
      myDiagram.model = model;
    }