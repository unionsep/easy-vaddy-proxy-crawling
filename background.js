$(() => {
    const PROC_BEGIN = 'begin'
    const PROC_COMMIT = 'commit'
    const ICON_UNREC = 'icons/unrec_19.png'

    $.commons.iconInitialize()

    browser.browserAction.onClicked.addListener(() => {
        if (ICON_UNREC === localStorage.getItem('icon')) {
            var urls = $.commons.createCrawlURLStr(PROC_BEGIN)
            var proc = browser.i18n.getMessage('txt_begin')
            if (0 >= urls.length) {
                $.commons.createNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_require_fqdn_verify_code'))
            } else {
                var xhr = []
                $.each(urls, (idx, url) => {
                    xhr.push($.commons.httpGetCrowlURL(url))
                })
                $.when.apply($, xhr).done(function() {
                    var isSuccess = true
                    $.each(arguments, (idx, arg) => {
                        if (arg[1] != 'success' || arg[0].trim() != localStorage.getItem('verify-code')) {
                            isSuccess = false
                            return false
                        }
                    })
                    if (isSuccess) {
                        $.commons.createNotification('BEGIN', 'Success', browser.i18n.getMessage('msg_success_access_fqdn', [proc]))
                        $.commons.changeIcon(PROC_BEGIN)
                        if ('true' == localStorage.getItem('auto-access')) {
                            $.commons.createAutoAccessURLTabs()
                        }
                    } else {
                        $.commons.createNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                        $.commons.changeIcon(PROC_COMMIT)
                    }
                }).fail(function() {
                    $.commons.createNotification('BEGIN', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                    $.commons.changeIcon(PROC_COMMIT)
                })
            }
        } else {
            var urls = $.commons.createCrawlURLStr(PROC_COMMIT)
            var proc = browser.i18n.getMessage('txt_commit')
            if (0 >= urls.length) {
                $.commons.createNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_require_fqdn_verify_code'))
            } else {
                var xhr = []
                $.each(urls, (idx, url) => {
                    xhr.push($.commons.httpGetCrowlURL(url))
                })
                $.when.apply($, xhr).done(function() {
                    var isSuccess = true
                    $.each(arguments, (idx, arg) => {
                        if (arg[1] != 'success' || arg[0].trim() != localStorage.getItem('verify-code')) {
                            isSuccess = false
                            return false
                        }
                    })
                    if (isSuccess) {
                        $.commons.createNotification('COMMIT', 'Success', browser.i18n.getMessage('msg_success_access_fqdn', [proc]))
                        $.commons.changeIcon(PROC_COMMIT)
                    } else {
                        $.commons.createNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                        $.commons.changeIcon(PROC_BEGIN)
                    }
                }).fail(function() {
                    $.commons.createNotification('COMMIT', 'Error', browser.i18n.getMessage('msg_failed_access_fqdn', [proc]))
                    $.commons.changeIcon(PROC_BEGIN)
                })
            }
        }
    })
})