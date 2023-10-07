"use strict"

function onError(error) {
    console.log(error);
}
const result = await browser.storage.local.get(['is_enabled','userAgents', 'whitelist', 'binds']).catch(onError)
document.getElementById('is_enabled').checked = result.is_enabled || false;
let userAgents = result.userAgents
if (userAgents === undefined){
    userAgents = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0\n'
+ 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/  104.0.0.0 Safari/537.36\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 Edg/87.0.664.52\n'
+ 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15\n'
+ 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0\n'
+ 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36\n'
+ 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.7) Gecko/20050427 Red Hat/1.7.7-1.1.3.4\n'
+ 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 YaBrowser/22.7.0 Yowser/2.5 Safari/537.36\n'
+ 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0\n'
+ 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36,gzip(gfe)\n'
+ 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/116.0.5845.177 Mobile/15E148 Safari/604.1\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36\n'
+ 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\n'
+ 'Mozilla/5.0 (Windows NT 10.0; ) Gecko/20100101 Firefox/61.0\n'
+ 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.200\n'
}
document.getElementById('userAgents').value = userAgents;
let whitelist = result.whitelist
if (whitelist === undefined){
    whitelist = 'white_list.com'
}
document.getElementById('whitelist').value = whitelist
let binds = result.binds
if (binds === undefined){
    binds = 'bind_url###bind_user_agent'
}
document.getElementById('binds').value = binds

document.getElementById('saveButton').addEventListener('click', async function () {
    const userAgents = document.getElementById('userAgents').value;
    const whitelist = document.getElementById('whitelist').value;
    const binds = document.getElementById('binds').value;
    const is_enabled = document.getElementById('is_enabled').checked;

    const new_config = {'is_enabled': is_enabled, 'userAgents': userAgents, 'whitelist': whitelist, 'binds': binds }
    await browser.storage.local.set(new_config).catch(onError)
    await browser.browserAction.setIcon({
        path: is_enabled?'../icons/random-ua.png':'../icons/random-ua-gray.png'
    }).catch(onError)
    alert('Settings saved!');
    window.close()
})
