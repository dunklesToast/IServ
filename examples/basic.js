const Mod = require('../index');
const IServ = new Mod(process.env.host, process.env.username, process.env.password, false, false);

(async function f() {
    await IServ.login();
    console.log(`Cookies are ${(await IServ.isCookieValid() ? 'valid' : 'invalid')}`)
})();