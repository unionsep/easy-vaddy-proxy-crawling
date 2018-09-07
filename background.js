$(() => {
    const iconBlue = 'icons/blue_19.png';
    const iconRed = 'icons/red_19.png';

    if (localStorage.getItem('icon') === undefined) {
        setIconBlue();
    }

    browser.browserAction.onClicked.addListener(() => {
        if (localStorage['icon'] == iconBlue) {
            var urls = getProxyURL('begin');
            if (0 >= urls.length) {
                createNotification('BEGIN', 'Error', 'check Server Name or Verification Code');
                return;
            }
            $.ajax({
                url: url,
                success: (data) => {
                    if (data.trim() ==  localStorage['verify-code'].trim()) {
                        createNotification('BEGIN', 'Success', url);
                        if (1 == localStorage['auto-access']) {
                            var scanUrl = getAutoAccessUrl();
                            browser.tabs.create({
                                url: browser.runtime.getURL(scanUrl)
                            });
                        }
                        setIconRed();
                    } else {
                        createNotification('BEGIN', 'Failed', url);
                        setIconBlue();
                    }
                },
                error: (xhr, status, error) => {
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
                        createNotification('COMMIT', 'Success', url);
                        setIconBlue();
                    } else {
                        createNotification('COMMIT', 'Failed', url);
                        setIconRed();
                    }
                },
                error: (xhr, status, error) => {
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

    let setIconRed = () => {
        localStorage['icon'] = iconRed;
        browser.browserAction.setIcon({path: iconRed});
    };

    let setIconBlue = () => {
        localStorage['icon'] = iconBlue;
        browser.browserAction.setIcon({path: iconBlue});
    };

    let createNotification = (proc, status, message) => {
        var title = status + ' ' + proc + ' VAddy Proxy Crawl';
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/blue_48.png'),
            'title': title,
            'message': message
        });
    };

    let getBasicCredentials = () => {
        if (localStorage['basic-user'] !== undefined && localStorage['basic-pass'] !== undefined) {
            return window.btoa(localStorage['basic-user'] + ':' + localStorage['basic-pass']);
        }
    };

    let getAutoAccessUrl = () => {
        var serverNames = localStorage.getItem('server-names');
        var verifyCode = localStorage.getItem('verify-code');
        var url = null;
        if (undefined !== serverNames && undefined !== verifyCode) {
            for (let server in serverNames) {
                if (serverNames[server][0]) {
                    url = serverNames[server].trim();
                    break;
                }
            }
        }
        return url;
    };

    let getProxyURL = (operation) => {
        var urls = [];
        if (localStorage['server-names'] !== undefined && localStorage['verify-code'] !== undefined) {
            var serverNames = JSON.parse(localStorage.getItem('server-names'));
            for (let server in serverNames) {
                if (null != serverNames[server]) {
                    if ('begin' == operation) {
                        urls.push(serverNames[server][1].trim() + '/vaddy-' + localStorage['verify-code'].trim() + '.html?action=begin');
                    } else if ('commit' == operation) {
                        urls.push(serverNames[server][1].trim() + '/vaddy-' + localStorage['verify-code'].trim() + '.html?action=commit');
                    }
                }
            }
        }
        return urls;
    }
});