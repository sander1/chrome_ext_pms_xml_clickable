// nodes to process
var attributes = document.getElementsByClassName('webkit-html-attribute-name');

// nodes types we want to linkup()
var wanted = ['key','art','thumb','sourceIcon','url','postURL','composite'];

// key nodes that we don't want to linkup
var dontFollow = ['transcode','search','butler','playQueues','help','playlists','player'];

linkup();
buttons();
chrome.storage.sync.get('expand', function(result){
	if (result["expand"]){
		expand();
	}
});


function expand(){
	for (var i=0; i<attributes.length; i++){
		attributes[i].parentNode.setAttribute('style','display: block; margin-left: 15px;');
	}
	chrome.storage.sync.set({'expand': true});
}

function contract(){
	for (var i=0; i<attributes.length; i++){
		attributes[i].parentNode.setAttribute('style','');
	}
	chrome.storage.sync.set({'expand': false});
}


function buttons(){

	var header = document.getElementsByClassName("header")[0];
	var body = document.getElementsByClassName("pretty-print")[0];
	
	// adjust header and body styles for our purposes
	header.setAttribute('style','position: fixed; top: -10px; background-color: #fff; border-bottom: 1px solid #666; padding: 10px; padding-top: 15px; width: 100%;')
	body.setAttribute('style','postion: absolute; top: 70px; margin-top: 70px;')

	// clear our donor node contents
	header.childNodes[0].textContent="";

	// clone this donor node (we must use nodes that already existed in order to style them,
	// newly created nodes do not work but cloning existing ones do!)
	var newNode = header.childNodes[0].cloneNode(true);
	var newNode2 = header.childNodes[0].cloneNode(true);
	var newNode3 = header.childNodes[0].cloneNode(true);

	// remove all existing nodes from header
	for(i=0;i<=header.childElementCount;i++){
		header.removeChild(header.childNodes[0]);
	}	

	// add three fresh nodes and populate them
	header.appendChild(newNode);
	header.appendChild(newNode2);
	header.appendChild(newNode3);

	var e = document.createElement('span');
 	var eText = document.createTextNode("Expand");
 	e.appendChild(eText);
	header.childNodes[0].appendChild(e);
	header.childNodes[0].setAttribute('style','display: inline-block; cursor: pointer; background-color: #335633; padding: 4px 8px 4px 8px; color: #fff; margin: 0; margin-right: 15px; border: 1px solid #ccc;');
	header.childNodes[0].addEventListener('click', function() { expand(); }, false);
	
 	var c = document.createElement('span');
 	var linkText = document.createTextNode("Contract");
 	c.appendChild(linkText);
	header.childNodes[1].appendChild(c);
	header.childNodes[1].setAttribute('style','display: inline-block; cursor: pointer; background-color: #983a3a; padding: 4px 8px 4px 8px; margin: 0; color: #fff;  border: 1px solid #ccc;');
	header.childNodes[1].addEventListener('click', function() { contract(); }, false);
	
	var t = document.createElement('div');
	var tText = document.createTextNode('Plex Media Server XML Helper');
	t.appendChild(tText);
	header.childNodes[2].appendChild(t);
	header.childNodes[2].setAttribute('style','display: block; float: right; margin-right: 70px; font-size: 1.3em; font-weight: bold; color: #aaa; font-family: Tahoma, Geneva, sans-serif;');

}


function linkup(){
	for (var i=0; i<attributes.length; i++){
		if (wanted.indexOf(attributes[i].childNodes[0].nodeValue) < 0){
			continue;
		}

		var node = attributes[i].nextSibling.nextSibling.childNodes[0];

		var thisType = attributes[i].childNodes[0].nodeValue;
		var url = node.textContent;
	
		// to follow or not to follow?
		if (dontFollow.indexOf(url) >= 0){
			continue;
		}
	
		// rtmp/rtmpe?  Don't build this link
		if (url.substr(0,7) == 'rtmp://' || url.substr(0,8) == 'rtmpe://'){
			continue;
		}

		var textNode = document.createTextNode(url);
	
		// if this is a 'key', a local link, does not have a ? (meaning it passes an argument) 
		// and it doesn't end with a / then we enforce the addition of one -- if the next 
		// key also relative it needs this to function properly.
		// NB: we do this after we create the url text as we only want to adjust
		// the actual href and not the displayed text
		if (thisType=='key' && url.substr(0,7) != "http://" && url.substr(-1) != '/' && url.search('\\?') == -1){
			url += "/";
		}
		
		var a = document.createElement('a');
		a.setAttribute('href', url);
		a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
		a.appendChild(textNode);

		node.parentNode.setAttribute('style','cursor: pointer; text-decoration: underline; color: #1a1aa6;');
		node.parentNode.replaceChild(a, node);
	}
}
