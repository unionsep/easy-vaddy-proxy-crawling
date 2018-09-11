$(() => {
    const PROC_BEGIN = 'begin'
    const PROC_COMMIT = 'commit'
    const ICON_REC = 'icons/red_19.png'
    const ICON_UNREC = 'icons/blue_19.png'
    const VERSION_V1 = 1
    const VERSION_V2 = 2

    let getBasicCredentials = () => {
        var basicUser = localStorage.getItem('basic-user')
        var basicPass = localStorage.getItem('basic-pass')
        if (null != basicUser && null != basicPass) {
            return window.btoa(basicUser + ':' + basicPass)
        }
    }

    let getCrawlURLStr = (operation) => {
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

    let getCrawlURL = function(url) {
        var defer = new $.Deferred()
        var ajax = $.get({
            url:url,
            cache: false,
            timeout: 2000
        }).done(function(data, status, ajax) {
            defer.resolveWith(this, arguments)
        }).fail(function(data, status, ajax) {
            defer.resolveWith(this, arguments)
        })
        return $.extend({}, ajax, defer.promise())
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
            var urls = getCrawlURLStr(PROC_BEGIN)
            var proc = browser.i18n.getMessage('txt_begin')
            if (0 >= urls.length) {
                setNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_require_fqdn_verify_code'))
            } else {
                var xhr = []
                $.each(urls, (idx, url) => {
                    xhr.push(getCrawlURL(url))
                })
                $.when.apply($, xhr).done(function() {
                    var isSuccess = true;
                    $.each(arguments, (idx, arg) => {
                        if (arg[1] != 'success' || arg[0].trim() != localStorage.getItem('verify-code')) {
                            isSuccess = false
                            return false;
                        }
                    })
                    if (isSuccess) {
                        setNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_success_access_fqdn', [proc]))
                        changeIcon(PROC_BEGIN)
                    } else {
                        setNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                        changeIcon(PROC_COMMIT)
                    }
                }).fail(function() {
                    setNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                    changeIcon(PROC_COMMIT)
                })
            }
        } else {
            var urls = getCrawlURLStr(PROC_COMMIT)
            var proc = browser.i18n.getMessage('txt_commit')
            if (0 >= urls.length) {
                setNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_require_fqdn_verify_code'))
            } else {
                var xhr = []
                $.each(urls, (idx, url) => {
                    xhr.push(getCrawlURL(url))
                })
                $.when.apply($, xhr).done(function() {
                    var isSuccess = true;
                    $.each(arguments, (idx, arg) => {
                        if (arg[1] != 'success' || arg[0].trim() != localStorage.getItem('verify-code')) {
                            isSuccess = false
                            return false;
                        }
                    })
                    if (isSuccess) {
                        setNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_success_access_fqdn', [proc]))
                        changeIcon(PROC_COMMIT)
                    } else {
                        setNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                        changeIcon(PROC_BEGIN)
                    }
                }).fail(function() {
                    setNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                    changeIcon(PROC_BEGIN)
                })
            }
        }
    });

    let getAutoAccessUrl = () => {
        var serverNames = localStorage.getItem('server-names')
        var verifyCode = localStorage.getItem('verify-code')
        var url = null
        if (undefined !== serverNames && undefined !== verifyCode) {
            for (let server in serverNames) {
                if (serverNames[server][0]) {
                    url = serverNames[server].trim()
                    break
                }
            }
        }
        return url
    };
})