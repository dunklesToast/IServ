const IServ = require('../index');
const iserv = new IServ(process.env.host, process.env.username, process.env.password, false, false);

(async function f() {
    await iserv.login();
    console.log(`Cookies are ${(await iserv.isCookieValid() ? 'valid' : 'invalid')}`)
})();
