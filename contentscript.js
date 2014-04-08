var attributes = document.getElementsByClassName('webkit-html-attribute-name');
var wanted = ['key','art','thumb','sourceIcon'];
var dontFollow = ['transcode','search','butler','playQueues','help','playlists','player'];

linkup()

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
