var attributes = document.getElementsByClassName('webkit-html-attribute-value');

for (var i=0; i<attributes.length; i++)
{

	if (attributes[i].childNodes.length === 0)
	{
		continue;
	}

	var node = attributes[i].childNodes[0];

	if (node.nodeValue.substring(0, 7) == 'http://' || node.nodeValue.substring(0, 1) == '/')
	{
		var url = node.nodeValue;
		var textNode = document.createTextNode(url);

		var a = document.createElement('a');
		a.setAttribute('href', url);
		a.addEventListener('click', function() { window.location = this.getAttribute('href'); }, false);
		a.appendChild(textNode);
		
		node.parentNode.setAttribute('style','color: blue; cursor: pointer; text-decoration: underline;');
		node.parentNode.replaceChild(a, node);
	}
}
