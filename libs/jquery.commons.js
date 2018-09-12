;(function($){
    const ICON_REC = 'icons/red_19.png';
    const ICON_UNREC = 'icons/blue_19.png';
    const PROC_BEGIN = 'begin';
    const PROC_COMMIT = 'commit';
    const VERSION_V2 = 2;

    $.commons = {};

    $.commons.localize = function () {
        var htmls = document.getElementsByTagName('html');
        for (var j = 0; j < htmls.length; j++) {
            var html = htmls[j];
            var oldHtml = html.innerHTML.toString();
            var newHtml = oldHtml.replace(/__MSG_(\w+)__/g, function(match, v1) {
                return v1 ? browser.i18n.getMessage(v1) : "";
            });
            if (newHtml != oldHtml) {
                html.innerHTML = newHtml;
            }
        }
    };
    
    $.commons.iconInitialize = function () {
        if (null == localStorage.getItem('icon')) {
            $.commons.changeIcon(PROC_COMMIT);
        } else {
            if (ICON_REC == localStorage.getItem('icon')) {
                $.commons.changeIcon(PROC_BEGIN);
            } else {
                $.commons.changeIcon(PROC_COMMIT);
            }
        }
    };

    $.commons.changeIcon = function (proc) {
        if (PROC_BEGIN === proc) {
            localStorage.setItem('icon', ICON_REC);
            browser.browserAction.setIcon({path: ICON_REC});
        } else {
            localStorage.setItem('icon', ICON_UNREC);
            browser.browserAction.setIcon({path: ICON_UNREC});
        }
    };

    $.commons.createNotification = function (proc, status, message) {
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/blue_48.png'),
            'title': browser.i18n.getMessage('notification_title', [status, proc]),
            'message': message
        });
    };

    $.commons.createBasicCredentialHeader = function () {
        var basicUser = localStorage.getItem('basic-user');
        var basicPass = localStorage.getItem('basic-pass');
        if (null != basicUser && null != basicPass) {
            return window.btoa(basicUser + ':' + basicPass);
        }
    };

    $.commons.createCrawlURLStr = function (operation) {
        if (PROC_BEGIN !== operation && PROC_COMMIT !== operation) {
            return [];
        }
        var urls = [];
        var serverNames = localStorage.getItem('server-names');
        var verifyCode = localStorage.getItem('verify-code');
        var version = localStorage.getItem('version');
        var projectId = localStorage.getItem('project-id');
        if (serverNames !== undefined && verifyCode !== undefined) {
            var serverNames = JSON.parse(serverNames);
            for (let server in serverNames) {
                if (null != serverNames[server]) {
                    if (VERSION_V2 == version) {
                        urls.push(serverNames[server][1].trim() + '/vaddy-' + verifyCode.trim() + '.html?action=' + operation + '&project_id=' + projectId);
                    } else {
                        urls.push(serverNames[server][1].trim() + '/vaddy-' + verifyCode.trim() + '.html?action=' + operation);
                    }
                }
            }
        }
        return urls
    };

    $.commons.httpGetCrowlURL = function (url) {
        var defer = new $.Deferred();
        var ajax = $.get({
            url:url,
            cache: false,
            timeout: 4000,
            beforeSend: function(xhr) {
                var credentials = $.commons.createBasicCredentialHeader();
                if (credentials) {
                    xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                }
            }
        }).done(function(data, status, ajax) {
            defer.resolveWith(this, arguments);
        }).fail(function(data, status, ajax) {
            defer.resolveWith(this, arguments);
        })
        return $.extend({}, ajax, defer.promise());
    };

    $.commons.createAutoAccessURLTabs = function () {
        var serverNames = localStorage.getItem('server-names')
        var verifyCode = localStorage.getItem('verify-code')
        var url = null
        if (null != serverNames && null != verifyCode) {
            serverNames = JSON.parse(serverNames)
            for (let server in serverNames) {
                if (serverNames[server][0]) {
                    url = serverNames[server][1].trim()
                    break
                }
            }
        }
        if (url) {
            browser.tabs.create({
                url: browser.runtime.getURL(url)
            })
        }
    };
})(jQuery);