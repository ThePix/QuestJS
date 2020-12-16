"use strict"


//====================
// OBJECT LINKS LIB  |
//====================
// by KV             |
//====================
// for QuestJS v 0.3 |
//====================
// Version 1         |
//====================

/*
 * IMPORTANT!!!
 * ------------
 * 
 * Make sure you have modifed DEFAULT_ROOM.description and placed the code block in the
 * code so the changes are loaded BEFORE ANY ROOMS ARE CREATED during game load!!!
 * 
 * Normally, this should go in data.js, above any code that creates any rooms.
 * 
 * Here is the code:
------------------------------------------------------------------

// CODE BEGINS
*/
DEFAULT_ROOM.description = function() {
    if (game.dark) {
      printOrRun(game.player, this, "darkDesc");
      return true;
    }
    if(settings.linksEnabled){
		disableExistingObjectLinks()
	}
    for (let line of settings.roomTemplate) {
      msg(line);
    }
    return true;
}



//============================================================================


//Capture clicks for the objects links
settings.clickEvents = [{one0:`<span>_PLACEHOLDER_</span>`}]
window.onclick = function(event) {
	if (!event.target.matches('.droplink')) {
		$(".dropdown-content").hide();
	}else{
		settings.clickEvents.unshift(event.target)
		if (typeof(settings.clickEvents[1].nextSibling)!=='undefined' &&  settings.clickEvents[1].nextSibling!==null){
			if (settings.clickEvents[1] !== event.target && settings.clickEvents[1].nextSibling.style.display==="inline" && event.target.matches('.droplink')){
				$(".dropdown-content").hide();
				event.target.nextSibling.style.display="inline"
			}
		}
	}
}


//===================================

// SETTINGS

settings.roomTemplate = [
  "{hereDesc}",
  "{objectsHere:You can see {objectsLinks} here.}",
  "{exitsHere:You can go {exits}.}",
]

settings.linksEnabled = true


// Make it easy to find a command's opposite
settings.cmdOpps = {
	"Switch on":"Switch off",
	"Switch off":"Switch on",
	"Take":"Drop",
	"Drop":"Take",
	"Wear":"Remove",
	"Remove":"Wear",
	"Open":"Close",
	"Close":"Open",
}

// END OF SETTINGS


// TURNSCRIPT

createItem("updateDropdownVerblists_Turnscript",{
	eventPeriod:1,
	eventActive:true,
	eventScript:()=>{
		if(settings.linksEnabled){
			updateDropdownVerblists()
		}else{
			w.updateDropdownVerblists_Turnscript.eventActive = false
		}
	},
})



//===========================
// TEXT PROCESSOR ADDITIONS |
//===========================

tp.text_processors.objectsHereLinks = function(arr, params) {
  let listOfOjects = scopeHereListed().map(o => getObjectLink(o,true))
  return listOfOjects.length === 0 ? "" : arr.join(":")
}

tp.text_processors.objectsLinks = function(arr, params) {
  let objArr = scopeHereListed().map(o => getObjectLink(o,true))
  return formatList(objArr, {article:INDEFINITE, lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:game.player.loc})
}

tp.text_processors.objectLink = function(obj, params) {
	return getObjectLink(w[obj[0]],false,false)
}

//=================================
// END OF TEXT PROCESSOR ADDITIONS |
//==================================



// FUNCTIONS
// ---------




function getDisplayAlias(obj,art=INDEFINITE){
	return lang.getName(obj,{article:art})
}




function enterButtonPress(cmd){
	//Calling this function with no arg will cause s to default to the text in the textbox.
	if(cmd) $('#textbox').val(cmd)
	const s = $('#textbox').val();
    io.msgInputText(s); //This emulates printing the echo of the player's command
    if (s) {
		if (io.savedCommands[io.savedCommands.length - 1] !== s) {
			io.savedCommands.push(s);
        }
        io.savedCommandsPos = io.savedCommands.length;
        parser.parse(s);
        $('#textbox').val('');
	}
};

function clickedCmdLink(s){
	if (s) {
		if (io.savedCommands[io.savedCommands.length - 1] !== s) {
		  io.savedCommands.push(s);
		}
		io.savedCommandsPos = io.savedCommands.length;
	}
}

function getObjectLink(obj,isScopeHere=false,addArticle=true){
	//if isScopeHere is sent true, this is for a room description!
	if(settings.linksEnabled){
		var roomClass = isScopeHere ? "room-desc" : ""
		var oName = obj.name
		var id = obj.alias || obj.name;
		var prefix = "";
		if (obj.prefix){
			prefix = obj.prefix+" ";
		}
		var dispAlias = getDisplayAlias(obj)
		if (addArticle) {prefix = dispAlias.replace(obj.alias,'')}
		disableObjectLink($(`[obj="${oName}"]`))
		var s = prefix+`<span class="object-link dropdown ${roomClass}">`;
		s +=`<span onclick="toggleDropdown($(this).attr('obj'))" obj="${oName}" class="droplink ${roomClass}" name="${oName}-link">${id}</span>`;
		s += `<span id="${oName}" class="dropdown-content ${roomClass}">`;
		let verbArr = obj.getVerbs()
		if (verbArr.length>0){
			verbArr.forEach (o=>{
				o = sentenceCase(o)
				s += `<span class="${roomClass}" onclick="$(this).parent().toggle();handleObjLnkClick('${o} '+$(this).attr('obj-alias'),this,'${o}','${id}');" link-verb="${o}" obj-alias="${id}" obj="${oName}">${o}</span>`;
			})
		}
		s += "</span></span>";
		return s;
	}else{
		var s = obj.alias || obj.name;
		return s
	}
};

