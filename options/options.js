function restoreOptions(e) {
    var serverName = localStorage.getItem('server-name');
    var verifiFile = localStorage.getItem('verify-file');
    var basicUser = localStorage.getItem('basic-user');
    var basicPass = localStorage.getItem('basic-pass');

    document.querySelector('#server-name').value = serverName;
    document.querySelector('#verify-file').value = verifiFile;
    document.querySelector('#basic-user').value = basicUser;
    document.querySelector('#basic-pass').value = basicPass;
}

function saveOptions(e) {
    e.preventDefault();
    var serverName = document.querySelector('#server-name').value;
    var verifyFile = document.querySelector('#verify-file').value;
    if (!serverName || !verifyFile) {
        window.alert('require Server Name and Verification FileName');
    } else {
        localStorage.setItem('server-name', serverName);
        localStorage.setItem('verify-file', verifyFile);
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
        'verify-file': null,
        'basic-user': null,
        'basic-pass': null
    });
    document.querySelector('#server-name').value = '';
    document.querySelector('#verify-file').value = '';
    document.querySelector('#basic-user').value = '';
    document.querySelector('#basic-pass').value = '';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#reset').addEventListener('click', resetOptions);