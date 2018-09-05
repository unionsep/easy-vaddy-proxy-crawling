$(() => {
    let setNotification = (proc, status, message) => {
        var title = status + ' ' + proc + ' VAddy Proxy Crawl Options';
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/blue_48.png'),
            'title': title,
            'message': message
        });
    };

    $(document).ready(event => {
        var serverNames = localStorage.getItem('server-names');
        var elemServerNames = $('.server-names');
        if  (null != serverNames) {
            serverNames = JSON.parse(serverNames);
            var idx = 0;
            for (let server in serverNames) {
                elemServerNames.eq(idx).find('input[type="text"]').val(server);
                elemServerNames.eq(idx).find('label input[type="radio"]').prop('checked', serverNames[server]);
                idx++;
            }
        }
        if (0 >= elemServerNames.find('label input[type="radio"]:checked').length) {
            elemServerNames.eq(0).find('label input[type="radio"]').prop('checked', true);
        }
        $('#verify-code').val(localStorage.getItem('verify-code'));
        $('#auto-access').prop('checked', localStorage.getItem('auto-access'));
        $('#basic-user').val(localStorage.getItem('basic-user'));
        $('#basic-pass').val(localStorage.getItem('basic-pass'));
    });

    $('#save').on('click', event => {
        event.preventDefault();
        var serverNames = {};
        $('.server-names').each((idx, elem) => {
            var text = $(elem).find('input[type="text"]').val();
            var radio = $(elem).find('label input[type="radio"]').prop('checked');
            if ('' == text) {
                if (true == radio) {
                    setNotification('Option Save', 'Failed', 'Please fill in ' + (idx + 1) + 'th Server Name .');
                    return false;
                } else {
                    return true;
                }
            } else {
                serverNames[text] = radio;
            }
        });

        var verifyCode = $('#verify-code').val();

        if (null == verifyCode || 0 > Object.keys(serverNames).length) {
            setNotification('Option Save', 'Failed', 'Require Server Name and Verification Code .');
        } else {
            localStorage.setItem('server-names', JSON.stringify(serverNames));
            localStorage.setItem('verify-code', verifyCode);
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

            setNotification('Option Save', 'Success', 'Saved VAddy Proxy Crawl Options .');
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