"use strict"

/**
 * @DOC
 * 
 * item_links library
 * Version 0.7
 * 
 * by KV
 * 
 * for QuestJS v0.4
 * 
 * @UNDOC
 */

/*
 * TODO:
 * 
 * 1. I need to set it up so each item handles its own contents listing,
 *    but I can't figure out how to do that without messing with lang.getName.
 *  
 */

settings.linksEnabled = true

// This keeps the verb links updated.
const itemLinks = {};
io.modulesToUpdate.push(itemLinks);
itemLinks.update = function() {
	if(settings.linksEnabled){
		if(settings.debugItemLinks) {
			console.info("running itemLinks.update() to update verbs . . .");
		}
		updateAllItemLinkVerbs();
		updateExitLinks();
	}
};

function updateAllItemLinkVerbs(){
	let verbEls = $("[link-verb]");
	Object.keys(verbEls).forEach(i => {
		let el = verbEls[i];
		let objName = $(el).attr("obj");
		if (!objName) return;
		let obj = w[objName];
		updateItemLinkVerbs(obj);
	})
}

function updateItemLinkVerbs(obj){
	// TODO Check if item is in scope.  If not, disable it!
	let oName = obj.name;
	if (!obj.scopeStatus) {
		disableItemLink($(`[obj="${oName}"]`));
		return;
	}
	enableItemLinks($(`[obj="${oName}"]`));
	let id = obj.alias || obj.name;
	let el = $(`[obj='${oName}-verbs-list-holder'`);
	let endangered = el.hasClass("endangered-link") ? "endangered-link" : "";
	let newVerbsEl = getVerbsLinks(obj, endangered);
	el.html(newVerbsEl);
}

function getArticle(item, type){
	if (!type) return false;
	return type === DEFINITE ? lang.addDefiniteArticle(item) : lang.addIndefiniteArticle(item);
}

function getDisplayAliasLink(item, options, cap){
	let art = false;
	if (options) art = options.article
	let article = getArticle(item, art)
	if (!article) {
		article = '';
	}
	let s = article + getItemLink(item);
	s = s.trim();
	return s;
}

// Used by npcs and containers.
// TODO: Learn about name modifiers, because this code may be reinventing the wheel.
function handleExamineHolder(params){
	let obj = parser.currentCommand.objects[0][0];
	if (!obj) return;
	if (!obj.container && !obj.npc) return;
	if (obj.container) {
		if (!obj.closed || obj.transparent) {
			let contents = obj.getContents();
			contents = contents.filter(o => !o.scenery)
			if (contents.length <= 0){
				return;
			}
			let pre = obj.contentsType === 'surface' ? lang.on_top : lang.inside;
			pre = sentenceCase(pre);
			let subjVerb = processText("{pv:pov:see}", {pov:game.player});
			pre += `, ${subjVerb} `;
			contents = settings.linksEnabled ? getContentsLink(obj) : contents;
			msg(`${pre}${contents}.`);
		}
	} else {
		let contents =  getAllChildrenLinks(obj)
		if (contents == 'nothing') return;
		let pre = processText('{pv:char:be:true} ' + lang.carrying, {char:obj});
		//contents = formatList(contents,{modified:true,doNotSort:true,lastJoiner:'and'});
		msg(`${pre} ${contents}.`);
	}
}

// Used for containers. (NPCs use getAllChildrenLinks.)
// (This should read "getContentsLinks", but I'm not rewriting all the other code to correct it.)
function getContentsLink(o) {
  let s = '';
  const contents = o.getContents(world.LOOK);
  if (contents.length > 0 && (!o.closed || o.transparent)) {
    if (!o.listContents) {
		return getAllChildrenLinks(o);
	}
	s = o.listContents(world.LOOK);
  }
  return s
}

function canHold(obj){
	return ( obj.container && ( !obj.closed || obj.transparent ) ) || obj.npc;
}

function getDirectChildren(item){
	if (!item.getContents) return [];
	return item.getContents(item);
}

function hasChildren(item){
	return item.getContents(item).length > 0;
}

