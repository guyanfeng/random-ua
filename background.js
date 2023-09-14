"use strict"

console.log('background.js')

async function modify_headers(details) {
    const config = await browser.storage.local.get(['is_enabled','userAgents', 'whitelist', 'binds']).catch(onError)
    const is_enabled = config.is_enabled;
    if (!is_enabled){
        return;
    }
    const whitelist_cfg = config.whitelist;
    const binds_cfg = config.binds;
    const userAgents_cfg = config.userAgents;

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