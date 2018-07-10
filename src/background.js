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
                    if (data.trim() ==  localStorage['verify-code'].trim()) {
                        console.log('success: ' + data);
                        createNotification('BEGIN', 'Success', url);
                        var scanUrl = getProxyURL();
                        browser.tabs.create({
                            url: browser.runtime.getURL(scanUrl)
                        });
                        setIconRed();
                    } else {
                        console.log('failed: ' + data);
                        createNotification('BEGIN', 'Failed', url);
                        setIconBlue();
                    }
                },
                error: (xhr, status, error) => {
                    console.log('error');
                    createNotification('BEGIN', 'Error', url);
                    setIconBlue();
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
                    if (data.trim() == localStorage['verify-code'].trim()) {
                        console.log('success: ' + data);
                        createNotification('COMMIT', 'Success', url);
                        setIconBlue();
                    } else {
                        console.log('failed: ' + data);
                        createNotification('COMMIT', 'Failed', url);
                        setIconRed();
                    }
                },
                error: (xhr, status, error) => {
                    console.log('error');
                    createNotification('COMMIT', 'Error', url);
                    setIconRed();
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

    function setIconRed() {
        localStorage['icon'] = iconRed;
        browser.browserAction.setIcon({path: iconRed});
    }

    function setIconBlue() {
        localStorage['icon'] = iconBlue;
        browser.browserAction.setIcon({path: iconBlue});
    }

    function createNotification(proc, status, url) {
        var title = status + ' ' + proc + ' VAddy Proxy Crawl';
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/blue_48.png'),
            'title': title,
            'message': url
        });
    }

    function getBasicCredentials() {
        if (localStorage['basic-user'] !== undefined && localStorage['basic-pass'] !== undefined) {
            return window.btoa(localStorage['basic-user'] + ':' + localStorage['basic-pass']);
        }
    }

    function getProxyURL(operation) {
        if (localStorage['server-name'] !== undefined && localStorage['verify-code'] !== undefined) {
            var url = localStorage['server-name'].trim() + '/vaddy-' + localStorage['verify-code'].trim() + '.html';
            if ('begin' == operation) {
                return url + '?action=begin';
            } else if ('commit' == operation) {
                return url + '?action=commit';
            } else {
                return localStorage['server-name'].trim();
            }
        }
    }
});