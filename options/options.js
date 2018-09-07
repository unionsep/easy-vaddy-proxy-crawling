$(() => {
    let setNotification = (proc, status, message) => {
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/blue_48.png'),
            'title': browser.i18n.getMessage('notification_title', [status, proc]),
            'message': message
        });
    };

    $(document).ready(event => {
        var serverNames = localStorage.getItem('server-names');
        var elemServerNames = $('.server-names');
        if  (null != serverNames) {
            serverNames = JSON.parse(serverNames);
            for (let server in serverNames) {
                if (null != serverNames[server]) {
                    elemServerNames.eq(server).find('label input[type="radio"]').prop('checked', serverNames[server][0]);
                    elemServerNames.eq(server).find('input[type="text"]').val(serverNames[server][1]);
                } else {
                    elemServerNames.eq(server).find('label input[type="radio"]').prop('checked', '');
                    elemServerNames.eq(server).find('input[type="text"]').val('');
                }
            }
        }
        if (0 >= elemServerNames.find('label input[type="radio"]:checked').length) {
            elemServerNames.eq(0).find('label input[type="radio"]').prop('checked', true);
        }
        $('#verify-code').val(localStorage.getItem('verify-code'));
        $('#version').val(localStorage.getItem('version'));
        $('#auto-access').prop('checked', localStorage.getItem('auto-access'));
        $('#basic-user').val(localStorage.getItem('basic-user'));
        $('#basic-pass').val(localStorage.getItem('basic-pass'));
    });

    $('#save').on('click', event => {
        event.preventDefault();
        var serverNames = {};
        var serverCount = 0;
        var invalidServerNum = 0;
        $('.server-names').each((idx, elem) => {
            var text = $(elem).find('input[type="text"]').val();
            var radio = $(elem).find('label input[type="radio"]').prop('checked');
            if ('' == text) {
                if (true == radio) {
                    invalidServerNum = idx + 1;
                    return false;
                } else {
                    serverNames[idx] = null;
                }
            } else {
                serverNames[idx] = [radio, text];
                serverCount++;
            }
        });

        var verifyCode = $('#verify-code').val();
        
        if ('' == verifyCode) {
            setNotification('Option Save', 'Failed', browser.i18n.getMessage('msg_failed_require_verification'));
        } else if (0 < invalidServerNum) {
            setNotification('Option Save', 'Failed', browser.i18n.getMessage('msg_failed_invalid_fqdn_pattern', invalidServerNum));
        } else if (0 >= serverCount) {
            setNotification('Option Save', 'Failed', browser.i18n.getMessage('msg_failed_require_fqdn'));
        } else {
            localStorage.setItem('server-names', JSON.stringify(serverNames));
            localStorage.setItem('verify-code', verifyCode);
            localStorage.setItem('version', $('#version').val());
            if ($('#auto-access').prop('checked')) {
                localStorage.setItem('auto-access', true);
            } else {
                localStorage.setItem('auto-access', false);
            }
            var basicUser = $('#basic-user').val();
            var basicPass = $('#basic-pass').val();
            if (!basicUser || !basicPass) {
                localStorage.removeItem('basic-user');
                localStorage.removeItem('basic-pass');
            } else {
                localStorage.setItem('basic-user', basicUser);
                localStorage.setItem('basic-pass', basicPass);
            }
            setNotification('Option Save', 'Success', browser.i18n.getMessage('msg_success_save_option'));
        }
    });

    $('#reset').on('click', event => {
        event.preventDefault();
        localStorage.removeItem('server-names');
        localStorage.removeItem('verify-code');
        localStorage.removeItem('auto-access');
        localStorage.removeItem('basic-user');
        localStorage.removeItem('basic-pass');
        $('.server-names').each((idx, elem) => {
            $(elem).find('input[type="text"]').val('');
            $(elem).find('label input[type="radio"]').prop('checked', false);
        });
        $('#verify-code').val('');
        $('#auto-access').prop('checked', false);
        $('#basic-user').val('');
        $('#basic-pass').val('');
        $('.server-names').eq(0).find('label input[type="radio"]').prop('checked', true);
    });
});