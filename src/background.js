if (localStorage['icon'] === undefined) {
	localStorage['icon'] = 'img/blue.png';
}


chrome.browserAction.onClicked.addListener(function(tab){
	if (localStorage['icon'] === 'img/blue.png') {
		localStorage['icon'] = 'img/red.png';
	} else {
		localStorage['icon'] = 'img/blue.png';
	}
	chrome.browserAction.setIcon({path:localStorage['icon']});
});	
