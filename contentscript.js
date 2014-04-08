attributes = document.getElementsByClassName('webkit-html-attribute-name');
var wanted = ['key','art','thumb','sourceIcon'];
var dontFollow = ['transcode','search','butler','playQueues','help','playlists','player'];

linkup()
buttons()

function expand(){
	for (var i=0; i<attributes.length; i++){
		attributes[i].parentNode.setAttribute('style','display: block; margin-left: 15px;');
	}
}

function contract(){
	for (var i=0; i<attributes.length; i++){
		attributes[i].parentNode.setAttribute('style','');
	}
}


function buttons(){

	var header = document.getElementsByClassName("header")[0];
	var body = document.getElementsByClassName("pretty-print")[0];
	
	header.setAttribute('style','position: fixed; top: -10px; background-color: #fff; border-bottom: 1px solid #666; padding: 10px; padding-top: 15px; width: 100%;')
	body.setAttribute('style','postion: absolute; top: 70px; margin-top: 70px;')

	// clear our donor node contents
	header.childNodes[0].textContent="";

	// clone this donor node (we must use nodes that already existed in order to style them,
	// newly created nodes do not work but cloning existing ones does!)
	var newNode = header.childNodes[0].cloneNode(true);
	var newNode2 = header.childNodes[0].cloneNode(true);

	// remove all existing nodes from header
	for(i=0;i<=header.childElementCount;i++){
		header.removeChild(header.childNodes[0]);
	}	

	var e = document.createElement('span');
 	var eText = document.createTextNode("Expand");
 	e.appendChild(eText);
 	e.addEventListener('click', function() { expand(); }, false);

 	var c = document.createElement('a');
 	var linkText = document.createTextNode("Contract");
 	c.appendChild(linkText);
 	c.title = "Contract";
 	c.addEventListener('click', function() { contract(); }, false);

	// add two fresh nodes and populate them
	header.appendChild(newNode);
	header.appendChild(newNode2);
	
	header.childNodes[0].appendChild(e);
	header.childNodes[0].setAttribute('style','display: inline-block; cursor: pointer; background-color: #335633; padding: 4px 8px 4px 8px; color: #fff; margin: 0; margin-right: 20px;');
	header.childNodes[1].appendChild(c);
	header.childNodes[1].setAttribute('style','display: inline-block; cursor: pointer; background-color: #983a3a; padding: 4px 8px 4px 8px; margin: 0; color: #fff;');
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
	
		// if this is a 'key', a local link, or has a ? (meaning it passes an argument) 
		// and it doesn't end with a / then we enforce the addition of one -- if the next 
		// key also relative it needs this to function properly.
		// NB: we do this after we create the url text as we only want to adjust
		// the actual href and not the displayed text
		if (thisType=='key' && url.substr(0,7) != "http://" && url.substr(-1) != '/' && url.search('\\?') == -1){
			url = url+"/";
		}
		
		var a = document.createElement('a');
		a.setAttribute('href', url);
		a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
		a.appendChild(textNode);

		node.parentNode.setAttribute('style','cursor: pointer; text-decoration: underline; color: #1a1aa6;');
		node.parentNode.replaceChild(a, node);
	}
}
