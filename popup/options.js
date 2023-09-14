"use strict"

function onError(error) {
    console.log(error);
}
const result = await browser.storage.local.get(['is_enabled','userAgents', 'whitelist', 'binds']).catch(onError)
document.getElementById('is_enabled').checked = result.is_enabled || false;
document.getElementById('userAgents').value = result.userAgents || '';
document.getElementById('whitelist').value = result.whitelist || '';
document.getElementById('binds').value = result.binds || '';

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