function toggleDropdown(element) {
    $("#"+element+"").toggle();
}
 
function handleObjLnkClick(cmd,el,verb,objAlias){
	parser.msg("handleObjLnkClick:  Handling object link click . . .")
	parser.msg("cmd: "+cmd)
	parser.msg("verb: "+verb)
	parser.msg("objAlias: "+objAlias)
	parser.msg("Sending to enterButtonPress . . .")
	enterButtonPress(cmd)
}

function updateDropdownVerblists(){
	//parser.debug = true
	let verbEls = $("[link-verb]")
	Object.keys(verbEls).forEach(i => {
		let el = verbEls[i]
		//if(parser.debug) {
			//console.log("verbEls"); 
			//console.log(typeof(verbEls));
			//console.log(verbEls);
			//console.log("verbEls[i]");
			//console.log(verbEls[i])
			//console.log("el");
			//console.log(typeof(el));
			//console.log(el);
			//console.log(el[0]);
			//console.log(typeof(el[0]));
		//}
		let verb = $(el).attr("link-verb")
		if(!verb) return
		let verbOpp = settings.cmdOpps[verb] || null
		if(!verbOpp) {
			//if(parser.debug) {console.log("NO opposite for " + verb)}
			return
		}
		//if(parser.debug) {console.log("i:");console.log(i);console.log("el:");console.log(el);console.log("verb:");console.log(verb);console.log("verbOpp");}
		let objName = $(el).attr("obj")
		//if(parser.debug) {console.log("objName:");console.log(objName);console.log("obj:");}
		let obj = w[objName]
		//if(parser.debug) {console.log(obj);var hr = "=======================================";console.log(hr);console.log("Do the verbs match the getVerbs? . . .");console.log(hr);}
		if(!obj.getVerbs) return
		var objGetVerbs = obj.getVerbs()
		//if(parser.debug) {console.log("objGetVerbs:");console.log(objGetVerbs);}
		objGetVerbs.forEach(newVerb => {
			//if(parser.debug) {console.log("Checking getVerbs() for " + objName + " . . .");console.log(newVerb);}
			if (verbOpp != newVerb) return
			//if(parser.debug) {console.log("Found one!");console.log(objName + " needs " + verb  + " changed to " + newVerb + "!");}
			if(!el.parentElement){
				//if(parser.debug){ console.log("No element parent element.  QUITTING!");} 
				return
			}
			//Change the verb to its opposite!
			switchDropdownVerb(el,newVerb,objName)
			//if(parser.debug) {console.log("DONE!")}
			return true
			
		})
	})
}

function switchDropdownVerb(el, newVerb, objName){
	if (!objName) {let objName = $(el).attr("obj")}
	let oldVerb = $(el).attr("link-verb")
	if (!newVerb) {let newVerb = settings.cmdOpps[oldVerb]}
	let str = el.parentElement.innerHTML
	let regexp = new RegExp(oldVerb,'g')
	let repl = str.replace(regexp,newVerb);
	el.parentElement.innerHTML = repl
	$(el).attr("link-verb",newVerb)
	//parser.msg(`Replaced '${oldVerb}' on ${objName} with '${newVerb}'.`)
}

function disableExistingObjectLinks(bool=false){
	//if bool is false, this only disables existing object links printed using the room description function
	//if bool is true, this disables ALL existing object links
	//parser.msg("running disableExistingObjectLinks!")
	//Checks that this doesn't remove "good" links.
	if (bool){
		$(".droplink").removeClass("droplink").css("cursor","default").attr("name","dead-droplink")
		$(".object-link").removeClass("dropdown")
		$(".dropdown").removeClass("dropdown")
		$(".dropdown-content").remove()
	} else {
		$(".room-desc.droplink").removeClass("droplink").css("cursor","default").attr("name","dead-droplink")
		$(".room-desc.object-link").removeClass("dropdown")
		$(".room-desc.dropdown").removeClass("dropdown")
		$(".room-desc.dropdown-content").remove()
	}
}

function disableObjectLink(el){
	let objName = $(el).attr("obj")
	$(el).removeClass("droplink").css("cursor","default").attr("name","dead-droplink")
	$(el).removeClass("dropdown")
	$(el).removeClass("dropdown")
	$(`#${objName}`).remove()
}

