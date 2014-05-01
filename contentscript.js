// only process if we are not in Plex/Web!
if (window.location.pathname.substr(0,4) != "/web"){
	// nodes to process
	var attributes = document.getElementsByClassName('webkit-html-attribute-name');

	// nodes types we want to linkup()
	var wanted = ['key','art','thumb','sourceIcon','url','postURL','composite','parentKey','grandparentKey','theme','grandparentTheme','banner'];

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
		// with newly created nodes style does not work but styling cloned existing ones does!)
		var donorNode = header.childNodes[0].cloneNode(true);
		
		// remove all existing nodes from header
		for(i=0;i<=header.childElementCount;i++){
			header.removeChild(header.childNodes[0]);
		}	

		var t = document.createElement('div');
		var tText = document.createTextNode('Plex Media Server XML Helper');
		t.appendChild(tText);
		header.appendChild(donorNode.cloneNode(true));
		header.lastChild.appendChild(t);
		header.lastChild.setAttribute('style','display: block; float: right; margin-right: 70px; font-size: 1.3em; font-weight: bold; color: #aaa; font-family: Tahoma, Geneva, sans-serif;');

		var e = document.createElement('span');
		var eText = document.createTextNode("Expand");
		e.appendChild(eText);
		header.appendChild(donorNode.cloneNode(true));
		header.lastChild.appendChild(e);
		header.lastChild.setAttribute('style','display: inline-block; cursor: pointer; background-color: #335633; padding: 4px 8px 4px 8px; color: #fff; margin: 0; margin-right: 15px; border: 1px solid #ccc;');
		header.lastChild.addEventListener('click', function() { expand(); }, false);
	

		var c = document.createElement('span');
		var linkText = document.createTextNode("Contract");
		c.appendChild(linkText);
		header.appendChild(donorNode.cloneNode(true));
		header.lastChild.appendChild(c);
		header.lastChild.setAttribute('style','display: inline-block; cursor: pointer; background-color: #983a3a; padding: 4px 8px 4px 8px; margin: 0; color: #fff;  border: 1px solid #ccc;');
		header.lastChild.addEventListener('click', function() { contract(); }, false);

		// Breadcrumbs
		var tPath = window.location.pathname.split('/').slice();

		bcStyle = 'cursor: pointer; text-decoration: none; color: #1a1aa6; font-weight: bold; font-size: 1.1em; margin-left: 3px; margin-right: 3px;';
		gStyle = 'color:#aaa; cursor: text;';
		dStyle = 'font-weight: normal; font-size: 1.1em; color: #888;';

		
		var textNode = document.createTextNode("/");
		var s = document.createElement('span');
		s.appendChild(textNode);
		header.appendChild(donorNode.cloneNode(true));
		header.lastChild.appendChild(s);
		header.lastChild.setAttribute('style',dStyle+'margin-left: 30px;');


		var textNode = document.createTextNode("root");
		var a = document.createElement('a');
		a.setAttribute('href', "/");
		if(tPath[1] != ""){
			// we have a proper breadcrumb, make root a link
			a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
			a.appendChild(textNode);
			header.appendChild(donorNode.cloneNode(true));
			header.lastChild.appendChild(a);
			header.lastChild.setAttribute('style',bcStyle);
		} else {
			// just root here, don't link this up
			a.appendChild(textNode);
			header.appendChild(donorNode.cloneNode(true));
			header.lastChild.appendChild(a);
			header.lastChild.setAttribute('style',bcStyle+gStyle);		
		}

		
		for( var i = 1; i < tPath.length; i++ )
		{
			// don't render blank nodes in here
			if (tPath[i] == ""){
				continue;
			}
			var textNode = document.createTextNode("/");
			var s = document.createElement('span');
			s.appendChild(textNode);
			header.appendChild(donorNode.cloneNode(true));
			header.lastChild.appendChild(s);
			header.lastChild.setAttribute('style',dStyle);
			
			var crumb = tPath[i];
			var url = "/"+tPath.slice( 1, i + 1 ).join('/');

			if (i != tPath.length-1){
				var textNode = document.createTextNode(""+crumb+"");
				var a = document.createElement('a');
				a.setAttribute('href', url);
				a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
				a.appendChild(textNode);
				header.appendChild(donorNode.cloneNode(true));
				header.lastChild.appendChild(a);
				header.lastChild.setAttribute('style',bcStyle);
			} else {
				// current node (no link)		
				var textNode = document.createTextNode(tPath[tPath.length-1]);
				var s = document.createElement('span');
				s.appendChild(textNode);
				header.appendChild(donorNode.cloneNode(true));
				header.lastChild.appendChild(s);
				header.lastChild.setAttribute('style',bcStyle+gStyle);
			
			}

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
	
			// is this key a relative key?  if so, make it absolute
			// NB: we do this after we create the url text as we only want to adjust
			// the actual href and not the displayed text
			if (thisType=="key" && url.substr(0,7) != "http://" && url.substr(0,1) != '/'){
				var newUrl = window.location.pathname;
				if (newUrl.substr(-1,1) != "/"){
					newUrl+="/";
				}
				newUrl+=url;
				url=newUrl;
			}

			var a = document.createElement('a');
			a.setAttribute('href', url);
			a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
			a.appendChild(textNode);

			node.parentNode.setAttribute('style','cursor: pointer; text-decoration: underline; color: #1a1aa6;');
			node.parentNode.replaceChild(a, node);
		}
	}
	
}


