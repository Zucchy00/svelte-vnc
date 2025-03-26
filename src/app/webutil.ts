/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2019 The noVNC authors
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

import * as Log from '../core/util/logging.js';

// init log level reading the logging HTTP param
export function initLogging(level:string) {
    "use strict";
    if (typeof level !== "undefined") {
        Log.initLogging(level);
    } else {
        const param = document.location.href.match(/logging=([A-Za-z0-9._-]*)/);
        Log.initLogging(param || undefined);
    }
}

// Read a query string variable
// A URL with a query parameter can look like this (But will most probably get logged on the http server):
// https://www.example.com?myqueryparam=myvalue
//
// For privacy (Using a hastag #, the parameters will not be sent to the server)
// the url can be requested in the following way:
// https://www.example.com#myqueryparam=myvalue&password=secretvalue
//
// Even mixing public and non public parameters will work:
// https://www.example.com?nonsecretparam=example.com#password=secretvalue
export function getQueryVar(name:string, defVal:any | null) {
    "use strict";
    const re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
          match = document.location.href.match(re);
    if (typeof defVal === 'undefined') { defVal = null; }

    if (match) {
        return decodeURIComponent(match[1]);
    }

    return defVal;
}

// Read a hash fragment variable
export function getHashVar(name:string, defVal?:any | null) {
    "use strict";
    const re = new RegExp('.*[&#]' + name + '=([^&]*)'),
          match = document.location.hash.match(re);
    if (typeof defVal === 'undefined') { defVal = null; }

    if (match) {
        return decodeURIComponent(match[1]);
    }

    return defVal;
}

// Read a variable from the fragment or the query string
// Fragment takes precedence
export function getConfigVar(name:string, defVal:any | null) {
    "use strict";
    const val = getHashVar(name);

    if (val === null) {
        return getQueryVar(name, defVal);
    }

    return val;
}

/*
 * Cookie handling. Dervied from: http://www.quirksmode.org/js/cookies.html
 */

// No days means only for this browser session
export function createCookie(name:string, value:any, days:number) {
    "use strict";
    let date:any, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }

    let secure;
    if (document.location.protocol === "https:") {
        secure = "; secure";
    } else {
        secure = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/" + secure;
}

export function readCookie(name:string, defaultValue:any | null) {
    "use strict";
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }

    return (typeof defaultValue !== 'undefined') ? defaultValue : null;
}

export function eraseCookie(name:string) {
    "use strict";
    createCookie(name, "", -1);
}

/*
 * Setting handling.
 */

let settings:any = {};

export function initSettings() {
    let chromeWindow:any = window
    if (!chromeWindow.chrome || !chromeWindow.chrome.storage) {
        settings = {};
        return Promise.resolve();
    }

    return new Promise(resolve => chromeWindow.chrome.storage.sync.get(resolve))
        .then((cfg) => { settings = cfg; });
}

// Update the settings cache, but do not write to permanent storage
export function setSetting(name:string, value:any) {
    settings[name] = value;
}

// No days means only for this browser session
export function writeSetting(name:string, value:any) {
    "use strict";
    if (settings[name] === value) return;
    settings[name] = value;
    let chromeWindow:any = window
    if (chromeWindow.chrome && chromeWindow.chrome.storage) {
        chromeWindow.chrome.storage.sync.set(settings);
    } else {
        localStorageSet(name, value);
    }
}

export function readSetting(name:string, defaultValue:any) {
    "use strict";
    let value;
    let chromeWindow:any = window
    if ((name in settings) || (chromeWindow.chrome && chromeWindow.chrome.storage)) {
        value = settings[name];
    } else {
        value = localStorageGet(name);
        settings[name] = value;
    }
    if (typeof value === "undefined") {
        value = null;
    }

    if (value === null && typeof defaultValue !== "undefined") {
        return defaultValue;
    }

    return value;
}

export function eraseSetting(name:string) {
    "use strict";
    // Deleting here means that next time the setting is read when using local
    // storage, it will be pulled from local storage again.
    // If the setting in local storage is changed (e.g. in another tab)
    // between this delete and the next read, it could lead to an unexpected
    // value change.
    delete settings[name];
    let chromeWindow:any = window
    if (chromeWindow.chrome && chromeWindow.chrome.storage) {
        chromeWindow.chrome.storage.sync.remove(name);
    } else {
        localStorageRemove(name);
    }
}

let loggedMsgs:any[] = [];
function logOnce(msg:string, level = "warn") {
    let fixedLog:any = Log
    if (!loggedMsgs.includes(msg)) {
        switch (level) {
            case "error":
                fixedLog.Error(msg);
                break;
            case "warn":
                fixedLog.Warn(msg);
                break;
            case "debug":
                fixedLog.Debug(msg);
                break;
            default:
                fixedLog.Info(msg);
        }
        loggedMsgs.push(msg);
    }
}

let cookiesMsg = "Couldn't access noVNC settings, are cookies disabled?";

function localStorageGet(name:string) {
    let r;
    try {
        r = localStorage.getItem(name);
    } catch (e) {
        if (e instanceof DOMException) {
            logOnce(cookiesMsg);
            logOnce("'localStorage.getItem(" + name + ")' failed: " + e,
                    "debug");
        } else {
            throw e;
        }
    }
    return r;
}
function localStorageSet(name:string, value:any) {
    try {
        localStorage.setItem(name, value);
    } catch (e) {
        if (e instanceof DOMException) {
            logOnce(cookiesMsg);
            logOnce("'localStorage.setItem(" + name + "," + value +
                    ")' failed: " + e, "debug");
        } else {
            throw e;
        }
    }
}
function localStorageRemove(name:string) {
    try {
        localStorage.removeItem(name);
    } catch (e) {
        if (e instanceof DOMException) {
            logOnce(cookiesMsg);
            logOnce("'localStorage.removeItem(" + name + ")' failed: " + e,
                    "debug");
        } else {
            throw e;
        }
    }
}