function getAllChildren(item, isRoom=false){
	let result = [];
	let children = getDirectChildren(item);
	if (isRoom){
		children = children.filter(o =>o != game.player);
	}
	if (children.length < 1) return [];
	children.forEach(child => {
		result.push(child);
		// Added the check on the next line due to occasional errors.
		let grandchildren = child.getContents ? child.getContents(child) : [];
		if (grandchildren.length > 0){
			result.push(getAllChildren(child));
		}
	})
	return result;
}

function getRoomContents(room){
	let result = [];
	let children = getAllChildren(room, true);
	if (children.length < 1) return [];
	children.forEach(child => {
		//console.log(child);
		result.push(child);
		// Added the check on the next line due to occasional errors.
		let grandchildren = child.getContents ? child.getContents(child) : [];
		if (grandchildren.length > 0){
			result.push(getAllChildren(child));
		}
	})
	return result;
}

// Used for NPCs. (Containers use getContentsLink.)
function getAllChildrenLinks(item){
	let kids = getDirectChildren(item);
	kids = kids.map(o => lang.getName(o,{modified:true,article:INDEFINITE}));
	return formatList(kids,{doNotSort:true, lastJoiner:lang.list_and, nothing:lang.list_nothing});
}

function getItemLink(obj, id='_DEFAULT_', capitalise=false){
	if(!settings.linksEnabled){
		var s = obj.alias || obj.name;
		return s;
	}
	var oName = obj.name;
	if (id === '_DEFAULT_'){
		 id = obj.alias || obj.name;
	}
	id = capitalise ? sentenceCase(id) : id;
	var dispAlias = lang.getNameOG(obj);
	var s = `<span class="object-link dropdown">`; 

	s +=`<span onclick="toggleDropdown($(this).next())" obj="${oName}" `+
	`class="droplink" name="${oName}-link">${id}</span>`;

	s += `<span obj="${oName}" class="dropdown-content">`;

	s += `<span obj="${oName}-verbs-list-holder">`;
	s += getVerbsLinks(obj);
	s += `</span></span></span>`;
	return s;
}

function getVerbsLinks(obj){
	let verbArr = obj.getVerbs();
	let oName = obj.name;
	let id = obj.alias || obj.name;
	let s = ``;
	if (verbArr.length>0){
		verbArr.forEach (o=>{
			o = sentenceCase(o);
			s += `<span class="list-link-verb" `+
			`onclick="$(this).parent().parent().toggle();handleObjLnkClick('${o} '+$(this).attr('obj-alias'),this,'${o}','${id}');" `+
			`link-verb="${o}" obj-alias="${id}" obj="${oName}">${o}</span>`;
		})
	}
	return s;
}

function toggleDropdown(element) {
    $(element).toggle();
    var disp = $(element).css('display');
    let newDisp = disp === 'none' ? 'block' : 'block';
    $(element).css('display', newDisp);
    
}
 
function handleObjLnkClick(cmd,el,verb,objAlias){
	enterButtonPress(cmd);
}

function disableItemLink(el){
	let type = ''
	if ($(el).hasClass("dropdown")) type = 'dropdown'
	if ($(el).hasClass("droplink")) type = 'droplink' 
	$(el).addClass(`disabled disabled-${type}`).attr("name","dead-droplink").removeClass(type).css('cursor','default');
}

function enableItemLinks(el){
	let type = '';
	if ($(el).hasClass("disabled-dropdown")) type = 'dropdown'
	if ($(el).hasClass("disabled-droplink")) type = 'droplink'
	$(el).removeClass("disabled").removeClass(`disabled-${type}`).addClass(type).attr("name",$(el).attr("obj")).css("cursor","pointer");
}

function enterButtonPress(cmd){
	//Calling this function with no arg will cause s to default to the text in the textbox.
	if(cmd) $('#textbox').val(cmd);
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
}


function updateExitLinks(){
	const exits = util.exitList();
	let link = $(`.exit-link`);
	if (link.length > 0){
		Object.values(link).forEach(el => {
			let dir = $(el).attr('exit');
			if (!dir) return
			let ind = exits.indexOf(dir);
			if (ind < 0) {
				$(el).addClass("disabled")
				el.innerHTML = dir;
			} else {
				$(el).removeClass("disabled");
				el.innerHTML = processText(`{cmd:${dir}}`);
			}
		})
	}
}

