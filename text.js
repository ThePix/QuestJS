processtext = function(str, params) {
  return tp.processtext(str, params);
}


// Use this to add you custom text processor
// Should take a string array as a parameter (the input text,
// excluding the curly braces, name and colon),
// and return a string.
addTPDirective = function(name, fn) {
  tp.text_processors[name] = fn;
}


var tp = {};
  
tp.processtext = function(str, params) {
  s = tp.findFirstToken(str);
  if (s) {
    arr = s.split(":");
    var left = arr.shift();
    str = str.replace("{" + s + "}", tp.text_processors[left](arr, params));
    str = tp.processtext(str, params);
  }
  return str;
}

// Find the first token. This is the first to end, so
// we get nested.
tp.findFirstToken = function (s) {
  var end = s.indexOf("}");
  if (end == -1) { return false; }
  var start = s.lastIndexOf("{", end);
  if (start == -1) { return "ERROR!"; }
  return s.substring(start + 1, end);
}



tp.text_processors = {
  i:function(arr, params) { return "<i>" + arr.join(":") + "</i>"; },
  b:function(arr, params) { return "<b>" + arr.join(":") + "</b>"; },
  u:function(arr, params) { return "<u>" + arr.join(":") + "</u>"; },
  s:function(arr, params) { return "<strike>" + arr.join(":") + "</strike>"; },
  colour:function(arr, params) {
    var c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  },
  color:function(arr, params) {
    var c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  },
  back:function(arr, params) {
    var c = arr.shift();
    return '<span style="background-color:' + c + '">' + arr.join(":") + "</span>"; 
  },
  random:function(arr, params) {
    return arr[Math.floor(Math.random()*arr.length)];
  },
  show:function(arr, params) {
    var name = arr.shift();
    var obj = name == "player" ? player : getObject(name);
    if (!obj) { return "TP-ERROR: object not found"; }
    name = arr.shift();
    var val = obj[name];
    if (typeof val == "function") {
      return val();
    } else {      
      return val;
    }
  },
  if:function(arr, params) {
    var name = arr.shift();
    var obj = name == "player" ? player : getObject(name);
    if (!obj) { return "TP-ERROR: object not found"; }
    name = arr.shift();
    return obj[name] ? arr[0] : arr[1];
  },
  img:function(arr, params) {
    return '<img src="images/' + arr[0] + '" title="' + arr[1] + '" alt="' + arr[2] + '"/>'; 
  },
}