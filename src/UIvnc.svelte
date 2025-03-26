<script lang="ts">
    /*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2019 The noVNC authors
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

import { onMount } from 'svelte';

// UI LOADER
export let UI:any

// CONNECTION STATUS
export let connection_status:string

// ELEMENTS 
export let noVNC_status:any
export let noVNC_fullscreen_button:any
export let noVNC_setting_logging:any
export let noVNC_control_bar:any
export let noVNC_view_drag_button:any
export let noVNC_control_bar_handle:any
export let noVNC_keyboard_button:any
export let noVNC_keyboardinput:any
export let noVNC_toggle_extra_keys_button:any
export let noVNC_toggle_ctrl_button:any
export let noVNC_toggle_windows_button:any
export let noVNC_toggle_alt_button:any
export let noVNC_send_tab_button:any
export let noVNC_send_esc_button:any
export let noVNC_send_ctrl_alt_del_button:any
export let noVNC_shutdown_button:any
export let noVNC_reboot_button:any
export let noVNC_reset_button:any
export let noVNC_power_button:any
export let noVNC_disconnect_button:any
export let noVNC_connect_button:any
export let noVNC_cancel_reconnect_button:any
export let noVNC_approve_server_button:any
export let noVNC_reject_server_button:any
export let noVNC_credentials_button:any
export let noVNC_clipboard_button:any
export let noVNC_clipboard_text:any
export let noVNC_settings_button:any
export let noVNC_transition_text:any
export let noVNC_verify_server_dlg:any
export let noVNC_credentials_dlg:any
export let noVNC_control_bar_anchor:any
export let noVNC_control_bar_hint:any
export let noVNC_Element:any
export let noVNC_settings:any
export let noVNC_power:any
export let noVNC_clipboard:any
export let noVNC_connect_dlg:any
export let noVNC_container:any
export let noVNC_fingerprint:any
export let noVNC_username_block:any
export let noVNC_password_block:any
export let noVNC_password_input:any
export let noVNC_username_input:any
export let noVNC_modifiers:any
export let noVNC_bell:any
export let noVNC_setting_shared:any
export let noVNC_setting_view_only:any
export let noVNC_setting_view_clip:any
export let noVNC_setting_resize:any
export let noVNC_setting_quality:any
export let noVNC_setting_compression:any
export let noVNC_setting_repeaterID:any
export let noVNC_setting_encrypt:any
export let noVNC_setting_host:any
export let noVNC_setting_port:any
export let noVNC_setting_path:any
export let noVNC_setting_reconnect:any
export let noVNC_setting_reconnect_delay:any
export let noVNC_setting_show_dot:any
export let advanced_expander:any
export let websocket_expander:any

let noVNC_variables:any = {}

const PAGE_TITLE = "noVNC";

let _ : any;
let l10n: any;
let isTouchDevice: any;
let isMac: any;
let isIOS: any;
let isAndroid: any;
let isChromeOS: any;
let isSafari: any;
let hasScrollbarGutter: any;
let dragThreshold: any;
let setCapture: any;
let getPointerEvent: any;
let KeyTable: any;
let keysyms: any;
let Keyboard: any;
let RFB: any;
let WebUtil: any;

const LINGUAS = ["cs", "de", "el", "es", "fr", "it", "ja", "ko", "nl", "pl", "pt_BR", "ru", "sv", "tr", "zh_CN", "zh_TW"];

async function loadModules() {
    const localizationModule = await import('./app/localization');
    const utilModule = await import('./core/util/browser.js');
    const eventsModule = await import('./core/util/events.js');
    const keySymModule = await import("./core/input/keysym.js");
    const keySymDefModule = await import("./core/input/keysymdef.js");
    const keyboardModule = await import("./core/input/keyboard.js");
    const rfbModule = await import("./core/rfb.js");
    // @ts-ignore
    const webUtilModule = await import("./app/webutil.ts");

    // Assign imported modules to variables
    _ = localizationModule.default;
    l10n = localizationModule.l10n;

    isTouchDevice = utilModule.isTouchDevice;
    isMac = utilModule.isMac;
    isIOS = utilModule.isIOS;
    isAndroid = utilModule.isAndroid;
    isChromeOS = utilModule.isChromeOS;
    isSafari = utilModule.isSafari;
    hasScrollbarGutter = utilModule.hasScrollbarGutter;
    dragThreshold = utilModule.dragThreshold;

    setCapture = eventsModule.setCapture;
    getPointerEvent = eventsModule.getPointerEvent;

    KeyTable = keySymModule.default;
    keysyms = keySymDefModule.default;
    Keyboard = keyboardModule.default;
    RFB = rfbModule.default;
    WebUtil = webUtilModule;
    noVNC_variables = {
        noVNC_status,
        noVNC_fullscreen_button,
        noVNC_setting_logging,
        noVNC_control_bar,
        noVNC_view_drag_button,
        noVNC_control_bar_handle,
        noVNC_keyboard_button,
        noVNC_keyboardinput,
        noVNC_toggle_extra_keys_button,
        noVNC_toggle_ctrl_button,
        noVNC_toggle_windows_button,
        noVNC_toggle_alt_button,
        noVNC_send_tab_button,
        noVNC_send_esc_button,
        noVNC_send_ctrl_alt_del_button,
        noVNC_shutdown_button,
        noVNC_reboot_button,
        noVNC_reset_button,
        noVNC_power_button,
        noVNC_disconnect_button,
        noVNC_connect_button,
        noVNC_cancel_reconnect_button,
        noVNC_approve_server_button,
        noVNC_reject_server_button,
        noVNC_credentials_button,
        noVNC_clipboard_button,
        noVNC_clipboard_text,
        noVNC_settings_button,
        noVNC_transition_text,
        noVNC_verify_server_dlg,
        noVNC_credentials_dlg,
        noVNC_control_bar_anchor,
        noVNC_control_bar_hint,
        noVNC_Element,
        noVNC_settings,
        noVNC_power,
        noVNC_clipboard,
        noVNC_connect_dlg,
        noVNC_container,
        noVNC_fingerprint,
        noVNC_username_block,
        noVNC_password_block,
        noVNC_password_input,
        noVNC_username_input,
        noVNC_modifiers,
        noVNC_bell,
        noVNC_setting_shared,
        noVNC_setting_view_only,
        noVNC_setting_view_clip,
        noVNC_setting_resize,
        noVNC_setting_quality,
        noVNC_setting_compression,
        noVNC_setting_repeaterID,
        noVNC_setting_encrypt,
        noVNC_setting_host,
        noVNC_setting_port,
        noVNC_setting_path,
        noVNC_setting_reconnect,
        noVNC_setting_reconnect_delay,
        noVNC_setting_show_dot,
        advanced_expander,
        websocket_expander,
    }
}


onMount(async ()=>{
    UI = {
        customSettings: {},

        connected: false,
        desktopName: "",

        statusTimeout: null,
        hideKeyboardTimeout: null,
        idleControlbarTimeout: null,
        closeControlbarTimeout: null,

        controlbarGrabbed: false,
        controlbarDrag: false,
        controlbarMouseDownClientY: 0,
        controlbarMouseDownOffsetY: 0,

        lastKeyboardinput: null,
        defaultKeyboardinputLen: 100,

        inhibitReconnect: true,
        reconnectCallback: null,
        reconnectPassword: null,

        async start(options:any={}) {
            await loadModules()
            UI.customSettings = options.settings || {};
            if (UI.customSettings.defaults === undefined) {
                UI.customSettings.defaults = {};
            }
            if (UI.customSettings.mandatory === undefined) {
                UI.customSettings.mandatory = {};
            }

            // Set up translations
            try {
                await l10n.setup(LINGUAS);
            } catch (err) {
                console.error("Failed to load translations: " + err);
            }

            // Initialize setting storage
            if(WebUtil) await WebUtil.initSettings();

            // Wait for the page to load
            if (document.readyState !== "interactive" && document.readyState !== "complete") {
                await new Promise((resolve, reject) => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            UI.initSettings();

            // Translate the DOM
            l10n.translateDOM();

            // We rely on modern APIs which might not be available in an
            // insecure context
            if (!window.isSecureContext) {
                // FIXME: This gets hidden when connecting
                // UI.showStatus(_("Running without HTTPS is not recommended, crashes or other issues are likely."), 'error');
            }

            // Adapt the interface for touch screen devices
            if (isTouchDevice) {
                // Remove the address bar
                setTimeout(() => window.scrollTo(0, 1), 100);
            }

            // Restore control bar position
            if (WebUtil && WebUtil.readSetting('controlbar_pos') === 'right') {
                UI.toggleControlbarSide();
            }

            UI.initFullscreen();

            // Setup event handlers
            UI.addControlbarHandlers();
            UI.addTouchSpecificHandlers();
            UI.addExtraKeysHandlers();
            UI.addMachineHandlers();
            UI.addConnectionControlHandlers();
            UI.addClipboardHandlers();
            UI.addSettingsHandlers();
            noVNC_status.addEventListener('click', UI.hideStatus);

            // Bootstrap fallback input handler
            UI.keyboardinputReset();

            UI.openControlbar();

            UI.updateVisualState('init');

            // document.documentElement.classList.remove("noVNC_loading");
            connection_status = ""

            let autoconnect = UI.getSetting('autoconnect');
            if (autoconnect === 'true' || autoconnect == '1') {
                autoconnect = true;
                UI.connect();
            } else {
                autoconnect = false;
                // Show the connect panel on first load unless autoconnecting
                UI.openConnectPanel();
            }
        },

        initFullscreen() {
            // Only show the button if fullscreen is properly supported
            // * Safari doesn't support alphanumerical input while in fullscreen
            // @ts-ignore
            if (!isSafari() && (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.body.msRequestFullscreen)) {
                noVNC_fullscreen_button.classList.remove("noVNC_hidden");
                UI.addFullscreenHandlers();
            }
        },

        initSettings() {
            // Logging selection dropdown
            const llevels = ['error', 'warn', 'info', 'debug'];
            for (let i = 0; i < llevels.length; i += 1) {
                UI.addOption(noVNC_setting_logging, llevels[i], llevels[i]);
            }

            // Settings with immediate effects
            UI.initSetting('logging', 'warn');
            UI.updateLogging();

            UI.setupSettingLabels();

            /* Populate the controls if defaults are provided in the URL */
            UI.initSetting('host', '');
            UI.initSetting('port', 0);
            UI.initSetting('encrypt', (window.location.protocol === "https:"));
            UI.initSetting('password');
            UI.initSetting('autoconnect', false);
            UI.initSetting('view_clip', false);
            UI.initSetting('resize', 'off');
            UI.initSetting('quality', 6);
            UI.initSetting('compression', 2);
            UI.initSetting('shared', true);
            UI.initSetting('bell', 'on');
            UI.initSetting('view_only', false);
            UI.initSetting('show_dot', false);
            UI.initSetting('path', 'websockify');
            UI.initSetting('repeaterID', '');
            UI.initSetting('reconnect', false);
            UI.initSetting('reconnect_delay', 5000);
        },
        // Adds a link to the label elements on the corresponding input elements
        setupSettingLabels() {
            const labels:any = document.getElementsByTagName('LABEL');
            for (let i = 0; i < labels.length; i++) {
                const htmlFor = labels[i].htmlFor;
                if (htmlFor != '') {
                    const elem:any = document.getElementById(htmlFor);
                    if (elem) elem.label = labels[i];
                } else {
                    // If 'for' isn't set, use the first input element child
                    const children = labels[i].children;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].form !== undefined) {
                            children[j].label = labels[i];
                            break;
                        }
                    }
                }
            }
        },

        /* ------^-------
        *     /INIT
        * ==============
        * EVENT HANDLERS
        * ------v------*/

        addControlbarHandlers() {

            noVNC_view_drag_button.addEventListener('click', UI.toggleViewDrag);
            noVNC_control_bar
                .addEventListener('mousemove', UI.activateControlbar);
            noVNC_control_bar
                .addEventListener('mouseup', UI.activateControlbar);
            noVNC_control_bar
                .addEventListener('mousedown', UI.activateControlbar);
            noVNC_control_bar
                .addEventListener('keydown', UI.activateControlbar);

            noVNC_control_bar
                .addEventListener('mousedown', UI.keepControlbar);
            noVNC_control_bar
                .addEventListener('keydown', UI.keepControlbar);
            noVNC_control_bar_handle.addEventListener('mousedown', UI.controlbarHandleMouseDown);
            noVNC_control_bar_handle.addEventListener('mouseup', UI.controlbarHandleMouseUp);
            noVNC_control_bar_handle.addEventListener('mousemove', UI.dragControlbarHandle);

            noVNC_clipboard
                .addEventListener('mousemove', UI.activateControlbar);
            noVNC_clipboard
                .addEventListener('mouseup', UI.activateControlbar);
            noVNC_clipboard
                .addEventListener('mousedown', UI.activateControlbar);
            noVNC_clipboard
                .addEventListener('keydown', UI.activateControlbar);

            noVNC_clipboard
                .addEventListener('mousedown', UI.keepControlbar);
            noVNC_clipboard
                .addEventListener('keydown', UI.keepControlbar);

            noVNC_settings
                .addEventListener('mousemove', UI.activateControlbar);
            noVNC_settings
                .addEventListener('mouseup', UI.activateControlbar);
            noVNC_settings
                .addEventListener('mousedown', UI.activateControlbar);
            noVNC_settings
                .addEventListener('keydown', UI.activateControlbar);

            noVNC_settings
                .addEventListener('mousedown', UI.keepControlbar);
            noVNC_settings
                .addEventListener('keydown', UI.keepControlbar);

            // resize events aren't available for elements
            window.addEventListener('resize', UI.updateControlbarHandle);

            if(advanced_expander) advanced_expander.addEventListener('click', UI.toggleExpander);
            if(websocket_expander) websocket_expander.addEventListener('click', UI.toggleExpander);
        },

        addTouchSpecificHandlers() {
            noVNC_keyboard_button.addEventListener('click', UI.toggleVirtualKeyboard);

            UI.touchKeyboard = new Keyboard(noVNC_keyboardinput);
            UI.touchKeyboard.onkeyevent = UI.keyEvent;
            UI.touchKeyboard.grab();
            noVNC_keyboardinput
                .addEventListener('input', UI.keyInput);
            noVNC_keyboardinput
                .addEventListener('focus', UI.onfocusVirtualKeyboard);
            noVNC_keyboardinput
                .addEventListener('blur', UI.onblurVirtualKeyboard);
            noVNC_keyboardinput
                .addEventListener('submit', () => false);

            document.documentElement
                .addEventListener('mousedown', UI.keepVirtualKeyboard, true);

            noVNC_control_bar
                .addEventListener('touchstart', UI.activateControlbar);
            noVNC_control_bar
                .addEventListener('touchmove', UI.activateControlbar);
            noVNC_control_bar
                .addEventListener('touchend', UI.activateControlbar);
            noVNC_control_bar
                .addEventListener('input', UI.activateControlbar);

            noVNC_control_bar
                .addEventListener('touchstart', UI.keepControlbar);
            noVNC_control_bar
                .addEventListener('input', UI.keepControlbar);

            noVNC_clipboard
                .addEventListener('touchstart', UI.activateControlbar);
            noVNC_clipboard
                .addEventListener('touchmove', UI.activateControlbar);
            noVNC_clipboard
                .addEventListener('touchend', UI.activateControlbar);
            noVNC_clipboard
                .addEventListener('input', UI.activateControlbar);

            noVNC_clipboard
                .addEventListener('touchstart', UI.keepControlbar);
            noVNC_clipboard
                .addEventListener('input', UI.keepControlbar);

            noVNC_settings
                .addEventListener('touchstart', UI.activateControlbar);
            noVNC_settings
                .addEventListener('touchmove', UI.activateControlbar);
            noVNC_settings
                .addEventListener('touchend', UI.activateControlbar);
            noVNC_settings
                .addEventListener('input', UI.activateControlbar);

            noVNC_settings
                .addEventListener('touchstart', UI.keepControlbar);
            noVNC_settings
                .addEventListener('input', UI.keepControlbar);

            noVNC_control_bar_handle.addEventListener('touchstart', UI.controlbarHandleMouseDown);
            noVNC_control_bar_handle.addEventListener('touchend', UI.controlbarHandleMouseUp);
            noVNC_control_bar_handle.addEventListener('touchmove', UI.dragControlbarHandle);
        },

        addExtraKeysHandlers() {
            noVNC_toggle_extra_keys_button
                .addEventListener('click', UI.toggleExtraKeys);
            noVNC_toggle_ctrl_button
                .addEventListener('click', UI.toggleCtrl);
            noVNC_toggle_windows_button
                .addEventListener('click', UI.toggleWindows);
            noVNC_toggle_alt_button
                .addEventListener('click', UI.toggleAlt);
            noVNC_send_tab_button
                .addEventListener('click', UI.sendTab);
            noVNC_send_esc_button
                .addEventListener('click', UI.sendEsc);
            noVNC_send_ctrl_alt_del_button
                .addEventListener('click', UI.sendCtrlAltDel);
        },

        addMachineHandlers() {
            if(UI.rfb) {
                noVNC_shutdown_button
                .addEventListener('click', () => UI.rfb.machineShutdown());
                noVNC_reboot_button
                    .addEventListener('click', () => UI.rfb.machineReboot());
                noVNC_reset_button
                    .addEventListener('click', () => UI.rfb.machineReset());
                noVNC_power_button
                    .addEventListener('click', UI.togglePowerPanel);
            }
        },

        addConnectionControlHandlers() {
            noVNC_disconnect_button
                .addEventListener('click', UI.disconnect);
            noVNC_connect_button
                .addEventListener('click', UI.connect);
            noVNC_cancel_reconnect_button
                .addEventListener('click', UI.cancelReconnect);

            noVNC_approve_server_button
                .addEventListener('click', UI.approveServer);
            noVNC_reject_server_button
                .addEventListener('click', UI.rejectServer);
            noVNC_credentials_button
                .addEventListener('click', UI.setCredentials);
        },

        addClipboardHandlers() {
            noVNC_clipboard_button
                .addEventListener('click', UI.toggleClipboardPanel);
            noVNC_clipboard_text
                .addEventListener('change', UI.clipboardSend);
        },

        // Add a call to save settings when the element changes,
        // unless the optional parameter changeFunc is used instead.
        addSettingChangeHandler(name:any, changeFunc:any) {
            const settingElem = noVNC_variables['noVNC_setting_' + name];
            if (settingElem) {
                if (changeFunc === undefined) {
                    changeFunc = () => UI.saveSetting(name);
                }
                settingElem.addEventListener('change', changeFunc);
            }
        },

        addSettingsHandlers() {
            noVNC_settings_button
                .addEventListener('click', UI.toggleSettingsPanel);

            UI.addSettingChangeHandler('encrypt');
            UI.addSettingChangeHandler('resize');
            UI.addSettingChangeHandler('resize', UI.applyResizeMode);
            UI.addSettingChangeHandler('resize', UI.updateViewClip);
            UI.addSettingChangeHandler('quality');
            UI.addSettingChangeHandler('quality', UI.updateQuality);
            UI.addSettingChangeHandler('compression');
            UI.addSettingChangeHandler('compression', UI.updateCompression);
            UI.addSettingChangeHandler('view_clip');
            UI.addSettingChangeHandler('view_clip', UI.updateViewClip);
            UI.addSettingChangeHandler('shared');
            UI.addSettingChangeHandler('view_only');
            UI.addSettingChangeHandler('view_only', UI.updateViewOnly);
            UI.addSettingChangeHandler('show_dot');
            UI.addSettingChangeHandler('show_dot', UI.updateShowDotCursor);
            UI.addSettingChangeHandler('host');
            UI.addSettingChangeHandler('port');
            UI.addSettingChangeHandler('path');
            UI.addSettingChangeHandler('repeaterID');
            UI.addSettingChangeHandler('logging');
            UI.addSettingChangeHandler('logging', UI.updateLogging);
            UI.addSettingChangeHandler('reconnect');
            UI.addSettingChangeHandler('reconnect_delay');
        },

        addFullscreenHandlers() {
            noVNC_fullscreen_button.addEventListener('click', UI.toggleFullscreen);

            window.addEventListener('fullscreenchange', UI.updateFullscreenButton);
            window.addEventListener('mozfullscreenchange', UI.updateFullscreenButton);
            window.addEventListener('webkitfullscreenchange', UI.updateFullscreenButton);
            window.addEventListener('msfullscreenchange', UI.updateFullscreenButton);
        },

        /* ------^-------
        * /EVENT HANDLERS
        * ==============
        *     VISUAL
        * ------v------*/

        // Disable/enable controls depending on connection state
        updateVisualState(state:string) {

            // document.documentElement.classList.remove("noVNC_connecting");
            // document.documentElement.classList.remove("noVNC_connected");
            // document.documentElement.classList.remove("noVNC_disconnecting");
            // document.documentElement.classList.remove("noVNC_reconnecting");
            connection_status = ""

            const transitionElem = noVNC_transition_text;
            switch (state) {
                case 'init':
                    break;
                case 'connecting':
                    transitionElem.textContent = _("Connecting...");
                    // document.documentElement.classList.add("noVNC_connecting");
                    connection_status = "noVNC_connecting"
                    break;
                case 'connected':
                    // document.documentElement.classList.add("noVNC_connected");
                    connection_status = "noVNC_connected"
                    break;
                case 'disconnecting':
                    transitionElem.textContent = _("Disconnecting...");
                    // document.documentElement.classList.add("noVNC_disconnecting");
                    connection_status = "noVNC_disconnecting"
                    break;
                case 'disconnected':
                    break;
                case 'reconnecting':
                    transitionElem.textContent = _("Reconnecting...");
                    // document.documentElement.classList.add("noVNC_reconnecting");
                    connection_status = "noVNC_reconnecting"
                    break;
                default:
                    console.error("Invalid visual state: " + state);
                    UI.showStatus(_("Internal error"), 'error');
                    return;
            }

            if (UI.connected) {
                UI.updateViewClip();

                UI.disableSetting('encrypt');
                UI.disableSetting('shared');
                UI.disableSetting('host');
                UI.disableSetting('port');
                UI.disableSetting('path');
                UI.disableSetting('repeaterID');

                // Hide the controlbar after 2 seconds
                UI.closeControlbarTimeout = setTimeout(UI.closeControlbar, 2000);
            } else {
                UI.enableSetting('encrypt');
                UI.enableSetting('shared');
                UI.enableSetting('host');
                UI.enableSetting('port');
                UI.enableSetting('path');
                UI.enableSetting('repeaterID');
                UI.updatePowerButton();
                UI.keepControlbar();
            }

            // State change closes dialogs as they may not be relevant
            // anymore
            UI.closeAllPanels();
            noVNC_verify_server_dlg
                .classList.remove('noVNC_open');
            noVNC_credentials_dlg
                .classList.remove('noVNC_open');
        },

        showStatus(text:string, statusType:string, time:any) {
            const statusElem = noVNC_status;

            if (typeof statusType === 'undefined') {
                statusType = 'normal';
            }

            // Don't overwrite more severe visible statuses and never
            // errors. Only shows the first error.
            if (statusElem.classList.contains("noVNC_open")) {
                if (statusElem.classList.contains("noVNC_status_error")) {
                    return;
                }
                if (statusElem.classList.contains("noVNC_status_warn") &&
                    statusType === 'normal') {
                    return;
                }
            }

            clearTimeout(UI.statusTimeout);

            switch (statusType) {
                case 'error':
                    statusElem.classList.remove("noVNC_status_warn");
                    statusElem.classList.remove("noVNC_status_normal");
                    statusElem.classList.add("noVNC_status_error");
                    break;
                case 'warning':
                case 'warn':
                    statusElem.classList.remove("noVNC_status_error");
                    statusElem.classList.remove("noVNC_status_normal");
                    statusElem.classList.add("noVNC_status_warn");
                    break;
                case 'normal':
                case 'info':
                default:
                    statusElem.classList.remove("noVNC_status_error");
                    statusElem.classList.remove("noVNC_status_warn");
                    statusElem.classList.add("noVNC_status_normal");
                    break;
            }

            statusElem.textContent = text;
            statusElem.classList.add("noVNC_open");

            // If no time was specified, show the status for 1.5 seconds
            if (typeof time === 'undefined') {
                time = 1500;
            }

            // Error messages do not timeout
            if (statusType !== 'error') {
                UI.statusTimeout = window.setTimeout(UI.hideStatus, time);
            }
        },

        hideStatus() {
            clearTimeout(UI.statusTimeout);
            if(noVNC_status) noVNC_status.classList.remove("noVNC_open");
        },

        activateControlbar(event:any) {
            clearTimeout(UI.idleControlbarTimeout);
            // We manipulate the anchor instead of the actual control
            // bar in order to avoid creating new a stacking group
            noVNC_control_bar_anchor.style.opacity = "1"
            UI.idleControlbarTimeout = window.setTimeout(UI.idleControlbar, 2000);
        },

        idleControlbar() {
            // Don't fade if a child of the control bar has focus
            if(!noVNC_control_bar) return
            if ((noVNC_control_bar.contains(document.activeElement) || noVNC_clipboard.contains(document.activeElement) || noVNC_settings.contains(document.activeElement)) && document.hasFocus()) {
                UI.activateControlbar();
                return;
            }

            noVNC_control_bar_anchor.style.opacity = "0.8"
        },

        keepControlbar() {
            clearTimeout(UI.closeControlbarTimeout);
        },

        openControlbar() {
            if(!noVNC_control_bar) return
            noVNC_control_bar.classList.add("noVNC_open");
        },

        closeControlbar() {
            if (!UI.rfb || !noVNC_control_bar) return;
            UI.closeAllPanels();
            noVNC_control_bar.classList.remove("noVNC_open");
            UI.rfb.focus();
        },

        toggleControlbar() {
            if(!noVNC_control_bar) return
            if (noVNC_control_bar.classList.contains("noVNC_open")) {
                UI.closeControlbar();
            } else {
                UI.openControlbar();
            }
        },

        toggleControlbarSide() {
            // Temporarily disable animation, if bar is displayed, to avoid weird
            // movement. The transitionend-event will not fire when display=none.
            if(!WebUtil) return
            const bar = noVNC_control_bar
            const barDisplayStyle = window.getComputedStyle(bar).display;
            if (barDisplayStyle !== 'none') {
                bar.style.transitionDuration = '0s';
                bar.addEventListener('transitionend', () => bar.style.transitionDuration = '');
            }

            const anchor = noVNC_control_bar_anchor;
            if (anchor.classList.contains("noVNC_right")) {
                WebUtil.writeSetting('controlbar_pos', 'left');
                anchor.classList.remove("noVNC_right");
            } else {
                WebUtil.writeSetting('controlbar_pos', 'right');
                anchor.classList.add("noVNC_right");
            }

            // Consider this a movement of the handle
            UI.controlbarDrag = true;

            // The user has "followed" hint, let's hide it until the next drag
            UI.showControlbarHint(false, false);
        },

        showControlbarHint(show:boolean, animate=true) {
            const hint = noVNC_control_bar_hint;

            if (animate) {
                hint.classList.remove("noVNC_notransition");
            } else {
                hint.classList.add("noVNC_notransition");
            }

            if (show) {
                hint.classList.add("noVNC_active");
            } else {
                hint.classList.remove("noVNC_active");
            }
        },

        dragControlbarHandle(e:any) {
            if (!UI.controlbarGrabbed) return;

            const ptr = getPointerEvent(e);

            const anchor = noVNC_control_bar_anchor;
            let novVNC_element = noVNC_Element.getBoundingClientRect();
            if (ptr.clientX < (novVNC_element.left+novVNC_element.width * 0.1)) {
                if (anchor.classList.contains("noVNC_right")) {
                    UI.toggleControlbarSide();
                }
            } else if (ptr.clientX > (novVNC_element.right-novVNC_element.width * 0.1)) {
                if (!anchor.classList.contains("noVNC_right")) {
                    UI.toggleControlbarSide();
                }
            }

            if (!UI.controlbarDrag) {
                const dragDistance = Math.abs(ptr.clientY - UI.controlbarMouseDownClientY);

                if (dragDistance < dragThreshold) return;

                UI.controlbarDrag = true;
            }

            const eventY = ptr.clientY - UI.controlbarMouseDownOffsetY;

            UI.moveControlbarHandle(eventY);

            e.preventDefault();
            e.stopPropagation();
            UI.keepControlbar();
            UI.activateControlbar();
        },

        // Move the handle but don't allow any position outside the bounds
        moveControlbarHandle(viewportRelativeY:any) {
            const handleHeight = noVNC_control_bar_handle.getBoundingClientRect().height;
            const controlbarBounds = noVNC_control_bar
                .getBoundingClientRect();
            const margin = 10;

            // These heights need to be non-zero for the below logic to work
            if (handleHeight === 0 || controlbarBounds.height === 0) {
                return;
            }

            let newY = viewportRelativeY;

            // Check if the coordinates are outside the control bar
            if (newY < controlbarBounds.top + margin) {
                // Force coordinates to be below the top of the control bar
                newY = controlbarBounds.top + margin;

            } else if (newY > controlbarBounds.top +
                    controlbarBounds.height - handleHeight - margin) {
                // Force coordinates to be above the bottom of the control bar
                newY = controlbarBounds.top +
                    controlbarBounds.height - handleHeight - margin;
            }

            // Corner case: control bar too small for stable position
            if (controlbarBounds.height < (handleHeight + margin * 2)) {
                newY = controlbarBounds.top +
                    (controlbarBounds.height - handleHeight) / 2;
            }

            // The transform needs coordinates that are relative to the parent
            const parentRelativeY = newY - controlbarBounds.top;
            noVNC_control_bar_handle.style.transform = "translateY(" + parentRelativeY + "px)";
        },

        updateControlbarHandle() {
            // Since the control bar is fixed on the viewport and not the page,
            // the move function expects coordinates relative the the viewport.
            const handle = noVNC_control_bar_handle
            if(handle) {
                const handleBounds = handle.getBoundingClientRect();
                UI.moveControlbarHandle(handleBounds.top);
            }
        },

        controlbarHandleMouseUp(e:any) {
            if ((e.type == "mouseup") && (e.button != 0)) return;

            // mouseup and mousedown on the same place toggles the controlbar
            if (UI.controlbarGrabbed && !UI.controlbarDrag) {
                UI.toggleControlbar();
                e.preventDefault();
                e.stopPropagation();
                UI.keepControlbar();
                UI.activateControlbar();
            }
            UI.controlbarGrabbed = false;
            UI.showControlbarHint(false);
        },

        controlbarHandleMouseDown(e:any) {
            if ((e.type == "mousedown") && (e.button != 0)) return;

            const ptr = getPointerEvent(e);

            const handle = noVNC_control_bar_handle
            const bounds = handle.getBoundingClientRect();

            // Touch events have implicit capture
            if (e.type === "mousedown") {
                setCapture(handle);
            }

            UI.controlbarGrabbed = true;
            UI.controlbarDrag = false;

            UI.showControlbarHint(true);

            UI.controlbarMouseDownClientY = ptr.clientY;
            UI.controlbarMouseDownOffsetY = ptr.clientY - bounds.top;
            e.preventDefault();
            e.stopPropagation();
            UI.keepControlbar();
            UI.activateControlbar();
        },

        toggleExpander(e:any) {
            if (this.classList.contains("noVNC_open")) {
                this.classList.remove("noVNC_open");
            } else {
                this.classList.add("noVNC_open");
            }
        },

        /* ------^-------
        *    /VISUAL
        * ==============
        *    SETTINGS
        * ------v------*/

        // Initial page load read/initialization of settings
        initSetting(name:any, defVal:any) {
            if(!WebUtil) return
            // Has the user overridden the default value?
            if (name in UI.customSettings.defaults) {
                defVal = UI.customSettings.defaults[name];
            }
            // Check Query string followed by cookie
            let val = WebUtil.getConfigVar(name);
            if (val === null) {
                val = WebUtil.readSetting(name, defVal);
            }
            WebUtil.setSetting(name, val);
            UI.updateSetting(name);
            // Has the user forced a value?
            if (name in UI.customSettings.mandatory) {
                val = UI.customSettings.mandatory[name];
                UI.forceSetting(name, val);
            }
            return val;
        },

        // Set the new value, update and disable form control setting
        forceSetting(name:any, val:any) {
            if(!WebUtil) return
            WebUtil.setSetting(name, val);
            UI.updateSetting(name);
            UI.disableSetting(name);
        },

        // Update cookie and form control setting. If value is not set, then
        // updates from control to current cookie setting.
        updateSetting(name:any) {

            // Update the settings control
            let value = UI.getSetting(name);

            const ctrl:any = noVNC_variables['noVNC_setting_' + name];
            if (ctrl === null || ctrl === undefined) {
                return;
            }

            if (ctrl.type === 'checkbox') {
                ctrl.checked = value;
            } else if (typeof ctrl.options !== 'undefined') {
                for (let i = 0; i < ctrl.options.length; i += 1) {
                    if (ctrl.options[i].value === value) {
                        ctrl.selectedIndex = i;
                        break;
                    }
                }
            } else {
                ctrl.value = value;
            }
        },

        // Save control setting to cookie
        saveSetting(name:any) {
            if(!WebUtil) return
            const ctrl:any = noVNC_variables['noVNC_setting_' + name];
            let val;
            if (ctrl.type === 'checkbox') {
                val = ctrl.checked;
            } else if (typeof ctrl.options !== 'undefined') {
                val = ctrl.options[ctrl.selectedIndex].value;
            } else {
                val = ctrl.value;
            }
            WebUtil.writeSetting(name, val);
            //console.log("Setting saved '" + name + "=" + val + "'");
            return val;
        },

        // Read form control compatible setting from cookie
        getSetting(name:any) {
            if(!WebUtil) return
            const ctrl:any = noVNC_variables['noVNC_setting_' + name];
            let val = WebUtil.readSetting(name);
            if (typeof val !== 'undefined' && val !== null &&
                ctrl !== null && ctrl !== undefined && ctrl.type === 'checkbox') {
                if (val.toString().toLowerCase() in {'0': 1, 'no': 1, 'false': 1}) {
                    val = false;
                } else {
                    val = true;
                }
            }
            return val;
        },

        // These helpers compensate for the lack of parent-selectors and
        // previous-sibling-selectors in CSS which are needed when we want to
        // disable the labels that belong to disabled input elements.
        disableSetting(name:any) {
            const ctrl:any = noVNC_variables['noVNC_setting_' + name];
            if (ctrl !== null) {
                ctrl.disabled = true;
                if (ctrl.label !== undefined) {
                    ctrl.label.classList.add('noVNC_disabled');
                }
            }
        },

        enableSetting(name:any) {
            const ctrl:any = noVNC_variables['noVNC_setting_' + name];
            if (ctrl !== null) {
                ctrl.disabled = false;
                if (ctrl.label !== undefined) {
                    ctrl.label.classList.remove('noVNC_disabled');
                }
            }
        },

        /* ------^-------
        *   /SETTINGS
        * ==============
        *    PANELS
        * ------v------*/

        closeAllPanels() {
            UI.closeSettingsPanel();
            UI.closePowerPanel();
            UI.closeClipboardPanel();
            UI.closeExtraKeys();
        },

        /* ------^-------
        *   /PANELS
        * ==============
        * SETTINGS (panel)
        * ------v------*/

        openSettingsPanel() {
            UI.closeAllPanels();
            UI.openControlbar();

            // Refresh UI elements from saved cookies
            UI.updateSetting('encrypt');
            UI.updateSetting('view_clip');
            UI.updateSetting('resize');
            UI.updateSetting('quality');
            UI.updateSetting('compression');
            UI.updateSetting('shared');
            UI.updateSetting('view_only');
            UI.updateSetting('path');
            UI.updateSetting('repeaterID');
            UI.updateSetting('logging');
            UI.updateSetting('reconnect');
            UI.updateSetting('reconnect_delay');

            noVNC_settings
                .classList.add("noVNC_open");
            noVNC_settings_button
                .classList.add("noVNC_selected");
        },

        closeSettingsPanel() {
            if(!noVNC_settings) return
            noVNC_settings
                .classList.remove("noVNC_open");
            noVNC_settings_button
                .classList.remove("noVNC_selected");
        },

        toggleSettingsPanel() {
            if(!noVNC_settings) return
            if (noVNC_settings
                .classList.contains("noVNC_open")) {
                UI.closeSettingsPanel();
            } else {
                UI.openSettingsPanel();
            }
        },

        /* ------^-------
        *   /SETTINGS
        * ==============
        *     POWER
        * ------v------*/

        openPowerPanel() {
            if(!noVNC_power) return
            UI.closeAllPanels();
            UI.openControlbar();

            noVNC_power
                .classList.add("noVNC_open");
            noVNC_power_button
                .classList.add("noVNC_selected");
        },

        closePowerPanel() {
            if(!noVNC_power) return
            noVNC_power
                .classList.remove("noVNC_open");
            noVNC_power_button
                .classList.remove("noVNC_selected");
        },

        togglePowerPanel() {
            if(!noVNC_power) return
            if (noVNC_power
                .classList.contains("noVNC_open")) {
                UI.closePowerPanel();
            } else {
                UI.openPowerPanel();
            }
        },

        // Disable/enable power button
        updatePowerButton() {
            if (!UI.rfb || !noVNC_power_button) return;
            if (UI.connected &&
                UI.rfb.capabilities.power &&
                !UI.rfb.viewOnly) {
                noVNC_power_button
                    .classList.remove("noVNC_hidden");
            } else {
                noVNC_power_button
                    .classList.add("noVNC_hidden");
                // Close power panel if open
                UI.closePowerPanel();
            }
        },

        /* ------^-------
        *    /POWER
        * ==============
        *   CLIPBOARD
        * ------v------*/

        openClipboardPanel() {
            if(!noVNC_clipboard || !noVNC_clipboard_button) return
            UI.closeAllPanels();
            UI.openControlbar();

            noVNC_clipboard
                .classList.add("noVNC_open");
            noVNC_clipboard_button
                .classList.add("noVNC_selected");
        },

        closeClipboardPanel() {
            if(!noVNC_clipboard || !noVNC_clipboard_button) return
            noVNC_clipboard
                .classList.remove("noVNC_open");
            noVNC_clipboard_button
                .classList.remove("noVNC_selected");
        },

        toggleClipboardPanel() {
            if(!noVNC_clipboard) return
            if (noVNC_clipboard
                .classList.contains("noVNC_open")) {
                UI.closeClipboardPanel();
            } else {
                UI.openClipboardPanel();
            }
        },

        clipboardReceive(e:any) {
            if(!noVNC_clipboard_text) return
            console.log(">> UI.clipboardReceive: " + e.detail.text.substr(0, 40) + "...");
            noVNC_clipboard_text.value = e.detail.text;
            console.log("<< UI.clipboardReceive");
        },

        clipboardSend() {
            if (!UI.rfb) return;
            const text = noVNC_clipboard_text.value;
            console.log(">> UI.clipboardSend: " + text.substr(0, 40) + "...");
            UI.rfb.clipboardPasteFrom(text);
            console.log("<< UI.clipboardSend");
        },

        /* ------^-------
        *  /CLIPBOARD
        * ==============
        *  CONNECTION
        * ------v------*/

        openConnectPanel() {
            if(!noVNC_connect_dlg) return
            noVNC_connect_dlg
                .classList.add("noVNC_open");
        },

        closeConnectPanel() {
            if(!noVNC_connect_dlg) return
            noVNC_connect_dlg
                .classList.remove("noVNC_open");
        },

        connect(event:any, password:any) {
            // Ignore when rfb already exists
            if (typeof UI.rfb !== 'undefined') {
                return;
            }

            const host = UI.getSetting('host');
            const port = UI.getSetting('port');
            const path = UI.getSetting('path');

            if (typeof password === 'undefined') {
                password = UI.getSetting('password');
                UI.reconnectPassword = password;
            }

            if (password === null) {
                password = undefined;
            }

            UI.hideStatus();

            UI.closeConnectPanel();

            UI.updateVisualState('connecting');

            let url;

            if (host) {
                url = new URL("https://" + host);

                url.protocol = UI.getSetting('encrypt') ? 'wss:' : 'ws:';
                if (port) {
                    url.port = port;
                }

                // "./" is needed to force URL() to interpret the path-variable as
                // a path and not as an URL. This is relevant if for example path
                // starts with more than one "/", in which case it would be
                // interpreted as a host name instead.
                url = new URL("./" + path, url);
            } else {
                // Current (May 2024) browsers support relative WebSocket
                // URLs natively, but we need to support older browsers for
                // some time.
                url = new URL(path, location.href);
                url.protocol = (window.location.protocol === "https:") ? 'wss:' : 'ws:';
            }

            try {
                UI.rfb = new RFB(noVNC_container,
                                url.href,
                                { shared: UI.getSetting('shared'),
                                repeaterID: UI.getSetting('repeaterID'),
                                credentials: { password: password } });
            } catch (exc) {
                console.log("Failed to connect to server: " + exc);
                UI.updateVisualState('disconnected');
                UI.showStatus(_("Failed to connect to server: ") + exc, 'error');
                return;
            }

            if(UI.rfb) {
                UI.rfb.addEventListener("connect", UI.connectFinished);
                UI.rfb.addEventListener("disconnect", UI.disconnectFinished);
                UI.rfb.addEventListener("serververification", UI.serverVerify);
                UI.rfb.addEventListener("credentialsrequired", UI.credentials);
                UI.rfb.addEventListener("securityfailure", UI.securityFailed);
                UI.rfb.addEventListener("clippingviewport", UI.updateViewDrag);
                UI.rfb.addEventListener("capabilities", UI.updatePowerButton);
                UI.rfb.addEventListener("clipboard", UI.clipboardReceive);
                UI.rfb.addEventListener("bell", UI.bell);
                UI.rfb.addEventListener("desktopname", UI.updateDesktopName);
                UI.rfb.clipViewport = UI.getSetting('view_clip');
                UI.rfb.scaleViewport = UI.getSetting('resize') === 'scale';
                UI.rfb.resizeSession = UI.getSetting('resize') === 'remote';
                UI.rfb.qualityLevel = parseInt(UI.getSetting('quality'));
                UI.rfb.compressionLevel = parseInt(UI.getSetting('compression'));
                UI.rfb.showDotCursor = UI.getSetting('show_dot');
            }

            UI.updateViewOnly(); // requires UI.rfb
        },

        disconnect() {
            if (!UI.rfb) return;
            UI.rfb.disconnect();

            UI.connected = false;

            // Disable automatic reconnecting
            UI.inhibitReconnect = true;

            UI.updateVisualState('disconnecting');

            // Don't display the connection settings until we're actually disconnected
        },

        reconnect() {
            UI.reconnectCallback = null;

            // if reconnect has been disabled in the meantime, do nothing.
            if (UI.inhibitReconnect) {
                return;
            }

            UI.connect(null, UI.reconnectPassword);
        },

        cancelReconnect() {
            if (UI.reconnectCallback !== null) {
                clearTimeout(UI.reconnectCallback);
                UI.reconnectCallback = null;
            }

            UI.updateVisualState('disconnected');

            UI.openControlbar();
            UI.openConnectPanel();
        },

        connectFinished(e:any) {
            if (!UI.rfb) return;
            UI.connected = true;
            UI.inhibitReconnect = false;

            let msg;
            if (UI.getSetting('encrypt')) {
                msg = _("Connected (encrypted) to ") + UI.desktopName;
            } else {
                msg = _("Connected (unencrypted) to ") + UI.desktopName;
            }
            UI.showStatus(msg);
            UI.updateVisualState('connected');

            // Do this last because it can only be used on rendered elements
            UI.rfb.focus();
        },

        disconnectFinished(e:any) {
            const wasConnected = UI.connected;

            // This variable is ideally set when disconnection starts, but
            // when the disconnection isn't clean or if it is initiated by
            // the server, we need to do it here as well since
            // UI.disconnect() won't be used in those cases.
            UI.connected = false;

            UI.rfb = undefined;

            if (!e.detail.clean) {
                UI.updateVisualState('disconnected');
                if (wasConnected) {
                    UI.showStatus(_("Something went wrong, connection is closed"),
                                'error');
                } else {
                    UI.showStatus(_("Failed to connect to server"), 'error');
                }
            }
            // If reconnecting is allowed process it now
            if (UI.getSetting('reconnect', false) === true && !UI.inhibitReconnect) {
                UI.updateVisualState('reconnecting');

                const delay = parseInt(UI.getSetting('reconnect_delay'));
                UI.reconnectCallback = setTimeout(UI.reconnect, delay);
                return;
            } else {
                UI.updateVisualState('disconnected');
                UI.showStatus(_("Disconnected"), 'normal');
            }

            document.title = PAGE_TITLE;

            UI.openControlbar();
            UI.openConnectPanel();
        },

        securityFailed(e:any) {
            let msg = "";
            // On security failures we might get a string with a reason
            // directly from the server. Note that we can't control if
            // this string is translated or not.
            if ('reason' in e.detail) {
                msg = _("New connection has been rejected with reason: ") +
                    e.detail.reason;
            } else {
                msg = _("New connection has been rejected");
            }
            UI.showStatus(msg, 'error');
        },

        /* ------^-------
        *  /CONNECTION
        * ==============
        * SERVER VERIFY
        * ------v------*/

        async serverVerify(e:any) {
            const type = e.detail.type;
            if (type === 'RSA') {
                const publickey = e.detail.publickey;
                let fingerprint:any = await window.crypto.subtle.digest("SHA-1", publickey);
                // The same fingerprint format as RealVNC
                fingerprint = Array.from(new Uint8Array(fingerprint).slice(0, 8)).map(
                    x => x.toString(16).padStart(2, '0')).join('-');
                noVNC_verify_server_dlg.classList.add('noVNC_open');
                noVNC_fingerprint.innerHTML = fingerprint;
            }
        },

        approveServer(e:any) {
            if (!UI.rfb) return;
            e.preventDefault();
            noVNC_verify_server_dlg.classList.remove('noVNC_open');
            UI.rfb.approveServer();
        },

        rejectServer(e:any) {
            e.preventDefault();
            noVNC_verify_server_dlg.classList.remove('noVNC_open');
            UI.disconnect();
        },

        /* ------^-------
        * /SERVER VERIFY
        * ==============
        *   PASSWORD
        * ------v------*/

        credentials(e:any) {
            // FIXME: handle more types

            noVNC_username_block.classList.remove("noVNC_hidden");
            noVNC_password_block.classList.remove("noVNC_hidden");

            let inputFocus:any = "none";
            if (e.detail.types.indexOf("username") === -1) {
                noVNC_username_block.classList.add("noVNC_hidden");
            } else {
                inputFocus = inputFocus === "none" ? noVNC_password_input : inputFocus;
            }
            if (e.detail.types.indexOf("password") === -1) {
                noVNC_password_block.classList.add("noVNC_hidden");
            } else {
                inputFocus = inputFocus === "none" ? noVNC_password_input : inputFocus;
            }
            noVNC_credentials_dlg
                .classList.add('noVNC_open');

            setTimeout(() => {
                if(inputFocus != "none") inputFocus.focus(), 100
            });

            console.log("Server asked for credentials");
            UI.showStatus(_("Credentials are required"), "warning");
        },

        setCredentials(e:any) {
            if (!UI.rfb) return;
            // Prevent actually submitting the form
            e.preventDefault();

            let inputElemUsername = noVNC_username_input;
            const username = inputElemUsername.value;

            let inputElemPassword = noVNC_password_input;
            const password = inputElemPassword.value;
            // Clear the input after reading the password
            inputElemPassword.value = "";
            UI.rfb.sendCredentials({ username: username, password: password });
            UI.reconnectPassword = password;
            noVNC_credentials_dlg
                .classList.remove('noVNC_open');
        },

        /* ------^-------
        *  /PASSWORD
        * ==============
        *   FULLSCREEN
        * ------v------*/

        toggleFullscreen() {
            // if (document.fullscreenElement || // alternative standard method
            //     document.mozFullScreenElement || // currently working methods
            //     document.webkitFullscreenElement ||
            //     document.msFullscreenElement) {
            //     if (document.exitFullscreen) {
            //         document.exitFullscreen();
            //     } else if (document.mozCancelFullScreen) {
            //         document.mozCancelFullScreen();
            //     } else if (document.webkitExitFullscreen) {
            //         document.webkitExitFullscreen();
            //     } else if (document.msExitFullscreen) {
            //         document.msExitFullscreen();
            //     }
            // } else {
            //     if (document.documentElement.requestFullscreen) {
            //         document.documentElement.requestFullscreen();
            //     } else if (document.documentElement.mozRequestFullScreen) {
            //         document.documentElement.mozRequestFullScreen();
            //     } else if (document.documentElement.webkitRequestFullscreen) {
            //         document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            //     } else if (document.body.msRequestFullscreen) {
            //         document.body.msRequestFullscreen();
            //     }
            // }
            UI.updateFullscreenButton();
        },

        updateFullscreenButton() {
            if(!noVNC_fullscreen_button) return
            // @ts-ignore
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ) {
                    noVNC_fullscreen_button.classList.add("noVNC_selected");
            } else {
                noVNC_fullscreen_button.classList.remove("noVNC_selected");
            }
        },

        /* ------^-------
        *  /FULLSCREEN
        * ==============
        *     RESIZE
        * ------v------*/

        // Apply remote resizing or local scaling
        applyResizeMode() {
            if (!UI.rfb) return;

            UI.rfb.scaleViewport = UI.getSetting('resize') === 'scale';
            UI.rfb.resizeSession = UI.getSetting('resize') === 'remote';
        },

        /* ------^-------
        *    /RESIZE
        * ==============
        * VIEW CLIPPING
        * ------v------*/

        // Update viewport clipping property for the connection. The normal
        // case is to get the value from the setting. There are special cases
        // for when the viewport is scaled or when a touch device is used.
        updateViewClip() {
            if (!UI.rfb) return;

            const scaling = UI.getSetting('resize') === 'scale';

            // Some platforms have overlay scrollbars that are difficult
            // to use in our case, which means we have to force panning
            // FIXME: Working scrollbars can still be annoying to use with
            //        touch, so we should ideally be able to have both
            //        panning and scrollbars at the same time

            let brokenScrollbars = false;

            if (!hasScrollbarGutter) {
                if (isIOS() || isAndroid() || isMac() || isChromeOS()) {
                    brokenScrollbars = true;
                }
            }

            if (scaling) {
                // Can't be clipping if viewport is scaled to fit
                UI.forceSetting('view_clip', false);
                UI.rfb.clipViewport  = false;
            } else if (brokenScrollbars) {
                UI.forceSetting('view_clip', true);
                UI.rfb.clipViewport = true;
            } else {
                UI.enableSetting('view_clip');
                UI.rfb.clipViewport = UI.getSetting('view_clip');
            }

            // Changing the viewport may change the state of
            // the dragging button
            UI.updateViewDrag();
        },

        /* ------^-------
        * /VIEW CLIPPING
        * ==============
        *    VIEWDRAG
        * ------v------*/

        toggleViewDrag() {
            if (!UI.rfb) return;

            UI.rfb.dragViewport = !UI.rfb.dragViewport;
            UI.updateViewDrag();
        },

        updateViewDrag() {
            if (!UI.rfb) return;
            if (!UI.connected) return;

            const viewDragButton = noVNC_view_drag_button

            if ((!UI.rfb.clipViewport || !UI.rfb.clippingViewport) &&
                UI.rfb.dragViewport) {
                // We are no longer clipping the viewport. Make sure
                // viewport drag isn't active when it can't be used.
                UI.rfb.dragViewport = false;
            }

            if (UI.rfb.dragViewport) {
                viewDragButton.classList.add("noVNC_selected");
            } else {
                viewDragButton.classList.remove("noVNC_selected");
            }

            if (UI.rfb.clipViewport) {
                viewDragButton.classList.remove("noVNC_hidden");
            } else {
                viewDragButton.classList.add("noVNC_hidden");
            }

            viewDragButton.disabled = !UI.rfb.clippingViewport;
        },

        /* ------^-------
        *   /VIEWDRAG
        * ==============
        *    QUALITY
        * ------v------*/

        updateQuality() {
            if (!UI.rfb) return;

            UI.rfb.qualityLevel = parseInt(UI.getSetting('quality'));
        },

        /* ------^-------
        *   /QUALITY
        * ==============
        *  COMPRESSION
        * ------v------*/

        updateCompression() {
            if (!UI.rfb) return;

            UI.rfb.compressionLevel = parseInt(UI.getSetting('compression'));
        },

        /* ------^-------
        *  /COMPRESSION
        * ==============
        *    KEYBOARD
        * ------v------*/

        showVirtualKeyboard() {
            if (!isTouchDevice) return;

            const input = noVNC_keyboardinput;

            if (document.activeElement == input) return;

            input.focus();

            try {
                const l = input.value.length;
                // Move the caret to the end
                input.setSelectionRange(l, l);
            } catch (err) {
                // setSelectionRange is undefined in Google Chrome
            }
        },

        hideVirtualKeyboard() {
            if (!isTouchDevice) return;

            const input = noVNC_keyboardinput;

            if (document.activeElement != input) return;

            input.blur();
        },

        toggleVirtualKeyboard() {
            if (noVNC_keyboard_button.classList.contains("noVNC_selected")) {
                UI.hideVirtualKeyboard();
            } else {
                UI.showVirtualKeyboard();
            }
        },

        onfocusVirtualKeyboard(event:any) {
            if (!UI.rfb) return;
            noVNC_keyboard_button.classList.add("noVNC_selected");
            UI.rfb.focusOnClick = false;
        },

        onblurVirtualKeyboard(event:any) {
            if (!UI.rfb) return;
            noVNC_keyboard_button.classList.remove("noVNC_selected");
            UI.rfb.focusOnClick = true;
        },

        keepVirtualKeyboard(event:any) {
            const input = noVNC_keyboardinput;

            // Only prevent focus change if the virtual keyboard is active
            if (document.activeElement != input) {
                return;
            }

            // Only allow focus to move to other elements that need
            // focus to function properly
            if (event.target.form !== undefined) {
                switch (event.target.type) {
                    case 'text':
                    case 'email':
                    case 'search':
                    case 'password':
                    case 'tel':
                    case 'url':
                    case 'textarea':
                    case 'select-one':
                    case 'select-multiple':
                        return;
                }
            }

            event.preventDefault();
        },

        keyboardinputReset() {
            const kbi = noVNC_keyboardinput;
            kbi.value = new Array(UI.defaultKeyboardinputLen).join("_");
            UI.lastKeyboardinput = kbi.value;
        },

        keyEvent(keysym:any, code:any, down:any) {
            if (!UI.rfb) return;

            UI.rfb.sendKey(keysym, code, down);
        },

        // When normal keyboard events are left uncought, use the input events from
        // the keyboardinput element instead and generate the corresponding key events.
        // This code is required since some browsers on Android are inconsistent in
        // sending keyCodes in the normal keyboard events when using on screen keyboards.
        keyInput(event:any) {

            if (!UI.rfb) return;

            const newValue = event.target.value;

            if (!UI.lastKeyboardinput) {
                UI.keyboardinputReset();
            }
            const oldValue = UI.lastKeyboardinput;

            let newLen;
            try {
                // Try to check caret position since whitespace at the end
                // will not be considered by value.length in some browsers
                newLen = Math.max(event.target.selectionStart, newValue.length);
            } catch (err) {
                // selectionStart is undefined in Google Chrome
                newLen = newValue.length;
            }
            const oldLen = oldValue.length;

            let inputs = newLen - oldLen;
            let backspaces = inputs < 0 ? -inputs : 0;

            // Compare the old string with the new to account for
            // text-corrections or other input that modify existing text
            for (let i = 0; i < Math.min(oldLen, newLen); i++) {
                if (newValue.charAt(i) != oldValue.charAt(i)) {
                    inputs = newLen - i;
                    backspaces = oldLen - i;
                    break;
                }
            }

            // Send the key events
            for (let i = 0; i < backspaces; i++) {
                UI.rfb.sendKey(KeyTable.XK_BackSpace, "Backspace");
            }
            for (let i = newLen - inputs; i < newLen; i++) {
                UI.rfb.sendKey(keysyms.lookup(newValue.charCodeAt(i)));
            }

            // Control the text content length in the keyboardinput element
            if (newLen > 2 * UI.defaultKeyboardinputLen) {
                UI.keyboardinputReset();
            } else if (newLen < 1) {
                // There always have to be some text in the keyboardinput
                // element with which backspace can interact.
                UI.keyboardinputReset();
                // This sometimes causes the keyboard to disappear for a second
                // but it is required for the android keyboard to recognize that
                // text has been added to the field
                event.target.blur();
                // This has to be ran outside of the input handler in order to work
                setTimeout(event.target.focus.bind(event.target), 0);
            } else {
                UI.lastKeyboardinput = newValue;
            }
        },

        /* ------^-------
        *   /KEYBOARD
        * ==============
        *   EXTRA KEYS
        * ------v------*/

        openExtraKeys() {
            UI.closeAllPanels();
            UI.openControlbar();

            noVNC_modifiers
                .classList.add("noVNC_open");
            noVNC_toggle_extra_keys_button
                .classList.add("noVNC_selected");
        },

        closeExtraKeys() {
            noVNC_modifiers
                .classList.remove("noVNC_open");
            noVNC_toggle_extra_keys_button
                .classList.remove("noVNC_selected");
        },

        toggleExtraKeys() {
            if (noVNC_modifiers
                .classList.contains("noVNC_open")) {
                UI.closeExtraKeys();
            } else  {
                UI.openExtraKeys();
            }
        },

        sendEsc() {
            UI.sendKey(KeyTable.XK_Escape, "Escape");
        },

        sendTab() {
            UI.sendKey(KeyTable.XK_Tab, "Tab");
        },

        toggleCtrl() {
            const btn = noVNC_toggle_ctrl_button
            if (btn.classList.contains("noVNC_selected")) {
                UI.sendKey(KeyTable.XK_Control_L, "ControlLeft", false);
                btn.classList.remove("noVNC_selected");
            } else {
                UI.sendKey(KeyTable.XK_Control_L, "ControlLeft", true);
                btn.classList.add("noVNC_selected");
            }
        },

        toggleWindows() {
            const btn = noVNC_toggle_windows_button;
            if (btn.classList.contains("noVNC_selected")) {
                UI.sendKey(KeyTable.XK_Super_L, "MetaLeft", false);
                btn.classList.remove("noVNC_selected");
            } else {
                UI.sendKey(KeyTable.XK_Super_L, "MetaLeft", true);
                btn.classList.add("noVNC_selected");
            }
        },

        toggleAlt() {
            const btn = noVNC_toggle_alt_button;
            if (btn.classList.contains("noVNC_selected")) {
                UI.sendKey(KeyTable.XK_Alt_L, "AltLeft", false);
                btn.classList.remove("noVNC_selected");
            } else {
                UI.sendKey(KeyTable.XK_Alt_L, "AltLeft", true);
                btn.classList.add("noVNC_selected");
            }
        },

        sendCtrlAltDel() {
            if (!UI.rfb) return;
            UI.rfb.sendCtrlAltDel();
            // See below
            UI.rfb.focus();
            UI.idleControlbar();
        },

        sendKey(keysym:any, code:any, down:any) {
            if (!UI.rfb) return;
            UI.rfb.sendKey(keysym, code, down);

            // Move focus to the screen in order to be able to use the
            // keyboard right after these extra keys.
            // The exception is when a virtual keyboard is used, because
            // if we focus the screen the virtual keyboard would be closed.
            // In this case we focus our special virtual keyboard input
            // element instead.
            if (noVNC_keyboard_button.classList.contains("noVNC_selected")) {
                noVNC_keyboardinput.focus();
            } else {
                UI.rfb.focus();
            }
            // fade out the controlbar to highlight that
            // the focus has been moved to the screen
            UI.idleControlbar();
        },

        /* ------^-------
        *   /EXTRA KEYS
        * ==============
        *     MISC
        * ------v------*/

        updateViewOnly() {
            if (!UI.rfb) return;
            UI.rfb.viewOnly = UI.getSetting('view_only');

            // Hide input related buttons in view only mode
            if (UI.rfb.viewOnly) {
                noVNC_keyboard_button.classList.add('noVNC_hidden');
                noVNC_toggle_extra_keys_button
                    .classList.add('noVNC_hidden');
                noVNC_clipboard_button
                    .classList.add('noVNC_hidden');
            } else {
                noVNC_keyboard_button.classList.remove('noVNC_hidden');
                noVNC_toggle_extra_keys_button
                    .classList.remove('noVNC_hidden');
                noVNC_clipboard_button
                    .classList.remove('noVNC_hidden');
            }
        },

        updateShowDotCursor() {
            if (!UI.rfb) return;
            UI.rfb.showDotCursor = UI.getSetting('show_dot');
        },

        updateLogging() {
            if(!WebUtil) return
            WebUtil.initLogging(UI.getSetting('logging'));
        },

        updateDesktopName(e:any) {
            UI.desktopName = e.detail.name;
            // Display the desktop name in the document title
            document.title = e.detail.name + " - " + PAGE_TITLE;
        },

        bell(e:any) {
            if (UI.getSetting('bell') === 'on') {
                const promise = noVNC_bell.play();
                // The standards disagree on the return value here
                if (promise) {
                    promise.catch((e:any) => {
                        if (e.name === "NotAllowedError") {
                            // Ignore when the browser doesn't let us play audio.
                            // It is common that the browsers require audio to be
                            // initiated from a user action.
                        } else {
                            console.log("Unable to play bell: " + e);
                        }
                    });
                }
            }
        },

        //Helper to add options to dropdown.
        addOption(selectbox:any, text:any, value:any) {
            const optn:any = document.createElement("OPTION");
            optn.text = text;
            optn.value = value;
            selectbox.options.add(optn);
        },

        /* ------^-------
        *    /MISC
        * ==============
        */
    };
})

</script>