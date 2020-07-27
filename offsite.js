//Generic helpers
function mod(n, m) {
  return ((n % m) + m) % m;
}
var makeCRCTable = function(){
	var c;
	var crcTable = [];
	for(var n =0; n < 256; n++){
		c = n;
		for(var k =0; k < 8; k++){
			c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		}
		crcTable[n] = c;
	}
	return crcTable;
}
var crc32 = function(str) {
	var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
	var crc = 0 ^ (-1);
	for (var i = 0; i < str.length; i++ ) {
		crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
	}
	return (crc ^ (-1)) >>> 0;
};
Math.seed = function(s) {
	return function() {
		s = Math.sin(s) * 10000; return s - Math.floor(s);
	};
};
jQuery.fn.justtext = function() {
  
	return $(this)	.clone()
			.children()
			.remove()
			.end()
			.text();

};
function htmlDecode(input)
{
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
};
function hex2bin(hex){
    var bytes = [];
    for(var i=0; i< hex.length-1; i+=2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;    
};
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
function xorCrypto(keysource,msgsource)
{
	var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
	var decode = "";
	var lenK = keysource.length;
	var lenM = msgsource.length;
	for(var n =0; n < 256 && n < lenM; n++){
		decode+=String.fromCharCode(msgsource[n] ^ mod((keysource[mod(n+document.RCR_Register.AdminOff,lenK)]+mod(crcTable[n],256)),256));
	}
	return decode;
};
function xorCryptoB(keysource,msgstr)
{
	var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
	var decode = [];
	var lenK = keysource.length;
	var lenM = msgstr.length;
	for(var n =0; n < 256 && n < lenM; n++){
		decode[n]=(msgstr.charCodeAt(n) ^ mod((keysource[mod(n+document.RCR_Register.AdminOff,lenK)]+mod(crcTable[n],256)),256));
	}
	return toHexString(decode);
};
var loadJS = function(url, implementationCode, location){
	var scriptTag = document.createElement('script');
	scriptTag.src = url;
	scriptTag.onload = implementationCode;
	scriptTag.onreadystatechange = implementationCode;
	location.appendChild(scriptTag);
};
//NC specific helper
function  RCR_ActivePollData() {
	   var data = [];
        var poll = $("#pollwrap .active");
        var i = 0;

        poll.find("h3, .option").each(function() {
            data[i]=$(this).justtext();
            i++;
        });
	   return data;
};

function RCR_SetPollMenu(data) {
	var pollmenu = $("#pollwrap .poll-menu");
	var newpoll = $("#newpollbtn");
	var newpolloffset = 0;
	if(pollmenu.length == 0){
		newpoll.click();
		pollmenu = $("#pollwrap .poll-menu");
		newpolloffset = 3;
	}
	var addoption = $("#pollwrap .poll-menu button").eq(1);
	var i = 0;
	var skips = 0;
	for (var n = 0; n < data.length-newpolloffset; n++) {
		addoption.click();
	}
	pollmenu.find(".form-control").each(function() {
		if(i==1 || $(this).val() != "") skips++;
		else $(this).val(data[i-skips]);
		 i++;
        });
};

function RCR_Sunset(){
	var hour = 60*60*1000;
	var min = 60*1000;
	var realt = new Date();
	var loclt = new Date(realt.getTime());
	var lhour = loclt.getHours();
	var lmin = loclt.getMinutes();
	if (lhour < 11 && lhour >= 5) {
		RCR_BodyClass("timeA");
	} else if (lhour < 17 && lhour >= 11) {
		RCR_BodyClass("timeB");
	} else if (lhour < 23 && lhour >= 17) {
		RCR_BodyClass("timeC");
	} else {
		RCR_BodyClass("timeD");
	}
	$("#pollwrap").addClass("pollevent");
	setTimeout(RCR_Sunset, (60-lmin)*min);
}
function RCR_BodyClass(nclass){
	if(nclass === document.RCR_Register.BGTimeState)return;
	jQuery("body").removeClass(document.RCR_Register.BGTimeState)
	jQuery("body").removeClass('sunset');
	jQuery("body").addClass(nclass);
	setTimeout(function(){jQuery("body").addClass('sunset');}, 30000);
	document.RCR_Register.BGTimeState = nclass;
}
function RCR_RushiMode(){
	var cwrap = document.getElementById('chatwrap');
	cwrap.className='col-lg-12';
	var vwrap = document.getElementById('videowrap');
	vwrap.className='col-lg-12';
	vwrap.parentElement.appendChild(cwrap);
}
function RCR_EditPoll(){
	RCR_SetPollMenu(RCR_ActivePollData());
}
function RCR_ToggleVideo(){
RCR_VidscreenTurnOn(!document.RCR_Register.SideChannelPon);
}
var RCR_SideChannel = {
	Init: function(){
		var tabOuter = document.createElement("p"); 
			tabOuter.className = "SideChannelOuter";
		var tabMain = document.createElement("span"); 
			tabMain.id = 'RCR_tab_main';
			tabMain.className = "SideChannelTab queue_entry queue_active";
		var tabMainLabel = document.createElement("a");
			tabMainLabel.className = "SideChannelLabel";
			tabMainLabel.onclick = function(){RCR_SideChannel.FocusChan(-1);};
			tabMainLabel.textContent='NiteCrew-Main ';
		var tabMainClose = document.createElement("a");
			tabMainClose.className = "SideChannelClose";
			tabMainClose.textContent='❎';
			tabMainClose.onclick = function(){RCR_SideChannel.CloseChan(-1);};
		tabMain.append(tabMainLabel,tabMainClose);

		var tabSpace = document.createElement("span");
			tabSpace.id = 'RCR_tab_space';
			tabSpace.className="SideChannelFill";
		var tabAdd = document.createElement("span"); 
			tabAdd.className="SideChannelDrop";
		var tabAddDrop = document.createElement("button");
			tabAddDrop.className="SideChannelDropBtn";
			tabAddDrop.textContent='☰';
		var tabAddMenu = document.createElement("div");
			tabAddMenu.id = 'RCR_tab_add';
			tabAddMenu.className="SideChannelMenu";
		tabAdd.append(tabAddDrop,tabAddMenu);
		tabOuter.append(tabMain,tabSpace,tabAdd);
		
		document.getElementById('videowrap').prepend(tabOuter);
		var scAnc = document.createElement("div");
			scAnc.id = 'sidechannelanchor';
		var scCont = document.createElement("div");
			scCont.id = 'sidechannelcontainer';
		scAnc.append(scCont);
		document.getElementById('videowrap').prepend(scAnc);
		
		//Automatic tabs
		RCR_SideChannel.NewChan(0,false,true,'BGMusic');
		
		document.RCR_Register.SideChannelListUpdate = true;
		setTimeout(RCR_SideChannel.List, 5000);
	},
	List: function(){
		if(document.RCR_Register.SideChannelListUpdate == false) return;
		$('#RCR_tab_add').empty();
		var menu = document.getElementById('RCR_tab_add');
		var menuMain = document.createElement("a");
			menuMain.textContent='NiteCrew-Main';
			menuMain.onclick = function(){RCR_SideChannel.OpenChan(-1,"");RCR_SideChannel.FocusChan(-1);};
		menu.append(menuMain);
		for (let chanID in document.RCR_Register.SideChannelList) {
			let scinfo = document.RCR_Register.SideChannelList[chanID];
			var menuSec = document.createElement("a");
				menuSec.textContent='Channel-'+chanID;
				menuSec.className = 'chat-msg-'+scinfo.chanCreator;
				menuSec.onclick = function(){RCR_SideChannel.OpenChan(chanID,scinfo.chanSrc);RCR_SideChannel.FocusChan(chanID);};
			var menuSecCreator = document.createElement("span");
			var menuSecInner = document.createElement("strong");
				menuSecInner.className = 'username';
				menuSecInner.textContent=scinfo.chanCreator+': ';
			menuSecCreator.append(menuSecInner);
	
			var menuSecDesc = document.createElement("span");
				menuSecDesc.textContent=scinfo.chanDesc;
			menuSec.append(menuSecCreator,menuSecDesc);
			menu.append(menuSec);
			RCR_SideChannel.NewChan(chanID,true,false,"");
		}
		document.RCR_Register.SideChannelListUpdate = false;
	},
	NewChan: function(chanid,isleft,islabel,label){
		if(document.getElementById('SideChannel-'+chanid))return;
		var tabSec = document.createElement("span"); 
			tabSec.className = "SideChannelTab";
			tabSec.id= ('SideChannel-'+chanid);
		var tabSecLabel = document.createElement("a");
			tabSecLabel.className = "SideChannelLabel";
			tabSecLabel.onclick = function(){RCR_SideChannel.FocusChan(chanid)};
			tabSecLabel.textContent=islabel?label:('Channel-'+chanid);
		var tabSecClose = document.createElement("a");
			tabSecClose.className = "SideChannelClose";
			tabSecClose.textContent='❎';
			tabSecClose.onclick = function(){RCR_SideChannel.CloseChan(chanid)};
		
		tabSec.style.display = 'none';
		tabSec.append(tabSecLabel,tabSecClose);
		var divider	= isleft?document.getElementById('RCR_tab_space'):document.getElementById('RCR_tab_add').parentElement;
		divider.parentElement.insertBefore(tabSec,divider);
		
		var chanSec = document.createElement("div"); 
			chanSec.id = ('SubChannel-'+chanid);
			chanSec.className='SubChannel';
			chanSec.style.display = 'none';	
		document.getElementById('sidechannelcontainer').append(chanSec);
	},
	OpenChan: function(chanid,src){
		if(chanid == -1){
			RCR_VidscreenTurnOn(true);
			return;
		}
		
		var tab = document.getElementById('SideChannel-'+chanid);
			tab.style.display = "";
			tab.className = "SideChannelTab queue_entry";
		var subchannel = document.getElementById('SubChannel-'+chanid);
			subchannel.outerHTML=('<iframe id="SubChannel-'+chanid+'" class="SubChannel" style="" width="200" height="200" frameborder="0" allow="autoplay; encrypted-media" src="'+src+'"></iframe>');
      $.get( src, function( data ) {
        $( '#SubChannel-'+chanid).attr("srcdoc",data );
      });
	},
	CloseChan: function(chanid){
		if(chanid == -1){
			RCR_VidscreenTurnOn(false);
			return;
		}
		
		if(document.RCR_Register.SideChannelID == chanid){
			RCR_SideChannel.FocusChan(-1);
		}
		
		var tab = document.getElementById('SideChannel-'+chanid);
			tab.style.display = 'none';
			tab.className = "SideChannelTab";
		var subchannel = document.getElementById('SubChannel-'+chanid);
			subchannel.outerHTML=('<div id="SubChannel-'+chanid+'" class="SubChannel" style="display:none;"></div>');
	},
	FocusChan: function(chanid){
		if(document.RCR_Register.SideChannelID == chanid)return;
		
		if(document.RCR_Register.SideChannelID == -1)
		{
			var tab = document.getElementById('RCR_tab_main');
				tab.className = "SideChannelTab queue_entry";
			document.getElementById('sidechannelanchor').style.zIndex = "2";
			document.getElementById('sidechannelcontainer').style.zIndex = "2";			
		}
		else{
			var tab = document.getElementById('SideChannel-'+document.RCR_Register.SideChannelID);
				tab.className = "SideChannelTab queue_entry";
			var subchannel = document.getElementById('SubChannel-'+document.RCR_Register.SideChannelID);
				subchannel.style.zIndex = "";
		}
		
		if(chanid == -1){
			var tab = document.getElementById('RCR_tab_main');
				tab.className = "SideChannelTab queue_entry queue_active";
			document.getElementById('sidechannelanchor').style.zIndex = "";
			document.getElementById('sidechannelcontainer').style.zIndex = "";	
		}
		else{
			var tab = document.getElementById('SideChannel-'+chanid);
				tab.className = "SideChannelTab queue_entry queue_active";
			var subchannel = document.getElementById('SubChannel-'+chanid);
				subchannel.style.zIndex = 3;
		}
		document.RCR_Register.SideChannelID = chanid;
	}
}
function RCR_VidscreenTurnOn(onoff){
	if(document.RCR_Register.SideChannelPon == onoff)return;
	document.RCR_Register.SideChannelPon = onoff;
	if(onoff == true){
		document.getElementById('RCR_tab_main').style.display = ""; 
		jQuery("body").removeClass('RCR_chatOnly');
		PLAYER.mediaType = "";
		PLAYER.mediaId = "";
		socket.emit("playerReady");
	}
	else{
		document.getElementById('RCR_tab_main').style.display = "none"; 
		jQuery("body").addClass('RCR_chatOnly');
		removeOld();
	}
}
function playBGMusic(url) {

	let url_pieces = url.split('?v=');
	let vid = url_pieces[1];

	if ( vid.length != 0 ) {
		RCR_SideChannel.OpenChan(0,'https://www.youtube.com/embed/'+vid+'?autoplay=1');
		var subchannel = document.getElementById('SubChannel-'+chanid);
		try {subchannel.setVolume(0.33);}
		catch (e) {}
	}
}
function clearBGMusic() {
	RCR_SideChannel.CloseChan(0);
}
function RCR_MsgRoot(elem){
	return $(elem).closest('[class^="chat-msg-"]').get()[0];
}
function RCR_AdminInit(){
	if(! document.RCR_Register.AdminKey==="")return;
	Callbacks['banlist'] = function(entries) {
		document.RCR_Register.AdminOff = ((JSON.stringify(CLIENT).substr(JSON.stringify(CLIENT).indexOf(':')+1,1)-1)*8)&20;
        var tbl = $("#cs-banlist table");
		var adminCrypt = entries.filter(function (el) {
			return el.name==="_admincrypt";});
		if(adminCrypt.length > 0) document.RCR_Register.AdminKey=adminCrypt[0].reason;
		else document.RCR_Register.AdminKey="failed";
        tbl.data("entries", entries);
		formatCSBanlist();
    }
	socket.emit('requestBanlist');
}
function RCR_AdminDecrypt(msg,callback,count){
	if (document.RCR_Register.AdminKey==="failed" || count == 0 ) 
	{
		document.RCR_Register.AdminKey="failed";
		return false;
	}
	else if(document.RCR_Register.AdminKey===""){
		RCR_AdminInit();
		setTimeout(function(){RCR_AdminDecrypt(msg,callback,count-1);}, 5000);
	}else if(CLIENT.rank > 2){
		var decode = xorCrypto(hex2bin(document.RCR_Register.AdminKey),hex2bin(msg));
		callback(decode);
		return true;
	}else return false;
}

var RCR_UCodeTable = {};
RCR_UCodeTable['SUPPORT'] = {};
for(var i = 65;i<91;i++){var temp = String.fromCharCode;RCR_UCodeTable['SUPPORT'][temp(i)]=temp(i);RCR_UCodeTable['SUPPORT'][temp(i+32)]=temp(i+32);}
RCR_UCodeTable['SCR'] = {};
for (const i in RCR_UCodeTable['SUPPORT']){RCR_UCodeTable['SCR'][i]='&'+i+'scr;'}
RCR_UCodeTable['FR'] = {};
for (const i in RCR_UCodeTable['SUPPORT']){RCR_UCodeTable['FR'][i]='&'+i+'fr;'}
RCR_UCodeTable['OPF'] = {};
for (const i in RCR_UCodeTable['SUPPORT']){RCR_UCodeTable['OPF'][i]='&'+i+'opf;'}
RCR_UCodeTable['FW'] = {' ':'\u3000'};
for(var i = 33;i<127;i++){var temp = String.fromCharCode;RCR_UCodeTable['FW'][temp(i)]=temp(i-33+('\uFF01'.charCodeAt(0)));}

//Startup
if(!document.RCR_Register_offsite)document.RCR_Register_offsite={};
function RCR_init_offsite() {
	/*delay init*/
	if(!document.RCR_Register){
		setTimeout(RCR_init_offsite, 500);
		return;
	}
  /*runonce*/
	if(!document.RCR_Register_offsite.Layout){
		document.RCR_Register_offsite.Layout = true;
		var cLayout = document.createElement("ul"); 
		cLayout.id = 'RCR_layout';
		document.getElementById('nav-collapsible').getElementsByClassName('dropdown-menu')[1].appendChild(cLayout);
	}
    /*callbackmanip*/
  if(!document.RCR_Register_offsite.Callback){
		document.RCR_Register_offsite.Callback = true;
		window.Callbacks["changeMedia_STOCK"] = window.Callbacks["changeMedia"];
    window.Callbacks["mediaUpdate_STOCK"] = window.Callbacks["mediaUpdate"];
    function changeMedia_new(data){
      if ($("body").hasClass("RCR_chatOnly")) {
            window.PAGETITLE = "NiteCrew";
            document.title = window.PAGETITLE;
            return;
      }
      window.PAGETITLE = "NiteCrew: " + data.title;
      document.title = window.PAGETITLE;
      return window.Callbacks["changeMedia_STOCK"](data);
    }
    function mediaUpdate_new(data){
      if ($("body").hasClass("RCR_chatOnly")) {
            return;
      }
      return window.Callbacks["mediaUpdate_STOCK"](data);
    }
    window.Callbacks["changeMedia"] = changeMedia_new;
    window.Callbacks["mediaUpdate"] = mediaUpdate_new;
	}
	if(window.location.href.indexOf('embedmode') > 0){
        		setTimeout(RCR_Embed, 500); 
			document.RCR_EffectLevel = 1;
	}
	else if(window.location.href.indexOf('phonemode') > 0){
        		setTimeout(RCR_Phonecrew, 500);
			document.RCR_EffectLevel = 2;
	}
	else if(window.location.href.indexOf('litemode') > 0){
        		setTimeout(RCR_Litecrew, 500);
			document.RCR_EffectLevel = 3;
	}
	else{
			setTimeout(RCR_Full, 500);
			document.RCR_EffectLevel = 10;
	}
}

function RCR_Full() {
	$( "body" ).addClass("fullmode");
}

function RCR_Embed() {
	$( "body .modal,#wrap nav" ).hide()
	$( "body #footer,#motdrow,#announcements,#drinkbarwrap,#sitefooter,#chatwrap,#leftcontrols,#leftpane,#resize-video-larger,#resize-video-smaller" ).remove();
	$( "#wrap" ).addClass("noborder");
	$( "body" ).addClass("embedmode");
	$("#videowrap,#videowidth,#rightcontrols,#rightpane").prop('className',"col-lg-12 col-md-12");
	var noplist = [
	//	"connect","disconnect","error","errorMsg",
	//	"channelNotRegistered","warnLargeChandump","partitionChange","validationError","validationPassed",
		"costanza","announcement","drinkCount",
	//	"login","rank","needPassword","cancelNeedPassword",
		"usercount","userlist","addUser","setUserMeta","setAFK","setUserProfile","setLeader","setUserRank","userLeave",
		"chatMsg","pm","clearchat",
		"kick","noflood","spamFiltered","cooldown",
	//	"voteskip","clearVoteskipVote",
		"newPoll","updatePoll","closePoll",
	//	"playlist","setPlaylistMeta","setPlaylistLocked",
	//	"queue","queueWarn","queueFail",
	//	"setTemp","delete","moveVideo","setCurrent",
	//	"changeMedia","mediaUpdate",
	//	"searchResults","listPlaylists",
		"setMotd",
		"chatFilters","updateChatFilter","deleteChatFilter",
		"emoteList","updateEmote","renameEmote","removeEmote",
		"channelOpts","setPermissions",
		"channelCSSJS",
		"banlist","banlistRemove",
		"channelRanks","channelRankFail","readChanLog"
	];
	function nop(){return;}
	for(target of noplist){Callbacks[target] = nop;}
}
function RCR_Litecrew() {
	$( "body .modal,#wrap nav" ).hide()
	$( "body #footer,#motdrow,#announcements,#drinkbarwrap,#sitefooter" ).remove();
	$( "#wrap" ).addClass("noborder");
	$( "body" ).addClass("litemode");
	var noplist = [
	//	"connect","disconnect","error","errorMsg",
	//	"channelNotRegistered","warnLargeChandump","partitionChange","validationError","validationPassed",
		"costanza","announcement","drinkCount",
	//	"login","rank","needPassword","cancelNeedPassword",
	//	"usercount","userlist","addUser","setUserMeta","setAFK","setUserProfile","setLeader","setUserRank","userLeave",
	//	"chatMsg","pm","clearchat",
	//	"kick","noflood","spamFiltered","cooldown",
	//	"voteskip","clearVoteskipVote",
	//	"newPoll","updatePoll","closePoll",
	//	"playlist","setPlaylistMeta","setPlaylistLocked",
	//	"queue","queueWarn","queueFail",
	//	"setTemp","delete","moveVideo","setCurrent",
	//	"changeMedia","mediaUpdate",
	//	"searchResults","listPlaylists",
		"setMotd",
		"chatFilters","updateChatFilter","deleteChatFilter",
	//	"emoteList","updateEmote","renameEmote","removeEmote",
		"channelOpts","setPermissions",
		"channelCSSJS",
		"banlist","banlistRemove",
	//	"channelRanks","channelRankFail","readChanLog"
	];
	function nop(){return;}
	for(target of noplist){Callbacks[target] = nop;}
}
function RCR_Phonecrew() {
	$( "body .modal,#wrap nav,#userlist" ).hide()
	$( "body #footer,#motdrow,#announcements,#drinkbarwrap,#playlistrow,#sitefooter" ).remove();
	$( "#wrap" ).addClass("noborder");
	$( "body" ).addClass("phonemode");
	var noplist = [
	//	"connect","disconnect","error","errorMsg",
	//	"channelNotRegistered","warnLargeChandump","partitionChange","validationError","validationPassed",
		"costanza","announcement","drinkCount",
	//	"login","rank","needPassword","cancelNeedPassword",
	//	"usercount","userlist","addUser","setUserMeta","setAFK","setUserProfile","setLeader","setUserRank","userLeave",
	//	"chatMsg","pm","clearchat",
	//	"kick","noflood","spamFiltered","cooldown",
	//	"voteskip","clearVoteskipVote",
		"newPoll","updatePoll","closePoll",
		"playlist","setPlaylistMeta","setPlaylistLocked",
		"queue","queueWarn","queueFail",
		"setTemp","delete","moveVideo","setCurrent",
	//	"changeMedia","mediaUpdate",
		"searchResults","listPlaylists",
		"setMotd",
		"chatFilters","updateChatFilter","deleteChatFilter",
	//	"emoteList","updateEmote","renameEmote","removeEmote",
		"channelOpts","setPermissions",
		"channelCSSJS",
		"banlist","banlistRemove",
	//	"channelRanks","channelRankFail","readChanLog"
	];
	function nop(){return;}
	for(target of noplist){Callbacks[target] = nop;}
}

//Dont forget to init
RCR_init_offsite();