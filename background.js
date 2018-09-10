$(() => {
    const PROC_BEGIN = 'begin';
    const PROC_COMMIT = 'commit';
    const ICON_REC = 'icons/red_19.png';
    const ICON_UNREC = 'icons/blue_19.png';
    const VERSION_V1 = 1;
    const VERSION_V2 = 2;

    let getBasicCredentials = () => {
        var basicUser = localStorage.getItem('basic-user')
        var basicPass = localStorage.getItem('basic-pass')
        if (null != basicUser && null != basicPass) {
            return window.btoa(basicUser + ':' + basicPass)
        }
    }

    let getCrawlingURL = (operation) => {
        if (PROC_BEGIN !== operation && PROC_COMMIT !== operation) {
            return []
        }
        var urls = []
        var serverNames = localStorage.getItem('server-names')
        var verifyCode = localStorage.getItem('verify-code')
        var version = localStorage.getItem('version')
        var projectId = localStorage.getItem('project-id')
        if (serverNames !== undefined && verifyCode !== undefined) {
            var serverNames = JSON.parse(serverNames)
            for (let server in serverNames) {
                if (null != serverNames[server]) {
                    if (VERSION_V2 == version) {
                        urls.push(serverNames[server][1].trim() + '/vaddy-' + verifyCode.trim() + '.html?action=' + operation + '&project_id=' + projectId)
                    } else {
                        urls.push(serverNames[server][1].trim() + '/vaddy-' + verifyCode.trim() + '.html?action=' + operation)
                    }
                }
            }
        }
        return urls
    }

    let setNotification = (proc, status, message) => {
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/blue_48.png'),
            'title': browser.i18n.getMessage('notification_title', [status, proc]),
            'message': message
        });
    };

    let changeIcon = (proc) => {
        if (PROC_BEGIN === proc) {
            localStorage.setItem('icon', ICON_REC)
            browser.browserAction.setIcon({path: ICON_REC})
        } else {
            localStorage.setItem('icon', ICON_UNREC)
            browser.browserAction.setIcon({path: ICON_UNREC})
        }
    };

    let accessCrawlURL = (proc, url) => {
        var isAccessed = false;
        $.ajax({
            url: url,
            async: false,
            success: (data) => {
                if (data.trim() == localStorage.getItem('verify-code')) {
                    isAccessed = true;
                } else {
                    isAccessed = false
                }
            },
            error: (xhr, status, error) => {
                isAccessed = false
            },
            beforeSend: (xhr) => {
                var credentials = getBasicCredentials();
                if (credentials) {
                    xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                }
            }
        })
        if (PROC_BEGIN == proc) {
            isAccessed ? changeIcon(PROC_BEGIN) : changeIcon(PROC_COMMIT)
        } else {
            isAccessed ? changeIcon(PROC_COMMIT) : changeIcon(PROC_BEGIN)
        }
        return isAccessed
    }

    if (null == localStorage.getItem('icon')) {
        changeIcon(PROC_COMMIT)
    } else {
        if (ICON_REC == localStorage.getItem('icon')) {
            changeIcon(PROC_BEGIN)
        } else {
            changeIcon(PROC_COMMIT)
        }
    }

    browser.browserAction.onClicked.addListener(() => {
        if (ICON_UNREC === localStorage.getItem('icon')) {
            var urls = getCrawlingURL(PROC_BEGIN)
            console.log(urls)
            if (0 >= urls.length) {
                setNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_require_fqdn_verify_code'))
            } else {
                var isAccessed = true
                $.each(urls, (idx, url) => {
                    if (!accessCrawlURL(PROC_BEGIN, url)) {
                        isAccessed = false
                        return false
                    }
                })
                isAccessed ? changeIcon(PROC_BEGIN) : changeIcon(PROC_COMMIT)
            }
        } else {
            var urls = getCrawlingURL(PROC_COMMIT)
            console.log(urls)
            if (0 >= urls.length) {
                setNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_require_fqdn_verify_code'))
            } else {
                var isAccessed = true
                $.each(urls, (idx, url) => {
                    if (!accessCrawlURL(PROC_COMMIT, url)) {
                        isAccessed = false;
                        return false;
                    }
                })
                isAccessed ? changeIcon(PROC_COMMIT) : changeIcon(PROC_BEGIN);
            }
        }
    });

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
})