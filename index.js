const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    const BASE_URL = 'https://empleosti.com.mx/api/code-challenge'

    const browser = await puppeteer.launch({
        userDataDir: "./user_data",
        headless: true,
        defaultViewport: {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
        }
    })
    const page = await browser.newPage()
    const JR_TEST = 'https://app.codesignal.com/client-dashboard/tests/639pwB29H4WMB5AQH'
    const SR_TEST = 'https://app.codesignal.com/client-dashboard/tests/wzdzNCmxKoHvqS9CX'

    while(true) {
        const registers = (await axios.get(`${BASE_URL}/registers?invited=0&take=100`)).data

        for (const register of registers) {
            console.log(register)
            await page.goto(register.level === 'jr' ? JR_TEST : SR_TEST)
            await page.waitForSelector(".button[data-name='invite-candidate']")
            await page.click(".button[data-name='invite-candidate']")
            await page.waitForSelector("input[name='email']")
            await page.type("input[name='email']", register.email)
            await page.type("input[name='firstName']", register.first_name)
            await page.type("input[name='lastName']", register.last_name)
            await page.click(".button[data-name='create-invites']")
            await page.waitForSelector(".button[data-name='send-invites']")
            await page.click(".button[data-name='send-invites']")
            await axios.post(`${BASE_URL}/registers/${register.id}`, {'invited': 1})
        }
        console.log('Sleeping 4 minute')
        await page.waitForTimeout(1000 * 240)
    }
    await browser.close()
})();