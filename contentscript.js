var attributes = document.getElementsByClassName('webkit-html-attribute-name');
var wanted = ['key','art','thumb','sourceIcon'];
var dontFollow = ['transcode','search','butler','playQueues','help','playlists','player'];

for (var i=0; i<attributes.length; i++)
{

	if (wanted.indexOf(attributes[i].childNodes[0].nodeValue) < 0)
	{
		continue;
	}

	var thisType = attributes[i].childNodes[0].nodeValue;
	var node = attributes[i].nextSibling.nextSibling.childNodes[0];
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
 	
 	// if this is a 'key', a local link, and it doesn't end with a / 
 	// then we enforce the addition of a / because if the next key is 
 	// also relative it needs this to function properly.
 	// NB: we do this after we create the url text as we only want to adjust
 	// the actual href and not the displayed text
 	if (thisType=='key' && url.substr(0,7) != "http://" && url.substr(-1) != '/'){
		url = url+"/";
 	}
	console.log(url);
	
	var a = document.createElement('a');
	a.setAttribute('href', url);
	a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
	a.appendChild(textNode);

	node.parentNode.setAttribute('style','cursor: pointer; text-decoration: underline;');
	node.parentNode.replaceChild(a, node);

}
