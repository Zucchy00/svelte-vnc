/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2018 The noVNC authors
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

/*
 * Localization utilities
 */

export class Localizer {
    language: any; // Prevents TS errors
    _dictionary: any; // Prevents TS errors

    constructor() {
        // Currently configured language
        this.language = 'en';

        // Current dictionary of translations
        this._dictionary = undefined;
    }

    // Configure suitable language based on user preferences
    async setup(supportedLanguages:any, baseURL:any) {
        this.language = 'en'; // Default: US English
        this._dictionary = undefined;

        this._setupLanguage(supportedLanguages);
        await this._setupDictionary(baseURL);
    }

    _setupLanguage(supportedLanguages:any) {
        /*
         * Navigator.languages only available in Chrome (32+) and FireFox (32+)
         * Fall back to navigator.language for other browsers
         */
        let userLanguages;
        if (typeof window.navigator.languages == 'object') {
            userLanguages = window.navigator.languages;
        } else {
            let usernavigator:any = navigator
            userLanguages = [navigator.language || usernavigator.userLanguage];
        }

        for (let i = 0;i < userLanguages.length;i++) {
            const userLang = userLanguages[i]
                .toLowerCase()
                .replace("_", "-")
                .split("-");

            // First pass: perfect match
            for (let j = 0; j < supportedLanguages.length; j++) {
                const supLang = supportedLanguages[j]
                    .toLowerCase()
                    .replace("_", "-")
                    .split("-");

                if (userLang[0] !== supLang[0]) {
                    continue;
                }
                if (userLang[1] !== supLang[1]) {
                    continue;
                }

                this.language = supportedLanguages[j];
                return;
            }

            // Second pass: English fallback
            if (userLang[0] === 'en') {
                return;
            }

            // Third pass pass: other fallback
            for (let j = 0;j < supportedLanguages.length;j++) {
                const supLang = supportedLanguages[j]
                    .toLowerCase()
                    .replace("_", "-")
                    .split("-");

                if (userLang[0] !== supLang[0]) {
                    continue;
                }
                if (supLang[1] !== undefined) {
                    continue;
                }

                this.language = supportedLanguages[j];
                return;
            }
        }
    }

    async _setupDictionary(baseURL:string) {
        if (baseURL) {
            if (!baseURL.endsWith("/")) {
                baseURL = baseURL + "/";
            }
        } else {
            baseURL = "";
        }

        if (this.language === "en") {
            return;
        }
        let language = await import(`./locale/${this.language}.js`);
        this._dictionary = language.default
    }

    // Retrieve localised text
    get(id:number | string) {
        if (typeof this._dictionary !== 'undefined' &&
            this._dictionary[id]) {
            return this._dictionary[id];
        } else {
            return id;
        }
    }

    // Traverses the DOM and translates relevant fields
    // See https://html.spec.whatwg.org/multipage/dom.html#attr-translate
    translateDOM() {
        const self = this;

        function process(elem:any, enabled:boolean) {
            function isAnyOf(searchElement:any, items:any) {
                return items.indexOf(searchElement) !== -1;
            }

            function translateString(str:string) {
                // We assume surrounding whitespace, and whitespace around line
                // breaks is just for source formatting
                str = str.split("\n").map(s => s.trim()).join(" ").trim();
                return self.get(str);
            }

            function translateAttribute(elem:any, attr:any) {
                const str = translateString(elem.getAttribute(attr));
                elem.setAttribute(attr, str);
            }

            function translateTextNode(node:any) {
                const str = translateString(node.data);
                node.data = str;
            }

            if (elem.hasAttribute("translate")) {
                if (isAnyOf(elem.getAttribute("translate"), ["", "yes"])) {
                    enabled = true;
                } else if (isAnyOf(elem.getAttribute("translate"), ["no"])) {
                    enabled = false;
                }
            }

            if (enabled) {
                if (elem.hasAttribute("abbr") &&
                    elem.tagName === "TH") {
                    translateAttribute(elem, "abbr");
                }
                if (elem.hasAttribute("alt") &&
                    isAnyOf(elem.tagName, ["AREA", "IMG", "INPUT"])) {
                    translateAttribute(elem, "alt");
                }
                if (elem.hasAttribute("download") &&
                    isAnyOf(elem.tagName, ["A", "AREA"])) {
                    translateAttribute(elem, "download");
                }
                if (elem.hasAttribute("label") &&
                    isAnyOf(elem.tagName, ["MENUITEM", "MENU", "OPTGROUP",
                                           "OPTION", "TRACK"])) {
                    translateAttribute(elem, "label");
                }
                // FIXME: Should update "lang"
                if (elem.hasAttribute("placeholder") &&
                    isAnyOf(elem.tagName, ["INPUT", "TEXTAREA"])) {
                    translateAttribute(elem, "placeholder");
                }
                if (elem.hasAttribute("title")) {
                    translateAttribute(elem, "title");
                }
                if (elem.hasAttribute("value") &&
                    elem.tagName === "INPUT" &&
                    isAnyOf(elem.getAttribute("type"), ["reset", "button", "submit"])) {
                    translateAttribute(elem, "value");
                }
            }

            for (let i = 0; i < elem.childNodes.length; i++) {
                const node = elem.childNodes[i];
                if (node.nodeType === node.ELEMENT_NODE) {
                    process(node, enabled);
                } else if (node.nodeType === node.TEXT_NODE && enabled) {
                    translateTextNode(node);
                }
            }
        }

        process(document.body, true);
    }
}

export const l10n = new Localizer();
export default l10n.get.bind(l10n);
