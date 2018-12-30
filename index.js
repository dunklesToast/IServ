const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');


/**
 * @version 0.2
 * @author dunklesToast / Tom Sacher
 * @licence MIT
 */
class IServTool {

    /**
     * Create a IServTool instance
     * @constructor
     * @param {String} ServerHost - the host of the IServ Instance. Without protocol
     * @param {String} username - username used for login
     * @param {String} password - password used for login
     * @param {boolean} [keepalive] - Not yet implemented
     * @param {boolean} [log] - Enable debug logging
     * @param {boolean} [reuseCookies] - save cookies and reuse them. only works for one user
     */
    constructor(ServerHost, username, password, keepalive, log = false, reuseCookies) {
        this._host = ServerHost;
        this._username = username;
        this._password = password;
        this._log = function (msg) {
            if (log) console.log(msg);
        };
        this._keepalive = keepalive;
        this._cookieHeader = null;
        this.reuseCookies = reuseCookies;
        const cookies = this._getPresavedHeaders();
        this._axios = axios.create({
            baseURL: `https://${ServerHost}`,
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 303;
            },
            headers: {
                'Cookie': cookies || ''
            },
        });
    }

    /**
     * Login
     * @returns {Promise<void>}
     */
    async login() {
        if (this.reuseCookies && await this.isCookieValid()) {
            this._log('[LOGIN] Skipping Login since Cookies already valid!');
            return;
        }
        this._log('[LOGIN] Logging in...');
        const form = querystring.stringify({
            '_username': this._username,
            '_password': this._password
        });
        this._log('[LOGIN] Built q-string');
        const data = await this._axios({
            data: form,
            method: 'POST',
            url: '/iserv/login_check',
        });
        this._axios = await axios.create({
            baseURL: `https://${this._host}`,
            headers: {
                'Cookie': (data.headers["set-cookie"]) || '',
            },
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 303;
            }
        });
        await this._saveCookies((data.headers["set-cookie"]));
        this._log('[LOGIN] Logged In')
    }

    /**
     * Get all notifications from the Server for the logged in account
     * @param {String} since - Date where the Server should start fetching
     * @returns {Promise<*>}
     */
    async getNotifications(since) {
        if(!since) throw new Error('No since given')
        this._log('[GETNOTI] Getting Notifications since ' + since);
        // Time Format looks like this
        // 2018-12-29T23:21:00+01:00
        const resp = await this._axios({
            url: '/iserv/user/api/notifications?since=' + encodeURIComponent(since)
        });
        this._log('[GETNOTI] Got notificications');
        return resp.data
    }

    /**
     * Get all Mailfolders / Inboxes for current user
     * @returns {Promise<*>}
     */
    async getMailFolders() {
        const resp = await this._axios({
            url: 'iserv/mail/api/folder/list'
        });
        return resp.data;
    }

    /**
     * Get all Mails in INBOX
     * @returns {Promise<*>}
     */
    async getUnreadMails() {
        const resp = await this._axios({
            url: 'iserv/mail/api/unread/inbox'
        });
        return resp.data;
    }

    /**
     * Get all Messages for specified Inbox
     * @param {String} path=INBOX
     * @param {(int|string)} length=50 - Amount of Mails returned
     * @param {(int|string)} start=0 - Offset (50 for starting at 50. Mail)
     * @param {string} column=date - Set column for sorting
     * @param {string} dir=desc - Sorting direction (desc/asc)
     * @returns {Promise<Object>}
     */
    async getMessagesForInbox(path = 'INBOX', length = 50, start = 0, column = 'date', dir = 'desc') {
        const resp = await this._axios({
            url: `iserv/mail/api/message/list`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                path: path,
                length: length,
                start: start,
                'order[column]': column,
                'order[dir]': dir
            }
        });
        return resp.data
    }

    /**
     * Get all upcoming Events
     * @param {boolean} includeSubscriptions=true - Include Subscriptions
     * @param {(int|String)} limit=14 - how many events to be returnes
     * @returns {Promise<Object>}
     */
    async getUpcomingEvents(includeSubscriptions = false, limit = 14) {
        const url = "https://mcggehrden.de/iserv/calendar/api/upcoming?includeSubscriptions=false&limit=14";
        const resp = await this._axios({
            url: 'iserv/calendar/api/upcoming',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                includeSubscriptions: includeSubscriptions,
                limit: limit
            }
        });
        return resp.data;
    }

    /**
     * Get a users Profile Picture. Returns false if no image was found
     * @param {String} user - Username you want the image from
     * @param {(int|String)} w= - Image width, leave blank for full size
     * @param {(int|String)} h= - Image height, leave blank for full size
     * @returns {Promise<Object>}
     */
    async getUserProfilePic(user, w = '', h = '') {
        try {
            const resp = await this._axios({
                url: `iserv/addressbook/public/image/${user}/photo/${w}/${h}`,
                responseType: 'arraybuffer'
            });
            return resp.data;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get a Message (Mail) by ID
     * @param {(int|String)} id - Message ID
     * @param {String} path=INBOX - Message Path (Inbox name)
     * @returns {Promise<Object>}
     */
    async getMessageByID(id, path = "INBOX") {
        this._log(`[GMBID] Getting Message #${id} from "${path}"`)
        if (!path) throw new Error('No message ID given');
        const resp = await this._axios({
            url: '/iserv/mail/api/message',
            params: {
                path: path,
                msg: id
            }
        });
        return resp.data
    }

    /**
     * Quick user lookup - for autocompletion
     * @param {String} query - Query
     * @returns {Promise<Object>}
     */
    async userLookup(query) {
        if (!query) throw new Error('No query given to user lookup');
        const resp = await this._axios({
            url: 'iserv/addressbook/lookup?query=warnke',
            params: {
                query: query
            }
        });
        return resp.data
    }

    /**
     * Get Folder Tree (Files)
     * @param {String} [subfolder] - ID to create tree. Leave blank for root
     * @returns {Promise<Object>}
     */
    async getFolderTree(subfolder = '') {
        const resp = await this._axios({
            url: 'iserv/file.json/' + subfolder
        });
        return resp.data;
    }

    /**
     * Get all EventSources aka Calendars
     * @returns {Promise<Object>}
     */
    async getEventSources() {
        const resp = await this._axios({
            url: 'iserv/calendar/api/eventsources'
        });
        return resp.data
    }

    /**
     * Get Events from Source
     * @param {String} source - Path to source
     * @param {String} start - Start date for query
     * @param {String} end - End date for query
     * @returns {Promise<Object>}
     */
    async getEventsFromSource(source, start, end){
        const resp = await this._axios({
            url: 'iserv/calendar/api/feed',
            params: {
                cal: source,
                start: start,
                end: end
            }
        });
        return resp.data;
    }

    _getPresavedHeaders() {
        this._log('[CKS] Trying to load saved cookies');
        if (this.reuseCookies && fs.existsSync('./headers')) {
            this._log('[CKS] Found them Cookies');
            return JSON.parse(fs.readFileSync('./headers').toString())
        } else {
            this._log('[CKS] Havent found any pre-saved headers');
        }
    }

    async _saveCookies(h) {
        if (this.reuseCookies) fs.writeFileSync('./headers', JSON.stringify(h))
    }

    /**
     * Check if the saved Cookies are still valid
     * @returns {Promise<Object>}
     */
    async isCookieValid() {
        try {
            await this._axios({
                url: 'iserv/'
            });
            this._log('[isValid] Cookies are valid.');
            return true;
        } catch (e) {
            this._log(`[isValid] Cookies NOT valid. Check returned ${e.response.status} (${e.response.statusText})`);
            return false;
        }
    }

}

module.exports = IServTool;
