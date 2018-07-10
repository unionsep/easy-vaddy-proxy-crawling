function restoreOptions(e) {
    var serverName = localStorage.getItem('server-name');
    var verifiCode = localStorage.getItem('verify-code');
    var autoAccess = localStorage.getItem('auto-access');
    var basicUser = localStorage.getItem('basic-user');
    var basicPass = localStorage.getItem('basic-pass');

    document.querySelector('#server-name').value = serverName;
    document.querySelector('#verify-code').value = verifiCode;
    if (1 == autoAccess) {
        document.querySelector('#auto-access').checked = 'checked';
    } else {
        document.querySelector('#auto-access').checked = '';
    }
    document.querySelector('#basic-user').value = basicUser;
    document.querySelector('#basic-pass').value = basicPass;
}

function saveOptions(e) {
    e.preventDefault();
    var serverName = document.querySelector('#server-name').value;
    var verifyCode = document.querySelector('#verify-code').value;
    if (!serverName || !verifyCode) {
        window.alert('require Server Name and Verification Code');
    } else {
        localStorage.setItem('server-name', serverName);
        localStorage.setItem('verify-code', verifyCode);
        console.log(document.querySelector('#auto-access').checked);
        if (document.querySelector('#auto-access').checked) {
            localStorage.setItem('auto-access', 1);
        } else {
            localStorage.setItem('auto-access', 0);
        }
        var basicUser = document.querySelector('#basic-user').value;
        var basicPass = document.querySelector('#basic-pass').value;
        if (!basicUser || !basicPass) {
            localStorage.removeItem('basic-user');
            localStorage.removeItem('basic-pass');
        } else {
            localStorage.setItem('basic-user', basicUser);
            localStorage.setItem('basic-pass', basicPass);
        }
    }
}

function resetOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        'server-name': null,
        'verify-code': null,
        'auto-access': 0,
        'basic-user': null,
        'basic-pass': null
    });
    document.querySelector('#server-name').value = '';
    document.querySelector('#verify-code').value = '';
    document.querySelector('#auto-access').checked = '';
    document.querySelector('#basic-user').value = '';
    document.querySelector('#basic-pass').value = '';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#reset').addEventListener('click', resetOptions);