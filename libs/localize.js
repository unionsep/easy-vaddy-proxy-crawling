let localizeHtml = () => {
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
}
localizeHtml();