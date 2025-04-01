"use strict"
/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2019 The noVNC authors
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

import * as Log from '../core/util/logging.js';

class WebUtility {
    settings: Record<string, any>;
    constructor() {
        this.settings = {};
    }
    initLogging(level:string) {
        
        if (typeof level !== "undefined") {
            Log.initLogging(level);
        } else {
            const param = document.location.href.match(/logging=([A-Za-z0-9._-]*)/);
            Log.initLogging(param || undefined);
        }
    }

    getQueryVar(name:string, defVal:any | null) {
        
        const re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
              match = document.location.href.match(re);
        if (typeof defVal === 'undefined') { defVal = null; }
    
        if (match) {
            return decodeURIComponent(match[1]);
        }
    
        return defVal;
    }

    getHashVar(name:string, defVal?:any | null) {
    
        const re = new RegExp('.*[&#]' + name + '=([^&]*)'),
              match = document.location.hash.match(re);
        if (typeof defVal === 'undefined') { defVal = null; }
    
        if (match) {
            return decodeURIComponent(match[1]);
        }
    
        return defVal;
    }

    getConfigVar(name:string, defVal:any | null) {
    
        const val = this.getHashVar(name);
    
        if (val === null) {
            return this.getQueryVar(name, defVal);
        }
    
        return val;
    }

    createCookie(name:string, value:any, days:number) {
    
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

    readCookie(name:string, defaultValue:any | null) {
    
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

    eraseCookie(name:string) {
    
        this.createCookie(name, "", -1);
    }

    initSettings() {
        let chromeWindow:any = window
        if (!chromeWindow.chrome || !chromeWindow.chrome.storage) {
            this.settings = {};
            return Promise.resolve();
        }
    
        return new Promise(resolve => chromeWindow.chrome.storage.sync.get(resolve))
            .then((cfg:any) => { this.settings = cfg; });
    }

    setSetting(name:string, value:any) {
        this.settings[name] = value;
    }

    writeSetting(name:string, value:any, saveTolocalStorage:boolean=true) {
        if (this.settings[name] === value) return;
        this.settings[name] = value;
        if(saveTolocalStorage) {
            let chromeWindow:any = window
            if (chromeWindow.chrome && chromeWindow.chrome.storage) {
                chromeWindow.chrome.storage.sync.set(this.settings);
            } else {
                this.localStorageSet(name, value);
            }
        }
    }

    readSetting(name:string, readLocalStorage:boolean = true, defaultValue:any) {
        let value;
        let chromeWindow:any = window
        if ((name in this.settings) || (chromeWindow.chrome && chromeWindow.chrome.storage)) {
            value = this.settings[name];
        } else if(readLocalStorage) {
            value = this.localStorageGet(name);
            this.settings[name] = value;
        }
        if (typeof value === "undefined") {
            value = null;
        }
    
        if (value === null && typeof defaultValue !== "undefined") {
            return defaultValue;
        }
    
        return value;
    }

    eraseSetting(name:string, clearLocalStorage:boolean = false) {
        // Deleting here means that next time the setting is read when using local
        // storage, it will be pulled from local storage again.
        // If the setting in local storage is changed (e.g. in another tab)
        // between this delete and the next read, it could lead to an unexpected
        // value change.
        delete this.settings[name];
        if(!clearLocalStorage) {
            let chromeWindow:any = window
            if (chromeWindow.chrome && chromeWindow.chrome.storage) {
                chromeWindow.chrome.storage.sync.remove(name);
            } else {
                this.localStorageRemove(name);
            }
        }
    }

    logOnce(msg:string, level = "warn") {
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

    localStorageGet(name:string) {
        let r;
        try {
            r = localStorage.getItem(name);
        } catch (e) {
            if (e instanceof DOMException) {
                this.logOnce(cookiesMsg);
                this.logOnce("'localStorage.getItem(" + name + ")' failed: " + e,
                        "debug");
            } else {
                throw e;
            }
        }
        return r;
    }

    localStorageSet(name:string, value:any) {
        try {
            localStorage.setItem(name, value);
        } catch (e) {
            if (e instanceof DOMException) {
                this.logOnce(cookiesMsg);
                this.logOnce("'localStorage.setItem(" + name + "," + value +
                        ")' failed: " + e, "debug");
            } else {
                throw e;
            }
        }
    }

    localStorageRemove(name:string) {
        try {
            localStorage.removeItem(name);
        } catch (e) {
            if (e instanceof DOMException) {
                this.logOnce(cookiesMsg);
                this.logOnce("'localStorage.removeItem(" + name + ")' failed: " + e,
                        "debug");
            } else {
                throw e;
            }
        }
    }
}

// init log level reading the logging HTTP param

let loggedMsgs:any[] = [];

let cookiesMsg = "Couldn't access noVNC settings, are cookies disabled?";

export default WebUtility;