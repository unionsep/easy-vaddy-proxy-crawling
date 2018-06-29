$(() => {
    const iconBlue = 'icons/blue_19.png';
    const iconRed = 'icons/red_19.png';
    if (localStorage['icon'] === undefined) {
        localStorage['icon'] = iconBlue;
        browser.browserAction.setIcon({path: iconBlue});
    }
    browser.browserAction.onClicked.addListener(() => {
        if (localStorage['icon'] == iconBlue) {
            var url = getProxyURL('begin');
            $.ajax({
                url: url,
                success: (data) => {
                    console.log('success: ' + data);
                    localStorage['icon'] = iconRed;
                    browser.browserAction.setIcon({path: iconRed});    
                },
                error: (xhr, status, error) => {
                    console.log('error');
                    localStorage['icon'] = iconBlue;
                    browser.browserAction.setIcon({path: iconBlue});
                },
                beforeSend: (xhr) => {
                    var credentials = getBasicCredentials();
                    if (credentials) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                    }
                }
            });
        } else {
            var url = getProxyURL('commit');
            $.ajax({
                url: url,
                success: (data) => {
                    console.log('success: ' + data);
                    localStorage['icon'] = iconBlue;
                    browser.browserAction.setIcon({path: iconBlue});
                },
                error: (xhr, status, error) => {
                    console.log('error');
                    localStorage['icon'] = iconRed;
                    browser.browserAction.setIcon({path: iconRed});
                },
                beforeSend: (xhr) => {
                    var credentials = getBasicCredentials();
                    if (credentials) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                    }
                }
            });
        }
    });

    function getBasicCredentials() {
        if (localStorage['basic-user'] !== undefined && localStorage['basic-pass'] !== undefined) {
            return window.btoa(localStorage['basic-user'] + ':' + localStorage['basic-pass']);
        }
    }

    function getProxyURL(operation) {
        if (localStorage['server-name'] !== undefined && localStorage['verify-file'] !== undefined) {
            var url = localStorage['server-name'].trim() + '/' + localStorage['verify-file'].trim();
            if ('begin' == operation) {
                return url + '?action=begin';
            } else if ('commit' == operation) {
                return url + '?action=commit';
            }
        }
    }
});