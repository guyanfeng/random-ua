"use strict"

async function modify_headers(details) {
    const config = await browser.storage.local.get(['is_enabled','userAgents', 'whitelist', 'binds']).catch(onError)
    const is_enabled = config.is_enabled;
    if (!is_enabled){
        return;
    }
    let whitelist_cfg = config.whitelist
    if (whitelist_cfg === undefined){
        whitelist_cfg = 'white_list.com'
    }
    let binds_cfg = config.binds
    if (binds_cfg === undefined){
        binds_cfg = 'bind_url###bind_user_agent'
    }
    let userAgents_cfg = config.userAgents
    if (userAgents_cfg === undefined){
        userAgents_cfg = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0\n'
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

    // 判断 url 是否在白名单中
    if (whitelist_cfg){
        const whitelist_list = whitelist_cfg.split('\n').filter(item => item.trim() !== '');
        // 每一行为一个白名单，判断传入的url是否在白名单中
        for (const whitelist of whitelist_list){
            if (details.url.indexOf(whitelist) !== -1){
                return;
            }
        }
    }
    let is_change = false;
    let new_ua = '';
    //判断是否强制绑定
    if (binds_cfg){
        const binds_list = binds_cfg.split('\n').filter(item => item.trim() !== '');
        for (const bind of binds_list){
            const bind_item = bind.split('###');
            if (details.url.indexOf(bind_item[0]) !== -1){
                is_change = true;
                new_ua = bind_item[1];
                break;
            }
        }
    }
    if (!is_change){
        //随机选择一个 user agent
        if (!userAgents_cfg) {
            return;
        }
        const userAgents = userAgents_cfg.split('\n').filter(item => item.trim() !== '');
        const random_index = Math.floor(Math.random() * userAgents.length);
        new_ua = userAgents[random_index];
        is_change = true;
    }

    if (is_change){
        for (const header of details.requestHeaders) {
            if (header.name.toLowerCase() === 'user-agent') {
                // 修改 user agent
                header.value = new_ua;
                break;
            }
        }
    }

    return { requestHeaders: details.requestHeaders };
}

// 拦截并修改 user agent
browser.webRequest.onBeforeSendHeaders.addListener(
    modify_headers,
    { urls: ['<all_urls>'], types: ['main_frame'] },
    ['blocking', 'requestHeaders']
);

function onError(error) {
    console.log(error);
}