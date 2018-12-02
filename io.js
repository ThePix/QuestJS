    // ============  Output  =======================================
    
    var nextid = 0;
    msg = function(s, cssClass) {
      if (cssClass == undefined) {
        $('#output').append('<p id="n' + nextid + '">' + s + '</p>');
      }
      else {
        $('#output').append('<p id="n' + nextid + '" class="' + cssClass + '">' + s + '</p>');
      }
      nextid++;
    };
    metamsg = function(s) {
      $('#output').append('<p id="n' + nextid + '" class="meta">' + s + '</p>');
      nextid++;
    };
    errormsg = function(errno, s) {
      $('#output').append('<p id="n' + nextid + '" class="error"><span class="error' + errno + '">' + s + '</span></p>');
      nextid++;
    };
    debugmsg = function(dbgno, s) {
      $('#output').append('<p id="n' + nextid + '" class="debug"><span class="debug' + dbgno + '">' + s + '</span></p>');
      nextid++;
    };
    heading = function(level, s) {
      $('#output').append('<h' + level + ' id="n' + nextid + '">' + s + '</h' + level + '>');
      nextid++;
    };
    
    
    
    
    // ============  Input  =======================================
    
    
    
    
    
    
    
    var clicksDisabled = false;
    
    clickExit = function(dir) {
      if (clicksDisabled) return;
      
      startTurn("Go " + dir);
      dir = dir.toLowerCase();
      if (['look', 'help', 'wait'].includes(dir)) {
        simpleCommands[dir]();
      }
      else {
        msg("Heading " + dir);
        currentRoom = findInData(player.loc);
        
        if (!(dir in currentRoom)) {
          errormsg(1, "Unsupported direction '" + dir + "' for location")
        }
        else {
          ex = currentRoom[dir];
          if (typeof ex == 'string') {
            setRoom(ex)
          }
          else if (typeof ex === "function"){
            ex(currentRoom);
          }
          else if (typeof ex === "object"){
            var fn = ex['use'];
            fn(ex);
          }
          else {
            errormsg(1, "Unsupported type for direction")
          }
        }
      }
      endTurn();
    };
    
    clickAction = function(action) {
      if (clicksDisabled) return;

      startTurn(action);
      debugmsg(3, "Trying to do " + action)
      if (typeof simpleCommands[action] === "function"){
        simpleCommands[action]();
      }
      else {
        errormsg(1, "Unsupported action")
      }
      endTurn();
    };
    
    clickItem = function(itemName) {
      if (clicksDisabled) return;

      for (var i = 0; i < currentItemList.length; i++) {
        if (currentItemList[i] == itemName) {
          $('.' + currentItemList[i] + '-actions').toggle();
        }
        else {
          $('.' + currentItemList[i] + '-actions').hide();
        }
      }
    };
    
    clickItemAction = function(itemName, action) {
      if (clicksDisabled) return;

      var item = findInData(itemName);
      action = action.toLowerCase();
      startTurn(action + " with " + item['name']);
      if (!(action in item)) {
        errormsg(1, "Unsupported verb '" + action + "' for object")
      }
      else if (typeof item[action] == 'string') {
        msg(item[action])
      }
      else if (typeof item[action] === "function"){
        var fn = item[action];
        fn(item);
        updateUIItems();
      }
      else {
        errormsg(1, "Unsupported type for verb")
      }
      endTurn();
    };    


    
    submitText= function(inputText) {
      parse(inputText.toLowerCase().trim());
    };
    
    
    // ============  UI  =======================================
    
    var currentItemList = [];
    
    
    updateUIItems = function() {
      for (var i = 0; i < inventories.length; i++) {
        $('#' + inventories[i].alt).empty();
      }

      currentItemList = [];
      for (var j = 0; j < data.length; j++) {
        if (data[j].display == VISIBLE) {
          for (var i = 0; i < inventories.length; i++) {
            if (inventories[i].test(data[j])) {
              _appendItem(data[j], inventories[i].verbs, inventories[i].alt);
            }
          }
        }
      }
      clickItem('');
    };
    
    _appendItem = function(item, attName, htmlDiv) {
      $('#' + htmlDiv).append('<p class="item" onclick="clickItem(\'' + item.name + '\')">' + item.name + '</p>');
      currentItemList.push(item.name);
      if (item[attName]) {
        for (var j = 0; j < item[attName].length; j++) {
          $('#' + htmlDiv).append('<div class="' + item.name + '-actions"><p class="itemaction" onclick="clickItemAction(\'' + item.name + '\', \'' + item[attName][j] + '\')">' + item[attName][j] + '</p></div>');
        }
      }
      else {
        errormsg(1, "No " + attName + " for " + item.name );
      }
    };
    
    
    
    updateUIExits = function(room) {
      for (var i = 0; i < exits.length; i++) {
        if (exits[i].name in room || ['look', 'help', 'wait'].includes(exits[i].name)) {
          $('#exit' + exits[i].name).show();
        }
        else {
          $('#exit' + exits[i].name).hide();
        }
      }
    };

    
    
    
    var menuStartId;
    var menuFn;
    var menuOptions;
    
    showMenu = function(title, options, fn) {
      menuStartId = nextid;
      menuFn = fn;
      menuOptions = options;
      clicksDisabled = true;
      $('#textbox').prop('disabled', true);
      msg(title, 'menutitle');
      for (var i = 0; i < options.length; i++) {
        msg('<a class="menuoption" onclick="menuResponse(' + i + ')">' + options[i] + '</a>');
      }
    };

    menuResponse = function(n) {
      clicksDisabled = false;
      $('#textbox').prop('disabled', false);
      for (var i = menuStartId; i < nextid; i++) {
        $('#n' + i).remove();
      }
      menuFn(menuOptions[n]);
    };
    
    
    clearScreen = function() {
      for (var i = 0; i < nextid; i++) {
        $('#n' + i).remove();
      }
    };
      
      
    
    
    
    
    