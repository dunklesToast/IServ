<a name="IServTool"></a>

## IServTool
**Kind**: global class  
**Licence**: MIT  
**Version**: 0.2  
**Author**: dunklesToast / Tom Sacher  

* [IServTool](#IServTool)
    * [new IServTool(ServerHost, username, password, [keepalive], [log], [reuseCookies])](#new_IServTool_new)
    * [.login()](#IServTool+login) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getNotifications(since)](#IServTool+getNotifications) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.getMailFolders()](#IServTool+getMailFolders) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.getUnreadMails()](#IServTool+getUnreadMails) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.getMessagesForInbox(path, length, start, column, dir)](#IServTool+getMessagesForInbox) ⇒ <code>Object</code>
    * [.getUpcomingEvents(includeSubscriptions, limit)](#IServTool+getUpcomingEvents) ⇒ <code>Object</code>
    * [.getUserProfilePic(user, w&#x3D;, h&#x3D;)](#IServTool+getUserProfilePic) ⇒ <code>Object</code>
    * [.getMessageByID(id, path)](#IServTool+getMessageByID) ⇒ <code>Object</code>
    * [.userLookup(query)](#IServTool+userLookup) ⇒ <code>Object</code>
    * [.getFolderTree([subfolder])](#IServTool+getFolderTree) ⇒ <code>Object</code>
    * [.getEventSources()](#IServTool+getEventSources) ⇒ <code>Object</code>
    * [.getEventsFromSource(source, start, end)](#IServTool+getEventsFromSource) ⇒ <code>Object</code>
    * [.isCookieValid()](#IServTool+isCookieValid) ⇒ <code>Object</code>

<a name="new_IServTool_new"></a>

### new IServTool(ServerHost, username, password, [keepalive], [log], [reuseCookies])
Create a IServTool instance


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ServerHost | <code>String</code> |  | the host of the IServ Instance. Without protocol |
| username | <code>String</code> |  | username used for login |
| password | <code>String</code> |  | password used for login |
| [keepalive] | <code>boolean</code> |  | Not yet implemented |
| [log] | <code>boolean</code> | <code>false</code> | Enable debug logging |
| [reuseCookies] | <code>boolean</code> |  | save cookies and reuse them. only works for one user |

<a name="IServTool+login"></a>

### iServTool.login() ⇒ <code>Promise.&lt;void&gt;</code>
Login

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  
<a name="IServTool+getNotifications"></a>

### iServTool.getNotifications(since) ⇒ <code>Promise.&lt;\*&gt;</code>
Get all notifications from the Server for the logged in account

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Description |
| --- | --- | --- |
| since | <code>String</code> | Date where the Server should start fetching |

<a name="IServTool+getMailFolders"></a>

### iServTool.getMailFolders() ⇒ <code>Promise.&lt;\*&gt;</code>
Get all Mailfolders / Inboxes for current user

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  
<a name="IServTool+getUnreadMails"></a>

### iServTool.getUnreadMails() ⇒ <code>Promise.&lt;\*&gt;</code>
Get all Mails in INBOX

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  
<a name="IServTool+getMessagesForInbox"></a>

### iServTool.getMessagesForInbox(path, length, start, column, dir) ⇒ <code>Object</code>
Get all Messages for specified Inbox

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>String</code> | <code>INBOX</code> |  |
| length | <code>int</code> \| <code>string</code> | <code>50</code> | Amount of Mails returned |
| start | <code>int</code> \| <code>string</code> | <code>0</code> | Offset (50 for starting at 50. Mail) |
| column | <code>string</code> | <code>&quot;date&quot;</code> | Set column for sorting |
| dir | <code>string</code> | <code>&quot;desc&quot;</code> | Sorting direction (desc/asc) |

<a name="IServTool+getUpcomingEvents"></a>

### iServTool.getUpcomingEvents(includeSubscriptions, limit) ⇒ <code>Object</code>
Get all upcoming Events

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| includeSubscriptions | <code>boolean</code> | <code>true</code> | Include Subscriptions |
| limit | <code>int</code> \| <code>String</code> | <code>14</code> | how many events to be returnes |

<a name="IServTool+getUserProfilePic"></a>

### iServTool.getUserProfilePic(user, w&#x3D;, h&#x3D;) ⇒ <code>Object</code>
Get a users Profile Picture. Returns false if no image was found

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | Username you want the image from |
| w= | <code>int</code> \| <code>String</code> | Image width, leave blank for full size |
| h= | <code>int</code> \| <code>String</code> | Image height, leave blank for full size |

<a name="IServTool+getMessageByID"></a>

### iServTool.getMessageByID(id, path) ⇒ <code>Object</code>
Get a Message (Mail) by ID

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>int</code> \| <code>String</code> |  | Message ID |
| path | <code>String</code> | <code>INBOX</code> | Message Path (Inbox name) |

<a name="IServTool+userLookup"></a>

### iServTool.userLookup(query) ⇒ <code>Object</code>
Quick user lookup - for autocompletion

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>String</code> | Query |

<a name="IServTool+getFolderTree"></a>

### iServTool.getFolderTree([subfolder]) ⇒ <code>Object</code>
Get Folder Tree (Files)

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Description |
| --- | --- | --- |
| [subfolder] | <code>String</code> | ID to create tree. Leave blank for root |

<a name="IServTool+getEventSources"></a>

### iServTool.getEventSources() ⇒ <code>Object</code>
Get all EventSources aka Calendars

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  
<a name="IServTool+getEventsFromSource"></a>

### iServTool.getEventsFromSource(source, start, end) ⇒ <code>Object</code>
Get Events from Source

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | Path to source |
| start | <code>String</code> | Start date for query |
| end | <code>String</code> | End date for query |

<a name="IServTool+isCookieValid"></a>

### iServTool.isCookieValid() ⇒ <code>Object</code>
Check if the saved Cookies are still valid

**Kind**: instance method of [<code>IServTool</code>](#IServTool)  