//------
// MODS
//------

// MODDED for item links
util.listContents = function(situation, modified = true) {
  let objArr = getAllChildrenLinks(this);
 return objArr
};

// MOD!!!
findCmd('Inv').script = function() {
  if (settings.linksEnabled) {
	  //listOfOjects = listOfOjects.map(o => getDisplayAliasLink(o, {article:INDEFINITE}))
	  msg(lang.inventoryPreamble + " " + getAllChildrenLinks(game.player) + ".");
	  return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
  }
  let listOfOjects = game.player.getContents(world.INVENTORY);
  msg(lang.inventoryPreamble + " " + formatList(listOfOjects, {lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:game.player.name}) + ".");
  return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
};

// Keep the original getName, but rename it
lang.getNameOG = lang.getName;

// MOD!!!
lang.getName = (item, options) => {
    if (!settings.linksEnabled) {
		return lang.getNameOG(item, options);
	}
	if (!options) options = {}
    if (!item.alias) item.alias = item.name
    let s = ''
    let count = options[item.name + '_count'] ? options[item.name + '_count'] : false
    if (!count && options.loc && item.countable) count = item.countAtLoc(options.loc)

    if (item.pronouns === lang.pronouns.firstperson || item.pronouns === lang.pronouns.secondperson) {
      s = options.possessive ? item.pronouns.poss_adj : item.pronouns.subjective;
      s += util.getNameModifiers(item, options); // ADDED by KV
      return s; // ADDED by KV
    }

    else {    
      if (count && count > 1) {
        s += lang.toWords(count) + ' '
      }
      //else if (!settings.linksEnabled && options.article === DEFINITE) {
        //s += lang.addDefiniteArticle(item)
      //}
      //else if (!settings.linksEnabled && options.article === INDEFINITE) {
        //s += lang.addIndefiniteArticle(item, count)
      //}
      if (item.getAdjective) {
        s += item.getAdjective()
      }
      if (!count || count === 1) {
        s += item.alias
      }
      else if (item.pluralAlias) {
        s += item.pluralAlias
      }
      else {
        s += item.alias + "s"
      }
      if (options.possessive) {
        if (s.endsWith('s')) {
          s += "'"
        }
        else { 
          s += "'s"
        }
      }
    }
    let art = getArticle(item, options.article);
    if (!art) art = '';
    let cap = options && options.capital;
    //log (art)
    //log (cap)
   // log (options)
    if (!item.room) s = getItemLink(item, s, cap);
    s = art + s;
    s += util.getNameModifiers(item, options);
    return s;
};

// Added exit links.  Added this class to css to underline.
tp.text_processors.exits = function(arr, params) {
  let elClass = settings.linksEnabled ? `-link` : ``;
  const list = [];
  util.exitList().forEach(exit => {
	  let s = settings.linksEnabled ? `{cmd:${exit}}` : `${exit}`;
	  let el = processText(`<span class="exit${elClass}" exit="${exit}">${s}</span>`);
	  list.push(el);
  })
  return formatList(list, {lastJoiner:lang.list_or, nothing:lang.list_nowhere});
}


//----------------
// END OF MODS
//----------------


//Capture clicks for the objects links
settings.clickEvents = [{one0:`<span>_PLACEHOLDER_</span>`}];
window.onclick = function(event) {
	if (!event.target.matches('.droplink')) {
		$(".dropdown-content").hide();
	}else{
		settings.clickEvents.unshift(event.target);
		if (typeof(settings.clickEvents[1].nextSibling)!=='undefined' &&  settings.clickEvents[1].nextSibling!==null){
			if (settings.clickEvents[1] !== event.target && settings.clickEvents[1].nextSibling.style.display==="block" && event.target.matches('.droplink')){
				$(".dropdown-content").hide();
				event.target.nextSibling.style.display="block";
			}
		}
	}
}


log("loaded")
