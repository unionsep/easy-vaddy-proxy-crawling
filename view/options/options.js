window.onload = function(){
    if (localStorage['vaddy-server-name'] !== undefined) {
        document.getElementById('vaddy-server-name').value = localStorage['vaddy-server-name'];
    }
    
    if (localStorage['vaddy-verification-filename'] !== undefined) {
        document.getElementById('vaddy-verification-filename').value = localStorage['vaddy-verification-filename'];
    }

    function saveSetting() {
        var serverName = document.getElementById('vaddy-server-name').value;
        var verificationFilename = document.getElementById('vaddy-verification-filename').value;
        localStorage['vaddy-server-name'] = serverName;
        localStorage['vaddy-verification-filename'] = verificationFilename;
        window.close();
     }
     
     document.getElementById("save-setting").addEventListener("click", saveSetting);
}