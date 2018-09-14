$(() => {
    const ICON_UNREC = browser.extension.getURL('icons/unrec_19.png')

    $.commons.iconInitialize()

    browser.browserAction.onClicked.addListener(() => {
        if (ICON_UNREC == localStorage.getItem('icon')) {
            $.commons.crawlBegin()
        } else {
            $.commons.crawlCommit()
        }
    })
})