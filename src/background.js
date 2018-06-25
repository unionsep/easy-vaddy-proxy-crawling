$(function(){
	if (localStorage['icon'] === undefined) {
		localStorage['icon'] = 'img/blue.png';
		chrome.browserAction.setIcon({path:localStorage['icon']});
	}

	chrome.browserAction.onClicked.addListener(function(tab){
		if (localStorage['icon'] === 'img/blue.png') {
			var url = getProxyUrl('begin');
			$.get(url)
			.done(function(data){
				localStorage['icon'] = 'img/red.png';
				chrome.browserAction.setIcon({path:localStorage['icon']});
			})
			.fail(function(data){
				localStorage['icon'] = 'img/blue.png';
				chrome.browserAction.setIcon({path:localStorage['icon']});
			});
		} else {
			var url = getProxyUrl('commit');
			$.get(url)
			.done(function(data){
				localStorage['icon'] = 'img/blue.png';
				chrome.browserAction.setIcon({path:localStorage['icon']});
			})
			.fail(function(data){
				localStorage['icon'] = 'img/red.png';
				chrome.browserAction.setIcon({path:localStorage['icon']});
			});
		}
	});

	function getProxyUrl(operation) {
		if (localStorage['vaddy-server-name'] !== undefined && localStorage['vaddy-verification-filename'] !== undefined) {
			if ('begin' == operation) {
				return localStorage['vaddy-server-name'] + '/' + localStorage['vaddy-verification-filename'] + '?action=begin';
			} else if ('commit' == operation) {
				return localStorage['vaddy-server-name'] + '/' + localStorage['vaddy-verification-filename'] + '?action=commit';
			}
		}
	}
});