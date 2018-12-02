
    // ============  Utilities  =======================================
    
    
    
    function sentenceCase (str) {
      return str.replace(/[a-z]/i, function (letter) {
        return letter.toUpperCase();
      }).trim();
    }

    

    currentItem = null;
    

    
    
    VISIBLE = 0;
    SCENERY = 1;
    HIDDEN = 2;
    OFFSTAGE = 3;
    INVISIBLE = 4;
    
    
    isPlayer = function(item) {
      return item['player'];
    }
    
    findInData = function(name) {
      var found = data.find(function(element) {
        return element['name'] == name;
      });
      return found;
    }
    
    setRoom = function(roomName) {
      room = findInData(roomName);
      if (room === undefined) {
        return "Failed to find room '" + roomName + "'.";
      }
      //clearScreen();
      player.loc = room.name;
      heading(4, room['name']);
      itemAction(room, 'examine');
      updateUIExits(room);
      updateUIItems();
    };
    
    itemAction = function(item, action) {
      if (!(action in item)) {
        errormsg(1, "Unsupported verb '" + action + "' for object")
      }
      else if (typeof item[action] == 'string') {
        msg(item[action])
      }
      else if (typeof item[action] === "function"){
        var fn = item[action];
        fn(item);
        updateHtml();
      }
      else {
        errormsg(1, "Unsupported type for verb")
      }
    };    
    
    
    
    
    isPresent = function(item) {
      return item.loc == player.loc || item.loc == player.name;
    };
    
    
    var suppressTurnScripts;
    var commandFailed;
    var player;
    
    init = function() {
      debugmsg(5, "Beginning startGame");
      // Housekeeping...
      player = data.find(isPlayer);
      if (typeof player == "undefined") {
        errormsg(9, "No player object found. This will not go well...");
      }
      currentRoom = findInData(player['loc']);
      if (typeof currentRoom == "undefined") {
        errormsg(9, "No room object found (looking for '" + player['loc'] + "'). This will not go well...");
      }
      data.forEach(function (el) {
        if (!el['alias']) {
          el['alias'] = el.name;
        }
        el.name = el.name.replace(/\W/g, '');
        if (el['loc'] == 'Held') {
          el['loc'] = player.name;
        }
        else if (el['loc'] == 'Worn') {
          el['loc'] = player.name;
          el['worn'] = true;
        }
      });
      debugmsg(5, "Done");
    }
    
    startTurn = function(s) {
      debugmsg(5, s);
      suppressTurnScripts = false;
      commandFailed = false;
    };
    
    endTurn = function() {
      debugmsg(5, "... done (failed=" + commandFailed + ")");
      if (!suppressTurnScripts && !commandFailed) {
        RunTurnScripts();
      }
      setTimeout("window.scrollTo(0,document.getElementById('main').scrollHeight);",1);
    };
    
    
    RunTurnScripts = function() {
      debugmsg(5, "Running turnscripts");
      for (var i = 0; i < data.length; i++) {
        if (typeof data[i]['run'] === "function"){
          if ((('loc' in data[i]) && IsPresent(data[i])) || !('loc' in data[i])) {
            data[i]['run']();
          }
        }
      }
      debugmsg(5, "... turnscripts done");
    };

    
    
    