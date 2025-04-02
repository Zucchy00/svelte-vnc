<script lang="ts">
	import { onMount } from "svelte";
	import Uivnc from "./UIvnc.svelte"

    // IMAGES 
    import AltSvg from "./app/images/alt"
    import ClipBoardSvg from "./app/images/clipboard"
    import ConnectSvg from "./app/images/connect"
    import CtrlSvg from "./app/images/ctrl"
    import CtrlAltDelSvg from "./app/images/ctrlaltdel"
    import DisconnectSvg from "./app/images/disconnect"
    import DragSvg from "./app/images/drag"
    import EscSvg from "./app/images/esc"
    import FullScreenSvg from "./app/images/fullscreen"
    import KeyboardSvg from "./app/images/keyboard"
    import PowerSvg from "./app/images/power"
    import SettingsSvg from "./app/images/settings"
    import TabSvg from "./app/images/tab"
    import ToggleExtraKeys from "./app/images/toggleextrakeys"
    import WindowsSvg from "./app/images/windows"
    import BellMp3 from "./app/sounds/bell"
    import BellOga from "./app/sounds/belloga"

    // CLASS OF LOCAL VNC
    let className="";

    //BRIGHTNESS
    export let brightness:number = 100

    // UI HANDLER
    let UI:any
    export let isFullscreen:boolean = false
    export { className as class };
    export let style:string = ""
    export let logging:boolean | null = null;
    export let host:string | null = null;
    export let port:string | null= null;
    export let encrypt:boolean | null = null;
    export let password:string | null = null;
    export let autoconnect:boolean | null = null;
    export let view_clip:boolean | null = null;
    export let quality:number | null = null;
    export let compression:number | null = null;
    export let shared:boolean | null = null;
    export let bell:boolean | null = null;
    export let view_only:boolean | null = null;
    export let show_dot:boolean | null = null;
    export let path:string | null = null;
    export let repeaterID:string | null = null;
    export let reconnect:boolean | null = null;
    export let reconnect_delay:number | null = null;
    export let controlbar_pos:string | null = null;
    export let clearLocalStorage:boolean | null = null
    export let resize:string | null = null;
    export let embedded_server:boolean | null = null;
    export let username:string | null = null

    // CONNECTION STATUS
    let connection_status:string = ""

    $:console.log("Status: "+connection_status)

    // ELEMENTS / SETTINGS
    let noVNC_status:any
    let noVNC_fallback_error:any
    let noVNC_fallback_errormsg:any
    let noVNC_fullscreen_button:any
    let noVNC_setting_logging:any
    let noVNC_control_bar:any
    let noVNC_view_drag_button:any
    let noVNC_control_bar_handle:any
    let noVNC_keyboard_button:any
    let noVNC_keyboardinput:any
    let noVNC_toggle_extra_keys_button:any
    let noVNC_toggle_ctrl_button:any
    let noVNC_toggle_windows_button:any
    let noVNC_toggle_embedded:any
    let noVNC_toggle_alt_button:any
    let noVNC_send_tab_button:any
    let noVNC_send_esc_button:any
    let noVNC_send_ctrl_alt_del_button:any
    let noVNC_shutdown_button:any
    let noVNC_reboot_button:any
    let noVNC_reset_button:any
    let noVNC_power_button:any
    let noVNC_disconnect_button:any
    let noVNC_connect_button:any
    let noVNC_cancel_reconnect_button:any
    let noVNC_approve_server_button:any
    let noVNC_reject_server_button:any
    let noVNC_credentials_button:any
    let noVNC_clipboard_button:any
    let noVNC_clipboard_text:any
    let noVNC_settings_button:any
    let noVNC_transition_text:any
    let noVNC_verify_server_dlg:any
    let noVNC_credentials_dlg:any
    let noVNC_control_bar_anchor:any
    let noVNC_control_bar_hint_right:any
    let noVNC_control_bar_hint_left:any
    let noVNC_Element:any
    let noVNC_settings:any
    let noVNC_power:any
    let noVNC_clipboard:any
    let noVNC_connect_dlg:any
    let noVNC_container:any
    let noVNC_fingerprint:any
    let noVNC_username_block:any
    let noVNC_password_block:any
    let noVNC_password_input:any
    let noVNC_username_input:any
    let noVNC_modifiers:any
    let noVNC_bell:any
    let noVNC_setting_shared:any
    let noVNC_setting_view_only:any
    let noVNC_setting_view_clip:any
    let noVNC_setting_resize:any
    let noVNC_setting_quality:any
    let noVNC_setting_compression:any
    let noVNC_setting_repeaterID:any
    let noVNC_setting_encrypt:any
    let noVNC_setting_host:any
    let noVNC_setting_port:any
    let noVNC_setting_path:any
    let noVNC_setting_reconnect:any
    let noVNC_setting_reconnect_delay:any
    let noVNC_setting_show_dot:any
    let noVNC_setting_embedded_server:any
    let advanced_expander:any
    let websocket_expander:any

    // SETTINGS LIST
    let settings = {
        logging, host, port, encrypt, password, autoconnect, view_clip,
        quality, compression, shared, bell, view_only, show_dot, path,
        repeaterID, reconnect, reconnect_delay, controlbar_pos, resize, username
    };

    let defaults:any = {};
    let mandatory:any = {};
    let isInitialized:boolean = false

    $:if(UI && typeof window !== "undefined" && !isInitialized) {
        isInitialized = true
        initUI()
    }

    async function initUI() {
        if(clearLocalStorage) {
            Object.entries(settings).forEach(([key, value]) => {
                localStorage.removeItem(key)
            });
        }
        let settingsList: Record<string, any> = {};

        Object.entries(settings).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                settingsList[key] = value;
            }
        });
        
        if (Object.keys(settingsList).length === 0) {
            settingsList = { ...defaults };
        }
        if(embedded_server) noVNC_toggle_embedded = true
        await UI.start({ settings: { defaults: settingsList,
                mandatory: mandatory } });
        if(isFullscreen) fullscreen(true)
    }

    function fullscreen(wantFullscreen: boolean) {
        if (typeof window !== "undefined") {
            let fixedDocument: any = document;
            
            // Check if currently in fullscreen mode
            if (
                fixedDocument.fullscreenElement || 
                fixedDocument.mozFullScreenElement || 
                fixedDocument.webkitFullscreenElement || 
                fixedDocument.msFullscreenElement
            ) {
                if (!wantFullscreen) {
                    // Exit fullscreen
                    if (fixedDocument.exitFullscreen) {
                        fixedDocument.exitFullscreen();
                    } else if (fixedDocument.mozCancelFullScreen) {
                        fixedDocument.mozCancelFullScreen();
                    } else if (fixedDocument.webkitExitFullscreen) {
                        fixedDocument.webkitExitFullscreen();
                    } else if (fixedDocument.msExitFullscreen) {
                        fixedDocument.msExitFullscreen();
                    }
                }
            } else if (wantFullscreen) {
                // Enter fullscreen
                if (fixedDocument.documentElement.requestFullscreen) {
                    fixedDocument.documentElement.requestFullscreen();
                } else if (fixedDocument.documentElement.mozRequestFullScreen) {
                    fixedDocument.documentElement.mozRequestFullScreen();
                } else if (fixedDocument.documentElement.webkitRequestFullscreen) {
                    fixedDocument.documentElement.webkitRequestFullscreen();
                } else if (fixedDocument.body.msRequestFullscreen) {
                    fixedDocument.body.msRequestFullscreen();
                }
            }
        }
    }

    function isTouchDevice() {
        if(typeof window !== "undefined") return window.matchMedia("(not all and (any-pointer: coarse))").matches;
        else return false
    } 

    onMount(async()=>{
        // Default settings will be loaded from defaults.json. Mandatory
        // settings will be loaded from mandatory.json, which the user
        // cannot change

        try {
            defaults = await import("./defaults")
            defaults = defaults.default
        } catch (err) {
            console.error("Couldn't fetch defaults.json: " + err);
        }

        try {
            mandatory = await import("./mandatory")
            mandatory = mandatory.default
        } catch (err) {
            console.error("Couldn't fetch mandatory.json: " + err);
        }

        // You can also override any defaults you need here:
        //
        // defaults['host'] = 'vnc.example.com';

        // Or force a specific setting, preventing the user from
        // changing it:
        //
        // mandatory['view_only'] = true;

        // See docs/EMBEDDING.md for a list of possible settings.

        function handleError(event:any, err:any) {
            try {
                // Work around Firefox bug:
                // https://bugzilla.mozilla.org/show_bug.cgi?id=1685038
                if (event.message === "ResizeObserver loop completed with undelivered notifications.") {
                    return false;
                }

                // Only show the initial error
                if (noVNC_fallback_errormsg.hasChildNodes()) {
                    return false;
                }

                let div = document.createElement("div");
                div.classList.add('noVNC_message');
                div.appendChild(document.createTextNode(event.message));
                noVNC_fallback_errormsg.appendChild(div);

                if (event.filename) {
                    div = document.createElement("div");
                    div.className = 'noVNC_location';
                    let text = event.filename;
                    if (event.lineno !== undefined) {
                        text += ":" + event.lineno;
                        if (event.colno !== undefined) {
                            text += ":" + event.colno;
                        }
                    }
                    div.appendChild(document.createTextNode(text));
                    noVNC_fallback_errormsg.appendChild(div);
                }

                if (err && err.stack) {
                    div = document.createElement("div");
                    div.className = 'noVNC_stack';
                    div.appendChild(document.createTextNode(err.stack));
                    noVNC_fallback_errormsg.appendChild(div);
                }

                noVNC_fallback_error.classList.add("noVNC_open");

            } catch (exc) {
                document.write("noVNC encountered an error.");
            }

            // Try to disable keyboard interaction, best effort
            try {
                // Remove focus from the currently focused element in order to
                // prevent keyboard interaction from continuing
                let activeElement:any = document.activeElement
                if (document.activeElement) { activeElement.blur(); }

                // Don't let any element be focusable when showing the error
                let keyboardFocusable = 'a[href], button, input, textarea, select, details, [tabindex]';
                document.querySelectorAll(keyboardFocusable).forEach((elem) => {
                    elem.setAttribute("tabindex", "-1");
                });
            } catch (exc) {
                // Do nothing
            }

            // Don't return true since this would prevent the error
            // from being printed to the browser console.
            return false;
        }

        window.addEventListener('error', evt => handleError(evt, evt.error));
        window.addEventListener('unhandledrejection', evt => handleError(evt.reason, evt.reason));
    })
</script>

<!-- svelte-ignore css_unused_selector -->
<style>
    /*
 * noVNC general CSS constant variables
 * Copyright (C) 2025 The noVNC authors
 * noVNC is licensed under the MPL 2.0 (see LICENSE.txt)
 * This file is licensed under the 2-Clause BSD license (see LICENSE.txt).
 */

/* ---------- COLORS ----------- */

:root {
    --novnc-grey: rgb(128, 128, 128);
    --novnc-lightgrey: rgb(192, 192, 192);
    --novnc-darkgrey: rgb(92, 92, 92);

    /* Transparent to make button colors adapt to the background */
    --novnc-buttongrey: rgba(192, 192, 192, 0.5);

    --novnc-blue: rgb(110, 132, 163);
    --novnc-lightblue: rgb(74, 144, 217);
    --novnc-darkblue: rgb(83, 99, 122);

    --novnc-green: rgb(0, 128, 0);
    --novnc-yellow: rgb(255, 255, 0);
}

/* ------ MISC PROPERTIES ------ */

:root {
    --input-xpadding: 1em;
}
    /*
 * noVNC general input element CSS
 * Copyright (C) 2025 The noVNC authors
 * noVNC is licensed under the MPL 2.0 (see LICENSE.txt)
 * This file is licensed under the 2-Clause BSD license (see LICENSE.txt).
 */

/* ------- SHARED BETWEEN INPUT ELEMENTS -------- */

input,
textarea,
button,
select,
input::file-selector-button {
    padding: 0.5em var(--input-xpadding);
    border-radius: 6px;
    appearance: none;
    text-overflow: ellipsis;

    /* Respect standard font settings */
    font: inherit;
    line-height: 1.6;
}
input:disabled,
textarea:disabled,
button:disabled,
select:disabled,
label[disabled] {
    opacity: 0.4;
}

input:focus-visible,
textarea:focus-visible,
button:focus-visible,
select:focus-visible,
input:focus-visible::file-selector-button {
    outline: 2px solid var(--novnc-lightblue);
    outline-offset: 1px;
}

/* ------- TEXT INPUT -------- */

input:not([type]),
input[type=date],
input[type=datetime-local],
input[type=email],
input[type=month],
input[type=number],
input[type=password],
input[type=search],
input[type=tel],
input[type=text],
input[type=time],
input[type=url],
input[type=week],
textarea {
    border: 1px solid var(--novnc-lightgrey);
    /* Account for borders on text inputs, buttons dont have borders */
    padding: calc(0.5em - 1px) var(--input-xpadding);
}
input:not([type]):focus-visible,
input[type=date]:focus-visible,
input[type=datetime-local]:focus-visible,
input[type=email]:focus-visible,
input[type=month]:focus-visible,
input[type=number]:focus-visible,
input[type=password]:focus-visible,
input[type=search]:focus-visible,
input[type=tel]:focus-visible,
input[type=text]:focus-visible,
input[type=time]:focus-visible,
input[type=url]:focus-visible,
input[type=week]:focus-visible,
textarea:focus-visible {
    outline-offset: -1px;
}

textarea {
    margin: unset; /* Remove Firefox's built in margin */
    /* Prevent layout from shifting when scrollbars show */
    scrollbar-gutter: stable;
    /* Make textareas show at minimum one line. This does not work when
       using box-sizing border-box, in which case, vertical padding and
       border width needs to be taken into account. */
    min-height: 1lh;
    vertical-align: baseline; /* Firefox gives "text-bottom" by default */
}

/* ------- NUMBER PICKERS ------- */

/* We can't style the number spinner buttons:
   https://github.com/w3c/csswg-drafts/issues/8777 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    /* Get rid of increase/decrease buttons in WebKit */
    appearance: none;
}
input[type=number] {
    /* Get rid of increase/decrease buttons in Firefox */
    appearance: textfield;
}

/* ------- BUTTON ACTIVATIONS -------- */

/* A color overlay that depends on the activation level. The level can then be
   set for different states on an element, for example hover and click on a
   <button>. */
input, button, select, option,
input::file-selector-button,
.button-activations {
    --button-activation-level: 0;
    /* Note that CSS variables aren't functions, beware when inheriting */
    --button-activation-alpha: calc(0.08 * var(--button-activation-level));
    /* FIXME: We want the image() function instead of the linear-gradient()
              function below. But it's not supported in the browsers yet. */
    --button-activation-overlay:
        linear-gradient(rgba(0, 0, 0, var(--button-activation-alpha))
        100%, transparent);
    --button-activation-overlay-light:
        linear-gradient(rgba(255, 255, 255, calc(0.23 * var(--button-activation-level)))
        100%, transparent);
}
.button-activations {
    background-image: var(--button-activation-overlay);

    /* Disable Chrome's touch tap highlight to avoid conflicts with overlay */
    -webkit-tap-highlight-color: transparent;
}
/* When we want the light overlay on activations instead.
   This is best used on elements with darker backgrounds. */
.button-activations.light-overlay {
    background-image: var(--button-activation-overlay-light);
    /* Can't use the normal blend mode since that gives washed out colors. */
    /* FIXME: For elements with these activation overlays we'd like only
              the luminosity to change. The proprty "background-blend-mode" set
              to "luminosity" sounds good, but it doesn't work as intended,
              see: https://bugzilla.mozilla.org/show_bug.cgi?id=1806417 */
    background-blend-mode: overlay;
}

input:hover, button:hover, select:hover, option:hover,
input::file-selector-button:hover,
.button-activations:hover {
    --button-activation-level: 1;
}
/* Unfortunately we have to disable the :hover effect on touch devices,
   otherwise the style lingers after tapping the button. */
@media (any-pointer: coarse) {
    input:hover, button:hover, select:hover, option:hover,
    input::file-selector-button:hover,
    .button-activations:hover {
        --button-activation-level: 0;
    }
}
input:active, button:active, select:active, option:active,
input::file-selector-button:active,
.button-activations:active {
    --button-activation-level: 2;
}
input:disabled, button:disabled, select:disabled, select:disabled option,
input:disabled::file-selector-button,
.button-activations:disabled {
    --button-activation-level: 0;
}

/* ------- BUTTONS -------- */

input[type=button],
input[type=color],
input[type=image],
input[type=reset],
input[type=submit],
input::file-selector-button,
button,
select {
    min-width: 8em;
    border: none;
    color: black;
    font-weight: bold;
    background-color: var(--novnc-buttongrey);
    background-image: var(--button-activation-overlay);
    cursor: pointer;
    /* Disable Chrome's touch tap highlight */
    -webkit-tap-highlight-color: transparent;
}
input[type=button]:disabled,
input[type=color]:disabled,
input[type=image]:disabled,
input[type=reset]:disabled,
input[type=submit]:disabled,
input:disabled::file-selector-button,
button:disabled,
select:disabled {
    /* See Firefox bug:
       https://bugzilla.mozilla.org/show_bug.cgi?id=1798304 */
    cursor: default;
}

input[type=button],
input[type=color],
input[type=reset],
input[type=submit] {
    /* Workaround for text-overflow bugs in Firefox and Chromium:
        https://bugzilla.mozilla.org/show_bug.cgi?id=1800077
        https://bugs.chromium.org/p/chromium/issues/detail?id=1383144 */
    overflow: clip;
}

/* ------- COLOR PICKERS ------- */

input[type=color] {
    min-width: unset;
    box-sizing: content-box;
    width: 1.4em;
    height: 1.4em;
}
input[type=color]::-webkit-color-swatch-wrapper {
    padding: 0;
}
/* -webkit-color-swatch & -moz-color-swatch cant be in a selector list:
   https://bugs.chromium.org/p/chromium/issues/detail?id=1154623 */
input[type=color]::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
}
input[type=color]::-moz-color-swatch {
    border: none;
    border-radius: 6px;
}

/* -- SHARED BETWEEN CHECKBOXES, RADIOBUTTONS AND THE TOGGLE CLASS -- */

input[type=radio],
input[type=checkbox] {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: var(--novnc-buttongrey);
    background-image: var(--button-activation-overlay);
    /* Disable Chrome's touch tap highlight to avoid conflicts with overlay */
    -webkit-tap-highlight-color: transparent;
    width: 16px;
    --checkradio-height: 16px;
    height: var(--checkradio-height);
    padding: 0;
    margin: 0 6px 0 0;
    /* Don't have transitions for outline in order to be consistent
       with other elements */
    transition: all 0.2s, outline-color 0s, outline-offset 0s;

    /* A transparent outline in order to work around a graphical clipping issue
       in WebKit. See bug: https://bugs.webkit.org/show_bug.cgi?id=256003 */
    outline: 1px solid transparent;
    position: relative; /* Since ::before & ::after are absolute positioned */

    /* We want to align with the middle of capital letters, this requires
       a workaround. The default behavior is to align the bottom of the element
       on top of the text baseline, this is too far up.
       We want to push the element down half the difference in height between
       it and a capital X. In our font, the height of a capital "X" is 0.698em.
     */
    vertical-align: calc(0px - (var(--checkradio-height) - 0.698em) / 2);
    /* FIXME: Could write 1cap instead of 0.698em, but it's only supported in
              Firefox as of 2023 */
    /* FIXME: We probably want to use round() here, see bug 8148 */
}
input[type=radio]:focus-visible,
input[type=checkbox]:focus-visible {
    outline-color: var(--novnc-lightblue);
}
input[type=checkbox]::before,
input[type=checkbox]:not(.toggle)::after,
input[type=radio]::before,
input[type=radio]::after {
    content: "";
    display: block; /* width & height doesn't work on inline elements */
    transition: inherit;
    /* Let's prevent the pseudo-elements from taking up layout space so that
       the ::before and ::after pseudo-elements can be in the same place. This
       is also required for vertical-align: baseline to work like we want it to
       on radio/checkboxes. If the pseudo-elements take up layout space, the
       baseline of text inside them will be used instead. */
    position: absolute;
}
input[type=checkbox]:not(.toggle)::after,
input[type=radio]::after {
    width: 10px;
    height: 2px;
    background-color: transparent;
    border-radius: 2px;
}

/* ------- CHECKBOXES ------- */

input[type=checkbox]:not(.toggle) {
    border-radius: 4px;
}
input[type=checkbox]:not(.toggle):checked,
input[type=checkbox]:not(.toggle):indeterminate {
    background-color: var(--novnc-blue);
    background-image: var(--button-activation-overlay-light);
    background-blend-mode: overlay;
}
input[type=checkbox]:not(.toggle)::before {
    width: 25%;
    height: 55%;
    border-style: solid;
    border-color: transparent;
    border-width: 0 2px 2px 0;
    border-radius: 1px;
    transform: translateY(-1px) rotate(35deg);
}
input[type=checkbox]:not(.toggle):checked::before {
    border-color: white;
}
input[type=checkbox]:not(.toggle):indeterminate::after {
    background-color: white;
}

/* ------- RADIO BUTTONS ------- */

input[type=radio] {
    border-radius: 50%;
    border: 1px solid transparent; /* To ensure a smooth transition */
}
input[type=radio]:checked {
    border: 4px solid var(--novnc-blue);
    background-color: white;
    /* button-activation-overlay should be removed from the radio
       element to not interfere with button-activation-overlay-light
       that is set on the ::before element. */
    background-image: none;
}
input[type=radio]::before {
    width: inherit;
    height: inherit;
    border-radius: inherit;
    /* We can achieve the highlight overlay effect on border colors by
       setting button-activation-overlay-light on an element that stays
       on top (z-axis) of the element with a border. */
    background-image: var(--button-activation-overlay-light);
    mix-blend-mode: overlay;
    opacity: 0;
}
input[type=radio]:checked::before {
    opacity: 1;
}
input[type=radio]:indeterminate::after {
    background-color: black;
}

/* ------- TOGGLE SWITCHES ------- */

/* These are meant to be used instead of checkboxes in some cases. If all of
   the following critera are true you should use a toggle switch:

    * The choice is a simple ON/OFF or ENABLE/DISABLE
    * The choice doesn't give the feeling of "I agree" or "I confirm"
    * There are not multiple related & grouped options
 */

input[type=checkbox].toggle {
    display: inline-block;
    --checkradio-height: 18px; /* Height value used in calc, see above */
    width: 31px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 9px;
}
input[type=checkbox].toggle:disabled {
    cursor: default;
}
input[type=checkbox].toggle:indeterminate {
    background-color: var(--novnc-buttongrey);
    background-image: var(--button-activation-overlay);
}
input[type=checkbox].toggle:checked {
    background-color: var(--novnc-blue);
    background-image: var(--button-activation-overlay-light);
    background-blend-mode: overlay;
}
input[type=checkbox].toggle::before {
    --circle-diameter: 10px;
    --circle-offset: 4px;
    width: var(--circle-diameter);
    height: var(--circle-diameter);
    top: var(--circle-offset);
    left: var(--circle-offset);
    background: white;
    border-radius: 6px;
}
input[type=checkbox].toggle:checked::before {
    left: calc(100% - var(--circle-offset) - var(--circle-diameter));
}
input[type=checkbox].toggle:indeterminate::before {
    left: calc(50% - var(--circle-diameter) / 2);
}

/* ------- RANGE SLIDERS ------- */

input[type=range] {
    border: unset;
    border-radius: 8px;
    height: 15px;
    padding: 0;
    background: transparent;
    /* Needed to get properly rounded corners on -moz-range-progress
       when the thumb is all the way to the right. Without overflow
       hidden, the pointy edges of the progress track shows to the
       right of the thumb. */
    overflow: hidden;
}
@supports selector(::-webkit-slider-thumb) {
    input[type=range] {
        width: 125px;
        clip-path: path(" \ M 4.5 3 \ L 4.5 0 \ L 120.5 0 \ L 120.5 3 \ A 1 1 0 0 1 120.5 12 \ L 120.5 15 \ L 4.5 15 \ L 4.5 12 \ A 1 1 0 0 1 4.5 3 \ ");
    }
}
input[type=range]:hover {
    cursor: grab;
}
input[type=range]:active {
    cursor: grabbing;
}
input[type=range]:disabled {
    cursor: default;
}
input[type=range]:focus-visible {
    clip-path: none; /* Otherwise it hides the outline */
}
/* -webkit-slider.. & -moz-range.. cant be in selector lists:
   https://bugs.chromium.org/p/chromium/issues/detail?id=1154623 */
input[type=range]::-webkit-slider-runnable-track {
    background-color: var(--novnc-buttongrey);
    height: 7px;
    border-radius: 4px;
    margin: 0 3px;
}
input[type=range]::-moz-range-track {
    background-color: var(--novnc-buttongrey);
    height: 7px;
    border-radius: 4px;
}
input[type=range]::-moz-range-progress {
    background-color: var(--novnc-blue);
    height: 9px;
    /* Needs rounded corners only on the left side. Otherwise the rounding of
       the progress track starts before the thumb, when the thumb is close to
       the left edge. */
    border-radius: 5px 0 0 5px;
}
input[type=range]::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: white;
    background-image: var(--button-activation-overlay);
    /* Disable Chrome's touch tap highlight to avoid conflicts with overlay */
    -webkit-tap-highlight-color: transparent;
    border: 3px solid var(--novnc-blue);
    margin-top: -4px;
    box-shadow: calc(-100vw - 8px) 0 0 100vw var(--novnc-blue);
    clip-path: path(" \ M -1000 3 \ L 3 3 \ L 15 7.5 \ A 1 1 0 0 1 0 7.5 \ A 1 1 0 0 1 15 7.5 \ L 3 12 \ L -1000 12 Z \ ");
}
input[type=range]::-moz-range-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: white;
    background-image: var(--button-activation-overlay);
    border: 3px solid var(--novnc-blue);
    margin-top: -7px;
}

/* ------- FILE CHOOSERS ------- */

input[type=file] {
    background-image: none;
    border: none;
}
input::file-selector-button {
    margin-right: 6px;
}
input[type=file]:focus-visible {
    outline: none; /* We outline the button instead of the entire element */
}

/* ------- SELECT BUTTONS ------- */

select {
    --select-arrow: url('data:image/svg+xml;utf8, \ <svg width="11" height="6" version="1.1" viewBox="0 0 11 6" \ xmlns="http://www.w3.org/2000/svg"> \ <path d="m10.5.5-5 5-5-5" fill="none" \ stroke="black" stroke-width="1.5" \ stroke-linecap="round" stroke-linejoin="round"/> \ </svg>');

    /* FIXME: A bug in Firefox, requires a workaround for the background:
              https://bugzilla.mozilla.org/show_bug.cgi?id=1810958 */
    /* The dropdown list will show the select element's background above and
       below the options in Firefox. We want the entire dropdown to be white. */
    background-color: white;
    /* However, we don't want the select element to actually show a white
       background, so let's place a gradient above it with the color we want. */
    --grey-background: linear-gradient(var(--novnc-buttongrey) 100%,
                                       transparent);
    background-image:
        var(--select-arrow),
        var(--button-activation-overlay),
        var(--grey-background);
    background-position: calc(100% - var(--input-xpadding)), left top, left top;
    background-repeat: no-repeat;
    padding-right: calc(2*var(--input-xpadding) + 11px);
    overflow: auto;
}
/* FIXME: :active isn't set when the <select> is opened in Firefox:
          https://bugzilla.mozilla.org/show_bug.cgi?id=1805406 */
select:active {
    /* Rotated arrow */
    background-image: url('data:image/svg+xml;utf8, \ <svg width="11" height="6" version="1.1" viewBox="0 0 11 6" \ xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"> \ <path d="m10.5.5-5 5-5-5" fill="none" \ stroke="black" stroke-width="1.5" \ stroke-linecap="round" stroke-linejoin="round"/> \ </svg>'),
        var(--button-activation-overlay),
        var(--grey-background);
}
select:disabled {
    background-image:
        var(--select-arrow),
        var(--grey-background);
}
/* Note that styling for <option> doesn't work in all browsers
   since its often drawn directly by the OS. We are generally very
   limited in what we can change here. */
option {
    /* Prevent Chrome from inheriting background-color from the <select> */
    background-color: white;
    color: black;
    font-weight: normal;
    background-image: var(--button-activation-overlay);
}
option:checked {
    background-color: var(--novnc-lightgrey);
}
/* Change the look when the <select> isn't used as a dropdown. When "size"
   or "multiple" are set, these elements behaves more like lists. */
select[size]:not([size="1"]), select[multiple] {
    background-color: white;
    background-image: unset; /* Don't show the arrow and other gradients */
    border: 1px solid var(--novnc-lightgrey);
    padding: 0;
    font-weight: normal; /* Without this, options get bold font in WebKit. */

    /* As an exception to the "list"-look, multi-selects in Chrome on Android,
       and Safari on iOS, are unfortunately designed to be shown as a single
       line. We can mitigate this inconsistency by at least fixing the height
       here. By setting a min-height that matches other input elements, it
       doesn't look too much out of place:
         (1px border * 2) + (6.5px padding * 2) + 24px line-height = 39px */
    min-height: 39px;
}
select[size]:not([size="1"]):focus-visible,
select[multiple]:focus-visible {
    /* Text input style focus-visible highlight */
    outline-offset: -1px;
}
select[size]:not([size="1"]) option, select[multiple] option {
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 4px var(--input-xpadding);
}

/*
 * noVNC base CSS
 * Copyright (C) 2019 The noVNC authors
 * noVNC is licensed under the MPL 2.0 (see LICENSE.txt)
 * This file is licensed under the 2-Clause BSD license (see LICENSE.txt).
 */

/*
 * Z index layers:
 *
 * 0: Main screen
 * 10: Control bar
 * 50: Transition blocker
 * 60: Connection popups
 * 100: Status bar
 * ...
 * 1000: Javascript crash
 * ...
 * 10000: Max (used for polyfills)
 */

/*
 * State variables (set on :root):
 *
 * noVNC_loading: Page is still loading
 * noVNC_connecting: Connecting to server
 * noVNC_reconnecting: Re-establishing a connection
 * noVNC_connected: Connected to server (most common state)
 * noVNC_disconnecting: Disconnecting from server
 */

/* :root {
    font-family: sans-serif;
    line-height: 1.6;
} */

.noVNC_only_touch.noVNC_hidden {
    display: none;
}

.noVNC_disabled {
    color: var(--novnc-grey);
}

/* ----------------------------------------
 * Spinner
 * ----------------------------------------
 */

.noVNC_spinner {
    position: relative;
}
.noVNC_spinner, .noVNC_spinner::before, .noVNC_spinner::after {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    box-shadow: -60px 10px 0 rgba(255, 255, 255, 0);
    animation: noVNC_spinner 1.0s linear infinite;
}
.noVNC_spinner::before {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    animation-delay: -0.1s;
}
.noVNC_spinner::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    animation-delay: 0.1s;
}
@keyframes noVNC_spinner {
    0% { box-shadow: -60px 10px 0 rgba(255, 255, 255, 0); width: 20px; }
    25% { box-shadow: 20px 10px 0 rgba(255, 255, 255, 1); width: 10px; }
    50% { box-shadow: 60px 10px 0 rgba(255, 255, 255, 0); width: 10px; }
}

/* ----------------------------------------
 * WebKit centering hacks
 * ----------------------------------------
 */

.noVNC_center {
    /*
     * This is a workaround because webkit misrenders transforms and
     * uses non-integer coordinates, resulting in blurry content.
     * Ideally we'd use "top: 50%; transform: translateY(-50%);" on
     * the objects instead.
     */
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.noVNC_center > * {
    pointer-events: auto;
}
.noVNC_vcenter {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    pointer-events: none;
}
.noVNC_vcenter > * {
    pointer-events: auto;
}

/* ----------------------------------------
 * Layering
 * ----------------------------------------
 */

.noVNC_connect_layer {
    z-index: 60;
}

/* ----------------------------------------
 * Fallback error
 * ----------------------------------------
 */

.noVNC_fallback_error {
    z-index: 1000;
    visibility: hidden;
    /* Put a dark background in front of everything but the error,
       and don't let mouse events pass through */
    background: rgba(0, 0, 0, 0.8);
    pointer-events: all;
}
.noVNC_fallback_error.noVNC_open {
    visibility: visible;
}

.noVNC_fallback_error > div {
    max-width: calc(100vw - 30px - 30px);
    max-height: calc(100vh - 30px - 30px);
    overflow: auto;

    padding: 15px;

    transition: 0.5s ease-in-out;

    transform: translateY(-50px);
    opacity: 0;

    text-align: center;
    font-weight: bold;
    color: #fff;

    border-radius: 12px;
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    background: rgba(200,55,55,0.8);
}
.noVNC_fallback_error.noVNC_open > div {
    transform: translateY(0);
    opacity: 1;
}

.noVNC_fallback_errormsg {
    font-weight: normal;
}

.noVNC_fallback_errormsg .noVNC_message {
    display: inline-block;
    text-align: left;
    font-family: monospace;
    white-space: pre-wrap;
}

.noVNC_fallback_error .noVNC_location {
    font-style: italic;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.8);
}

.noVNC_fallback_error .noVNC_stack {
    padding: 10px;
    margin: 10px;
    font-size: 0.8em;
    text-align: left;
    font-family: monospace;
    white-space: pre;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.2);
    overflow: auto;
}

/* ----------------------------------------
 * Control bar
 * ----------------------------------------
 */

.noVNC_control_bar_anchor {
    /* The anchor is needed to get z-stacking to work */
    position: absolute;
    z-index: 10;

    transition: 0.5s ease-in-out;

    /* Edge misrenders animations wihthout this */
    transform: translateX(0);
}
/* :root.noVNC_connected .noVNC_control_bar_anchor.noVNC_idle {
    opacity: 0.8;
} */
.noVNC_control_bar_anchor.noVNC_right {
    left: auto;
    right: 0;
}

.noVNC_control_bar {
    position: relative;
    left: -100%;

    transition: 0.5s ease-in-out;
    max-height: 100%;
    background-color: var(--novnc-blue);
    border-radius: 0 12px 12px 0;

    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none; /* Disable iOS image long-press popup */
}

.noVNC_control_bar.noVNC_open {
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    left: 0;
}
.noVNC_control_bar::before {
    /* This extra element is to get a proper shadow */
    content: "";
    position: absolute;
    z-index: -1;
    height: 100%;
    width: 30px;
    left: -30px;
    transition: box-shadow 0.5s ease-in-out;
}
.noVNC_control_bar.noVNC_open::before {
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
}
.noVNC_control_bar.noVNC_right {
    left: auto;  /* Reset left */
    right: -100%;
    border-radius: 12px 0 0 12px;
}

.noVNC_control_bar.noVNC_right.noVNC_open {
    right: 0%;
}
.noVNC_right .noVNC_control_bar::before {
    visibility: hidden;
}

.noVNC_control_bar_handle {
    position: absolute;
    left: -15px;
    top: 0;
    transform: translateY(35px);
    width: calc(100% + 30px);
    height: 50px;
    z-index: -1;
    cursor: pointer;
    border-radius: 6px;
    background-color: var(--novnc-darkblue);
    background-image: url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%0A%20%20%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%0A%20%20%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%0A%20%20%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%0A%20%20%20width%3D%2215%22%0A%20%20%20height%3D%2250%22%0A%20%20%20viewBox%3D%220%200%2015%2050%22%0A%20%20%20id%3D%22svg2%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20inkscape%3Aversion%3D%220.91%20r13725%22%0A%20%20%20sodipodi%3Adocname%3D%22handle_bg.svg%22%0A%20%20%20inkscape%3Aexport-filename%3D%22%2Fhome%2Fossman%2Fdevel%2FnoVNC%2Fimages%2Fdrag.png%22%0A%20%20%20inkscape%3Aexport-xdpi%3D%2290%22%0A%20%20%20inkscape%3Aexport-ydpi%3D%2290%22%3E%0A%20%20%3Cdefs%0A%20%20%20%20%20id%3D%22defs4%22%20%2F%3E%0A%20%20%3Csodipodi%3Anamedview%0A%20%20%20%20%20id%3D%22base%22%0A%20%20%20%20%20pagecolor%3D%22%23959595%22%0A%20%20%20%20%20bordercolor%3D%22%23666666%22%0A%20%20%20%20%20borderopacity%3D%221.0%22%0A%20%20%20%20%20inkscape%3Apageopacity%3D%220%22%0A%20%20%20%20%20inkscape%3Apageshadow%3D%222%22%0A%20%20%20%20%20inkscape%3Azoom%3D%2216%22%0A%20%20%20%20%20inkscape%3Acx%3D%22-10.001409%22%0A%20%20%20%20%20inkscape%3Acy%3D%2224.512566%22%0A%20%20%20%20%20inkscape%3Adocument-units%3D%22px%22%0A%20%20%20%20%20inkscape%3Acurrent-layer%3D%22layer1%22%0A%20%20%20%20%20showgrid%3D%22true%22%0A%20%20%20%20%20units%3D%22px%22%0A%20%20%20%20%20inkscape%3Asnap-bbox%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-bbox-edge-midpoints%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-paths%3D%22true%22%0A%20%20%20%20%20showguides%3D%22false%22%0A%20%20%20%20%20inkscape%3Awindow-width%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-height%3D%221136%22%0A%20%20%20%20%20inkscape%3Awindow-x%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-y%3D%2227%22%0A%20%20%20%20%20inkscape%3Awindow-maximized%3D%221%22%0A%20%20%20%20%20inkscape%3Asnap-smooth-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-intersection-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-global%3D%22true%22%3E%0A%20%20%20%20%3Cinkscape%3Agrid%0A%20%20%20%20%20%20%20type%3D%22xygrid%22%0A%20%20%20%20%20%20%20id%3D%22grid4136%22%20%2F%3E%0A%20%20%3C%2Fsodipodi%3Anamedview%3E%0A%20%20%3Cmetadata%0A%20%20%20%20%20id%3D%22metadata7%22%3E%0A%20%20%20%20%3Crdf%3ARDF%3E%0A%20%20%20%20%20%20%3Ccc%3AWork%0A%20%20%20%20%20%20%20%20%20rdf%3Aabout%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Aformat%3Eimage%2Fsvg%2Bxml%3C%2Fdc%3Aformat%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atype%0A%20%20%20%20%20%20%20%20%20%20%20rdf%3Aresource%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fdcmitype%2FStillImage%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atitle%3E%3C%2Fdc%3Atitle%3E%0A%20%20%20%20%20%20%3C%2Fcc%3AWork%3E%0A%20%20%20%20%3C%2Frdf%3ARDF%3E%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%0A%20%20%20%20%20inkscape%3Alabel%3D%22Layer%201%22%0A%20%20%20%20%20inkscape%3Agroupmode%3D%22layer%22%0A%20%20%20%20%20id%3D%22layer1%22%0A%20%20%20%20%20transform%3D%22translate(0%2C-1002.3622)%22%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20id%3D%22rect4249%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20x%3D%229.5%22%0A%20%20%20%20%20%20%20y%3D%221008.8622%22%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%0A%20%20%20%20%20%20%20y%3D%221013.8622%22%0A%20%20%20%20%20%20%20x%3D%229.5%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20id%3D%22rect4255%22%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%0A%20%20%20%20%20%20%20y%3D%221008.8622%22%0A%20%20%20%20%20%20%20x%3D%224.5%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20id%3D%22rect4261%22%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20id%3D%22rect4263%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20x%3D%224.5%22%0A%20%20%20%20%20%20%20y%3D%221013.8622%22%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%0A%20%20%20%20%20%20%20y%3D%221039.8622%22%0A%20%20%20%20%20%20%20x%3D%229.5%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20id%3D%22rect4265%22%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20id%3D%22rect4267%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20x%3D%229.5%22%0A%20%20%20%20%20%20%20y%3D%221044.8622%22%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20id%3D%22rect4269%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20x%3D%224.5%22%0A%20%20%20%20%20%20%20y%3D%221039.8622%22%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%0A%20%20%20%20%20%20%20y%3D%221044.8622%22%0A%20%20%20%20%20%20%20x%3D%224.5%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20id%3D%22rect4271%22%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20id%3D%22rect4273%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20x%3D%229.5%22%0A%20%20%20%20%20%20%20y%3D%221018.8622%22%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%0A%20%20%20%20%20%20%20y%3D%221018.8622%22%0A%20%20%20%20%20%20%20x%3D%224.5%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20id%3D%22rect4275%22%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20id%3D%22rect4277%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20x%3D%229.5%22%0A%20%20%20%20%20%20%20y%3D%221034.8622%22%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%20%2F%3E%0A%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20ry%3D%221.7382812e-05%22%0A%20%20%20%20%20%20%20y%3D%221034.8622%22%0A%20%20%20%20%20%20%20x%3D%224.5%22%0A%20%20%20%20%20%20%20height%3D%221.0000174%22%0A%20%20%20%20%20%20%20width%3D%221%22%0A%20%20%20%20%20%20%20id%3D%22rect4279%22%0A%20%20%20%20%20%20%20style%3D%22opacity%3A0.25%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3A%23ffffff%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A");
    background-repeat: no-repeat;
    background-position: right;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
}
.noVNC_control_bar_handle:after {
    content: "";
    transition: transform 0.5s ease-in-out;
    background: url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%0A%20%20%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%0A%20%20%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%0A%20%20%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%0A%20%20%20width%3D%225%22%0A%20%20%20height%3D%226%22%0A%20%20%20viewBox%3D%220%200%205%206%22%0A%20%20%20id%3D%22svg2%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20inkscape%3Aversion%3D%220.91%20r13725%22%0A%20%20%20sodipodi%3Adocname%3D%22handle.svg%22%0A%20%20%20inkscape%3Aexport-filename%3D%22%2Fhome%2Fossman%2Fdevel%2FnoVNC%2Fimages%2Fdrag.png%22%0A%20%20%20inkscape%3Aexport-xdpi%3D%2290%22%0A%20%20%20inkscape%3Aexport-ydpi%3D%2290%22%3E%0A%20%20%3Cdefs%0A%20%20%20%20%20id%3D%22defs4%22%20%2F%3E%0A%20%20%3Csodipodi%3Anamedview%0A%20%20%20%20%20id%3D%22base%22%0A%20%20%20%20%20pagecolor%3D%22%23959595%22%0A%20%20%20%20%20bordercolor%3D%22%23666666%22%0A%20%20%20%20%20borderopacity%3D%221.0%22%0A%20%20%20%20%20inkscape%3Apageopacity%3D%220%22%0A%20%20%20%20%20inkscape%3Apageshadow%3D%222%22%0A%20%20%20%20%20inkscape%3Azoom%3D%2232%22%0A%20%20%20%20%20inkscape%3Acx%3D%221.3551778%22%0A%20%20%20%20%20inkscape%3Acy%3D%228.7800329%22%0A%20%20%20%20%20inkscape%3Adocument-units%3D%22px%22%0A%20%20%20%20%20inkscape%3Acurrent-layer%3D%22layer1%22%0A%20%20%20%20%20showgrid%3D%22true%22%0A%20%20%20%20%20units%3D%22px%22%0A%20%20%20%20%20inkscape%3Asnap-bbox%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-bbox-edge-midpoints%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-paths%3D%22true%22%0A%20%20%20%20%20showguides%3D%22false%22%0A%20%20%20%20%20inkscape%3Awindow-width%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-height%3D%221136%22%0A%20%20%20%20%20inkscape%3Awindow-x%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-y%3D%2227%22%0A%20%20%20%20%20inkscape%3Awindow-maximized%3D%221%22%0A%20%20%20%20%20inkscape%3Asnap-smooth-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-intersection-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-global%3D%22true%22%3E%0A%20%20%20%20%3Cinkscape%3Agrid%0A%20%20%20%20%20%20%20type%3D%22xygrid%22%0A%20%20%20%20%20%20%20id%3D%22grid4136%22%20%2F%3E%0A%20%20%3C%2Fsodipodi%3Anamedview%3E%0A%20%20%3Cmetadata%0A%20%20%20%20%20id%3D%22metadata7%22%3E%0A%20%20%20%20%3Crdf%3ARDF%3E%0A%20%20%20%20%20%20%3Ccc%3AWork%0A%20%20%20%20%20%20%20%20%20rdf%3Aabout%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Aformat%3Eimage%2Fsvg%2Bxml%3C%2Fdc%3Aformat%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atype%0A%20%20%20%20%20%20%20%20%20%20%20rdf%3Aresource%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fdcmitype%2FStillImage%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atitle%3E%3C%2Fdc%3Atitle%3E%0A%20%20%20%20%20%20%3C%2Fcc%3AWork%3E%0A%20%20%20%20%3C%2Frdf%3ARDF%3E%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%0A%20%20%20%20%20inkscape%3Alabel%3D%22Layer%201%22%0A%20%20%20%20%20inkscape%3Agroupmode%3D%22layer%22%0A%20%20%20%20%20id%3D%22layer1%22%0A%20%20%20%20%20transform%3D%22translate(0%2C-1046.3622)%22%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20%20style%3D%22fill%3A%23ffffff%3Bfill-opacity%3A1%3Bfill-rule%3Aevenodd%3Bstroke%3A%23ffffff%3Bstroke-width%3A2%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20d%3D%22m%204.0000803%2C1049.3622%20-3%2C-2%200%2C4%20z%22%0A%20%20%20%20%20%20%20id%3D%22path4247%22%0A%20%20%20%20%20%20%20inkscape%3Aconnector-curvature%3D%220%22%0A%20%20%20%20%20%20%20sodipodi%3Anodetypes%3D%22cccc%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A");
    position: absolute;
    top: 22px; /* (50px-6px)/2 */
    right: 5px;
    width: 5px;
    height: 6px;
}
.noVNC_control_bar_handle.noVNC_open:after {
    transform: translateX(1px) rotate(180deg);
}
/* :root:not(.noVNC_connected) #noVNC_control_bar_handle {
    display: none;
} */
.noVNC_control_bar_handle.noVNC_right  {
    background-position: left;
}
.noVNC_control_bar_handle.noVNC_right:after {
    left: 5px;
    right: 0;
    transform: translateX(1px) rotate(180deg);
}

.noVNC_control_bar_handle.noVNC_right.noVNC_open:after {
    transform: none;
}
/* Larger touch area for the handle, used when a touch screen is available */
.noVNC_control_bar_handle div {
    position: absolute;
    right: -35px;
    top: 0;
    width: 50px;
    height: 100%;
    display: none;
}
@media (any-pointer: coarse) {
    .noVNC_control_bar_handle div {
        display: initial;
    }
}
.noVNC_control_bar_handle.noVNC_right  div {
    left: -35px;
    right: auto;
}

.noVNC_control_bar > .noVNC_scroll {
    max-height: 100%; /* Chrome is buggy with 100% */
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 10px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer & Edge */
}

.noVNC_control_bar > .noVNC_scroll > * {
    display: block;
    margin: 10px auto;
}

/* Control bar hint */
.noVNC_hint_anchor {
    position: absolute;
    right: -50px;
    left: auto;
}
.noVNC_hint_anchor.left {
    position: absolute;
    left: 50px;
    right: auto;
}
.noVNC_control_bar_hint {
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translate(-30%, -50%) scale(0);
    width: 100px;
    height: 50%;
    max-height: 600px;

    visibility: hidden;
    opacity: 0;
    transition: 0.2s ease-in-out;
    background: transparent;
    box-shadow: 0 0 10px black, inset 0 0 10px 10px var(--novnc-darkblue);
    border-radius: 12px;
    transition-delay: 0s;
}
.noVNC_control_bar_hint.noVNC_active {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.2s;
    transform: translate(-30%, -50%) scale(1);
}
.noVNC_control_bar_hint.left {
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translate(30%, -50%) scale(0);
    width: 100px;
    height: 50%;
    max-height: 600px;

    visibility: hidden;
    opacity: 0;
    transition: 0.2s ease-in-out;
    background: transparent;
    box-shadow: 0 0 10px black, inset 0 0 10px 10px var(--novnc-darkblue);
    border-radius: 12px;
    transition-delay: 0s;
}
.noVNC_control_bar_hint.noVNC_active.left {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.2s;
    transform: translate(30%, -50%) scale(1);
}
.noVNC_control_bar_hint.noVNC_notransition {
    transition: none !important;
}

.noVNC_control_bar_hint_left {
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(-30%, -50%) scale(0);
    width: 100px;
    height: 50%;
    max-height: 600px;

    visibility: hidden;
    opacity: 0;
    transition: 0.2s ease-in-out;
    background: transparent;
    box-shadow: 0 0 10px black, inset 0 0 10px 10px var(--novnc-darkblue);
    border-radius: 12px;
    transition-delay: 0s;
}
.noVNC_control_bar_hint_left.noVNC_active {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.2s;
    transform: translate(-30%, -50%) scale(1);
}
.noVNC_control_bar_hint_left.noVNC_notransition {
    transition: none !important;
}

/* Control bar buttons */
.noVNC_control_bar .noVNC_button {
    min-width: unset;
    padding: 4px 4px;
    vertical-align: middle;
    border:1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    background-color: transparent;
}
.noVNC_control_bar .noVNC_button.noVNC_selected {
    border-color: rgba(0, 0, 0, 0.8);
    background-color: rgba(0, 0, 0, 0.5);
}
.noVNC_control_bar .noVNC_button.noVNC_hidden {
    display: none !important;
}

.noVNC_control_bar .noVNC_inner_button {
    min-width: 50px;
    vertical-align: middle;
    padding: 4px 4px;
    border:1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    background-color: transparent;
}
.noVNC_control_bar .noVNC_inner_button.noVNC_selected {
    border-color: rgba(0, 0, 0, 0.8);
    background-color: rgba(0, 0, 0, 0.5);
}
.noVNC_control_bar .noVNC_inner_button.noVNC_hidden {
    display: none !important;
}

/* Panels */
.noVNC_panel {
    transform: translate(25px, -50%);

    transition: 0.5s ease-in-out;

    box-sizing: border-box; /* so max-width don't have to care about padding */
    max-width: calc(100vw - 75px - 25px); /* minus left and right margins */
    max-height: 100%; /* Chrome is buggy with 100% */
    overflow-x: hidden;
    overflow-y: auto;

    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: 15px;
    top: 50%;

    background: #fff;
    border-radius: 12px;
    color: #000;
    border: 2px solid #E0E0E0;
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    z-index: 1;
}
.noVNC_panel.noVNC_open {
    visibility: visible;
    opacity: 1;
    transform: translate(75px, -50%);
}
.noVNC_panel.noVNC_right {
    transform: translate(calc(-100% - 15px), -50%);
}
.noVNC_panel.noVNC_right.noVNC_open {
    transform: translate(calc(-100% - 20px), -50%);
}

.noVNC_panel > * {
    display: block;
    margin: 10px auto;
}
.noVNC_panel > *:first-child {
    margin-top: 0 !important;
}
.noVNC_panel > *:last-child {
    margin-bottom: 0 !important;
}

.noVNC_panel hr {
    border: none;
    border-top: 1px solid var(--novnc-lightgrey);
    width: 100%; /* <hr> inside a flexbox will otherwise be 0px wide */
}

.noVNC_panel label {
    display: block;
    white-space: nowrap;
    margin: 5px;
}
@media (max-width: 540px) {
    /* Allow wrapping on small screens */
    .noVNC_panel label {
        white-space: unset;
    }
}

.noVNC_panel li {
    margin: 5px;
}

.noVNC_panel button,
.noVNC_panel select,
.noVNC_panel textarea,
.noVNC_panel input:not([type=checkbox]):not([type=radio]) {
    margin-left: 6px;
    /* Prevent inputs in panels from being too wide */
    max-width: calc(100% - 6px - var(--input-xpadding) * 2);
}

.noVNC_panel .noVNC_heading {
    background-color: var(--novnc-blue);
    border-radius: 6px;
    padding: 5px 8px;
    /* Compensate for padding in image */
    padding-right: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
}
.noVNC_panel .noVNC_heading img {
    vertical-align: bottom;
}

.noVNC_panel form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.noVNC_panel .button_row {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
.noVNC_panel .button_row *:only-child {
    margin-left: auto; /* Align single buttons to the right */
}
/* ClipBoard */
.noVNC_panel_key {
    transform: translate(25px, -50%);

    transition: 0.5s ease-in-out;

    box-sizing: border-box; /* so max-width don't have to care about padding */
    max-width: calc(100vw - 75px - 25px); /* minus left and right margins */
    max-height: 100%; /* Chrome is buggy with 100% */
    overflow-x: hidden;
    overflow-y: scroll;

    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: 15px;
    top: 50%;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer & Edge */
    background: #fff;
    border-radius: 12px;
    color: #000;
    border: 2px solid #E0E0E0;
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    z-index: 1;
}
.noVNC_panel_key.noVNC_open {
    visibility: visible;
    opacity: 1;
    transform: translate(75px, -50%);
}
.noVNC_right .noVNC_vcenter {
    left: auto;
    right: 0;
}
.noVNC_panel_key.noVNC_right {
    transform: translate(calc(-100% - 15px), -50%);
}
.noVNC_panel_key.noVNC_open.noVNC_right {
    transform: translate(calc(-100% - 20px), -50%);
}

.noVNC_panel_key > * {
    display: block;
    margin: 10px auto;
}
.noVNC_panel_key > *:first-child {
    margin-top: 0 !important;
}
.noVNC_panel_key > *:last-child {
    margin-bottom: 0 !important;
}

.noVNC_panel_key hr {
    border: none;
    border-top: 1px solid var(--novnc-lightgrey);
    width: 100%; /* <hr> inside a flexbox will otherwise be 0px wide */
}

.noVNC_panel_key label {
    display: block;
    white-space: nowrap;
    margin: 5px;
}
@media (max-width: 540px) {
    /* Allow wrapping on small screens */
    .noVNC_panel_key label {
        white-space: unset;
    }
}

.noVNC_panel_key li {
    margin: 5px;
}

.noVNC_panel_key button,
.noVNC_panel_key select,
.noVNC_panel_key textarea,
.noVNC_panel_key input:not([type=checkbox]):not([type=radio]) {
    margin-left: 6px;
    /* Prevent inputs in panels from being too wide */
    max-width: calc(100% - 6px - var(--input-xpadding) * 2);
}

.noVNC_panel_key .noVNC_heading {
    background-color: var(--novnc-blue);
    border-radius: 6px;
    padding: 5px 8px;
    /* Compensate for padding in image */
    padding-right: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
}
.noVNC_panel_key .noVNC_heading img {
    vertical-align: bottom;
}

.noVNC_panel_key form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.noVNC_panel_key .button_row {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
.noVNC_panel_key .button_row *:only-child {
    margin-left: auto; /* Align single buttons to the right */
}
/* ClipBoard */
.noVNC_panel_clipboard {
    transform: translate(25px, -50%);

    transition: 0.5s ease-in-out;

    box-sizing: border-box; /* so max-width don't have to care about padding */
    max-width: calc(100vw - 75px - 25px); /* minus left and right margins */
    max-height: 100%; /* Chrome is buggy with 100% */
    overflow-x: hidden;
    overflow-y: auto;

    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: 15px;
    top: 50%;

    background: #fff;
    border-radius: 12px;
    color: #000;
    border: 2px solid #E0E0E0;
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    z-index: 1;
}
.noVNC_panel_clipboard.noVNC_open {
    visibility: visible;
    opacity: 1;
    transform: translate(75px, -50%);
}
.noVNC_right .noVNC_vcenter {
    left: auto;
    right: 0;
}
.noVNC_panel_clipboard.noVNC_right {
    transform: translate(calc(-100% - 15px), -50%);
}
.noVNC_panel_clipboard.noVNC_open.noVNC_right {
    transform: translate(calc(-100% - 75px), -50%);
}

.noVNC_panel_clipboard > * {
    display: block;
    margin: 10px auto;
}
.noVNC_panel_clipboard > *:first-child {
    margin-top: 0 !important;
}
.noVNC_panel_clipboard > *:last-child {
    margin-bottom: 0 !important;
}

.noVNC_panel_clipboard hr {
    border: none;
    border-top: 1px solid var(--novnc-lightgrey);
    width: 100%; /* <hr> inside a flexbox will otherwise be 0px wide */
}

.noVNC_panel_clipboard label {
    display: block;
    white-space: nowrap;
    margin: 5px;
}
@media (max-width: 540px) {
    /* Allow wrapping on small screens */
    .noVNC_panel_clipboard label {
        white-space: unset;
    }
}

.noVNC_panel_clipboard li {
    margin: 5px;
}

.noVNC_panel_clipboard button,
.noVNC_panel_clipboard select,
.noVNC_panel_clipboard textarea,
.noVNC_panel_clipboard input:not([type=checkbox]):not([type=radio]) {
    margin-left: 6px;
    /* Prevent inputs in panels from being too wide */
    max-width: calc(100% - 6px - var(--input-xpadding) * 2);
}

.noVNC_panel_clipboard .noVNC_heading {
    background-color: var(--novnc-blue);
    border-radius: 6px;
    padding: 5px 8px;
    /* Compensate for padding in image */
    padding-right: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
}
.noVNC_panel_clipboard .noVNC_heading img {
    vertical-align: bottom;
}

.noVNC_panel_clipboard form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.noVNC_panel_clipboard .button_row {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
.noVNC_panel_clipboard .button_row *:only-child {
    margin-left: auto; /* Align single buttons to the right */
}


/* Credential */

.noVNC_credentials {
    transform: translateX(25px);

    transition: 0.5s ease-in-out;

    box-sizing: border-box; /* so max-width don't have to care about padding */
    max-width: calc(100vw - 75px - 25px); /* minus left and right margins */
    max-height: 100%; /* Chrome is buggy with 100% */
    overflow-x: hidden;
    overflow-y: auto;

    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: 15px;

    background: #fff;
    border-radius: 12px;
    color: #000;
    border: 2px solid #E0E0E0;
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    z-index: 1;
}
.noVNC_credentials.noVNC_open {
    visibility: visible;
    opacity: 1;
    transform: translateX(75px);
}
.noVNC_right .noVNC_vcenter {
    left: auto;
    right: 0;
}
.noVNC_right .noVNC_credentials {
    transform: translateX(-25px);
}
.noVNC_right .noVNC_credentials.noVNC_open {
    transform: translateX(-75px);
}

.noVNC_credentials > * {
    display: block;
    margin: 10px auto;
}
.noVNC_credentials > *:first-child {
    margin-top: 0 !important;
}
.noVNC_credentials > *:last-child {
    margin-bottom: 0 !important;
}

.noVNC_credentials hr {
    border: none;
    border-top: 1px solid var(--novnc-lightgrey);
    width: 100%; /* <hr> inside a flexbox will otherwise be 0px wide */
}

.noVNC_credentials label {
    display: block;
    white-space: nowrap;
    margin: 5px;
}
@media (max-width: 540px) {
    /* Allow wrapping on small screens */
    .noVNC_credentials label {
        white-space: unset;
    }
}

.noVNC_credentials li {
    margin: 5px;
}

.noVNC_credentials button,
.noVNC_credentials select,
.noVNC_credentials textarea,
.noVNC_credentials input:not([type=checkbox]):not([type=radio]) {
    margin-left: 6px;
    /* Prevent inputs in panels from being too wide */
    max-width: calc(100% - 6px - var(--input-xpadding) * 2);
}

.noVNC_credentials .noVNC_heading {
    background-color: var(--novnc-blue);
    border-radius: 6px;
    padding: 5px 8px;
    /* Compensate for padding in image */
    padding-right: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
}
.noVNC_credentials .noVNC_heading img {
    vertical-align: bottom;
}

.noVNC_credentials form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.noVNC_credentials .button_row {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
.noVNC_credentials .button_row *:only-child {
    margin-left: auto; /* Align single buttons to the right */
}

/* Expanders */
.noVNC_expander {
    cursor: pointer;
}
.noVNC_expander::before {
    content: url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%0A%20%20%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%0A%20%20%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%0A%20%20%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%0A%20%20%20width%3D%229%22%0A%20%20%20height%3D%2210%22%0A%20%20%20viewBox%3D%220%200%209%2010%22%0A%20%20%20id%3D%22svg2%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20inkscape%3Aversion%3D%220.91%20r13725%22%0A%20%20%20sodipodi%3Adocname%3D%22expander.svg%22%3E%0A%20%20%3Cdefs%0A%20%20%20%20%20id%3D%22defs4%22%20%2F%3E%0A%20%20%3Csodipodi%3Anamedview%0A%20%20%20%20%20id%3D%22base%22%0A%20%20%20%20%20pagecolor%3D%22%23ffffff%22%0A%20%20%20%20%20bordercolor%3D%22%23666666%22%0A%20%20%20%20%20borderopacity%3D%221.0%22%0A%20%20%20%20%20inkscape%3Apageopacity%3D%220.0%22%0A%20%20%20%20%20inkscape%3Apageshadow%3D%222%22%0A%20%20%20%20%20inkscape%3Azoom%3D%2245.254834%22%0A%20%20%20%20%20inkscape%3Acx%3D%229.8737281%22%0A%20%20%20%20%20inkscape%3Acy%3D%226.4583132%22%0A%20%20%20%20%20inkscape%3Adocument-units%3D%22px%22%0A%20%20%20%20%20inkscape%3Acurrent-layer%3D%22layer1%22%0A%20%20%20%20%20showgrid%3D%22true%22%0A%20%20%20%20%20units%3D%22px%22%0A%20%20%20%20%20inkscape%3Asnap-object-midpoints%3D%22false%22%0A%20%20%20%20%20inkscape%3Aobject-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Awindow-width%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-height%3D%221136%22%0A%20%20%20%20%20inkscape%3Awindow-x%3D%220%22%0A%20%20%20%20%20inkscape%3Awindow-y%3D%2227%22%0A%20%20%20%20%20inkscape%3Awindow-maximized%3D%221%22%3E%0A%20%20%20%20%3Cinkscape%3Agrid%0A%20%20%20%20%20%20%20type%3D%22xygrid%22%0A%20%20%20%20%20%20%20id%3D%22grid4136%22%20%2F%3E%0A%20%20%3C%2Fsodipodi%3Anamedview%3E%0A%20%20%3Cmetadata%0A%20%20%20%20%20id%3D%22metadata7%22%3E%0A%20%20%20%20%3Crdf%3ARDF%3E%0A%20%20%20%20%20%20%3Ccc%3AWork%0A%20%20%20%20%20%20%20%20%20rdf%3Aabout%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Aformat%3Eimage%2Fsvg%2Bxml%3C%2Fdc%3Aformat%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atype%0A%20%20%20%20%20%20%20%20%20%20%20rdf%3Aresource%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fdcmitype%2FStillImage%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atitle%3E%3C%2Fdc%3Atitle%3E%0A%20%20%20%20%20%20%3C%2Fcc%3AWork%3E%0A%20%20%20%20%3C%2Frdf%3ARDF%3E%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%0A%20%20%20%20%20inkscape%3Alabel%3D%22Layer%201%22%0A%20%20%20%20%20inkscape%3Agroupmode%3D%22layer%22%0A%20%20%20%20%20id%3D%22layer1%22%0A%20%20%20%20%20transform%3D%22translate(0%2C-1042.3622)%22%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20%20style%3D%22color%3A%23000000%3Bfont-style%3Anormal%3Bfont-variant%3Anormal%3Bfont-weight%3Anormal%3Bfont-stretch%3Anormal%3Bfont-size%3Amedium%3Bline-height%3Anormal%3Bfont-family%3Asans-serif%3Btext-indent%3A0%3Btext-align%3Astart%3Btext-decoration%3Anone%3Btext-decoration-line%3Anone%3Btext-decoration-style%3Asolid%3Btext-decoration-color%3A%23000000%3Bletter-spacing%3Anormal%3Bword-spacing%3Anormal%3Btext-transform%3Anone%3Bdirection%3Altr%3Bblock-progression%3Atb%3Bwriting-mode%3Alr-tb%3Bbaseline-shift%3Abaseline%3Btext-anchor%3Astart%3Bwhite-space%3Anormal%3Bclip-rule%3Anonzero%3Bdisplay%3Ainline%3Boverflow%3Avisible%3Bvisibility%3Avisible%3Bopacity%3A1%3Bisolation%3Aauto%3Bmix-blend-mode%3Anormal%3Bcolor-interpolation%3AsRGB%3Bcolor-interpolation-filters%3AlinearRGB%3Bsolid-color%3A%23000000%3Bsolid-opacity%3A1%3Bfill%3A%23000000%3Bfill-opacity%3A1%3Bfill-rule%3Aevenodd%3Bstroke%3Anone%3Bstroke-width%3A4%3Bstroke-linecap%3Abutt%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%3Bcolor-rendering%3Aauto%3Bimage-rendering%3Aauto%3Bshape-rendering%3Aauto%3Btext-rendering%3Aauto%3Benable-background%3Aaccumulate%22%0A%20%20%20%20%20%20%20d%3D%22M%202.0800781%2C1042.3633%20A%202.0002%2C2.0002%200%200%200%200%2C1044.3613%20l%200%2C6%20a%202.0002%2C2.0002%200%200%200%203.0292969%2C1.7168%20l%205%2C-3%20a%202.0002%2C2.0002%200%200%200%200%2C-3.4316%20l%20-5%2C-3%20a%202.0002%2C2.0002%200%200%200%20-0.9492188%2C-0.2832%20z%22%0A%20%20%20%20%20%20%20id%3D%22path4138%22%0A%20%20%20%20%20%20%20inkscape%3Aconnector-curvature%3D%220%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A");
    display: inline-block;
    margin-right: 5px;
    transition: 0.2s ease-in-out;
}
.noVNC_expander.noVNC_open::before {
    transform: rotateZ(90deg);
}
.noVNC_expander ~ * {
    margin: 5px;
    margin-left: 10px;
    padding: 5px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
}
.noVNC_expander:not(.noVNC_open) ~ * {
    display: none;
}

/* Control bar content */

.noVNC_control_bar .noVNC_logo {
    font-size: 13px;
}

.noVNC_logo + hr {
    /* Remove all but top border */
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}
/* 
:root:not(.noVNC_connected) #noVNC_view_drag_button {
    display: none;
}

/* noVNC Touch Device only buttons */
/* :root:not(.noVNC_connected) #noVNC_mobile_buttons {
    display: none;
} */
/* @media not all and (any-pointer: coarse) {
    :root.noVNC_connected #noVNC_mobile_buttons {
        display: none;
    }
} */

/* :root:not(.noVNC_connected) #noVNC_toggle_extra_keys_button {
    display: none;
} */

.noVNC_modifiers {
    background-color: var(--novnc-darkgrey);
    border: none;
    padding: 10px;
}

/* Shutdown/Reboot */
/* :root:not(.noVNC_connected) #noVNC_power_button {
    display: none;
} */
.noVNC_power {
}
.noVNC_power_buttons {
    display: none;
}

.noVNC_power input[type=button] {
    width: 100%;
}

/* Clipboard */
/* :root:not(.noVNC_connected) #noVNC_clipboard_button {
    display: none;
} */
.noVNC_clipboard_text {
    width: 360px;
    min-width: 150px;
    height: 160px;
    min-height: 70px;

    box-sizing: border-box;
    max-width: 100%;
    /* minus approximate height of title, height of subtitle, and margin */
    max-height: calc(100vh - 10em - 25px);
}

/* Settings */
.noVNC_settings ul {
    list-style: none;
    padding: 0px;
}
.noVNC_setting_port {
    width: 80px;
}
.noVNC_setting_path {
    width: 100px;
}

/* Version */

.noVNC_version_wrapper {
    font-size: small;
}

.noVNC_version {
    margin-left: 1rem;
}

/* Connection controls */
/* :root:not(.noVNC_connected) #noVNC_disconnect_button {
    display: none;
} */

/* ----------------------------------------
 * Status dialog
 * ----------------------------------------
 */

.noVNC_status {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    transform: translateY(-100%);

    cursor: pointer;

    transition: 0.5s ease-in-out;

    visibility: hidden;
    opacity: 0;

    padding: 5px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;

    line-height: 1.6;
    word-wrap: break-word;
    color: #fff;

    border-bottom: 1px solid rgba(0, 0, 0, 0.9);
}
.noVNC_status.noVNC_open {
    transform: translateY(0);
    visibility: visible;
    opacity: 1;
}

.noVNC_status::before {
    content: "";
    display: inline-block;
    width: 25px;
    height: 25px;
    margin-right: 5px;
}

.noVNC_status.noVNC_status_normal {
    background: rgba(128,128,128,0.9);
}
.noVNC_status.noVNC_status_normal::before {
    content: url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%0A%20%20%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%0A%20%20%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%0A%20%20%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%0A%20%20%20width%3D%2225%22%0A%20%20%20height%3D%2225%22%0A%20%20%20viewBox%3D%220%200%2025%2025%22%0A%20%20%20id%3D%22svg2%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20inkscape%3Aversion%3D%220.91%20r13725%22%0A%20%20%20sodipodi%3Adocname%3D%22info.svg%22%0A%20%20%20inkscape%3Aexport-filename%3D%22%2Fhome%2Fossman%2Fdevel%2FnoVNC%2Fimages%2Fdrag.png%22%0A%20%20%20inkscape%3Aexport-xdpi%3D%2290%22%0A%20%20%20inkscape%3Aexport-ydpi%3D%2290%22%3E%0A%20%20%3Cdefs%0A%20%20%20%20%20id%3D%22defs4%22%20%2F%3E%0A%20%20%3Csodipodi%3Anamedview%0A%20%20%20%20%20id%3D%22base%22%0A%20%20%20%20%20pagecolor%3D%22%23959595%22%0A%20%20%20%20%20bordercolor%3D%22%23666666%22%0A%20%20%20%20%20borderopacity%3D%221.0%22%0A%20%20%20%20%20inkscape%3Apageopacity%3D%220%22%0A%20%20%20%20%20inkscape%3Apageshadow%3D%222%22%0A%20%20%20%20%20inkscape%3Azoom%3D%221%22%0A%20%20%20%20%20inkscape%3Acx%3D%2215.720838%22%0A%20%20%20%20%20inkscape%3Acy%3D%228.9111233%22%0A%20%20%20%20%20inkscape%3Adocument-units%3D%22px%22%0A%20%20%20%20%20inkscape%3Acurrent-layer%3D%22layer1%22%0A%20%20%20%20%20showgrid%3D%22false%22%0A%20%20%20%20%20units%3D%22px%22%0A%20%20%20%20%20inkscape%3Asnap-bbox%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-bbox-edge-midpoints%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-paths%3D%22true%22%0A%20%20%20%20%20showguides%3D%22false%22%0A%20%20%20%20%20inkscape%3Awindow-width%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-height%3D%221136%22%0A%20%20%20%20%20inkscape%3Awindow-x%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-y%3D%2227%22%0A%20%20%20%20%20inkscape%3Awindow-maximized%3D%221%22%0A%20%20%20%20%20inkscape%3Asnap-smooth-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-intersection-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-global%3D%22true%22%3E%0A%20%20%20%20%3Cinkscape%3Agrid%0A%20%20%20%20%20%20%20type%3D%22xygrid%22%0A%20%20%20%20%20%20%20id%3D%22grid4136%22%20%2F%3E%0A%20%20%3C%2Fsodipodi%3Anamedview%3E%0A%20%20%3Cmetadata%0A%20%20%20%20%20id%3D%22metadata7%22%3E%0A%20%20%20%20%3Crdf%3ARDF%3E%0A%20%20%20%20%20%20%3Ccc%3AWork%0A%20%20%20%20%20%20%20%20%20rdf%3Aabout%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Aformat%3Eimage%2Fsvg%2Bxml%3C%2Fdc%3Aformat%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atype%0A%20%20%20%20%20%20%20%20%20%20%20rdf%3Aresource%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fdcmitype%2FStillImage%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atitle%20%2F%3E%0A%20%20%20%20%20%20%3C%2Fcc%3AWork%3E%0A%20%20%20%20%3C%2Frdf%3ARDF%3E%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%0A%20%20%20%20%20inkscape%3Alabel%3D%22Layer%201%22%0A%20%20%20%20%20inkscape%3Agroupmode%3D%22layer%22%0A%20%20%20%20%20id%3D%22layer1%22%0A%20%20%20%20%20transform%3D%22translate(0%2C-1027.3622)%22%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20%20style%3D%22opacity%3A1%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3Anone%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20d%3D%22M%2012.5%203%20A%209.5%209.4999914%200%200%200%203%2012.5%20A%209.5%209.4999914%200%200%200%2012.5%2022%20A%209.5%209.4999914%200%200%200%2022%2012.5%20A%209.5%209.4999914%200%200%200%2012.5%203%20z%20M%2012.5%205%20A%201.5%201.5000087%200%200%201%2014%206.5%20A%201.5%201.5000087%200%200%201%2012.5%208%20A%201.5%201.5000087%200%200%201%2011%206.5%20A%201.5%201.5000087%200%200%201%2012.5%205%20z%20M%2010.521484%208.9785156%20L%2012.521484%208.9785156%20A%201.50015%201.50015%200%200%201%2014.021484%2010.478516%20L%2014.021484%2015.972656%20A%201.50015%201.50015%200%200%201%2014.498047%2018.894531%20C%2014.498047%2018.894531%2013.74301%2019.228309%2012.789062%2018.912109%20C%2012.312092%2018.754109%2011.776235%2018.366625%2011.458984%2017.828125%20C%2011.141734%2017.289525%2011.021484%2016.668469%2011.021484%2015.980469%20L%2011.021484%2011.980469%20L%2010.521484%2011.980469%20A%201.50015%201.50015%200%201%201%2010.521484%208.9804688%20L%2010.521484%208.9785156%20z%20%22%0A%20%20%20%20%20%20%20transform%3D%22translate(0%2C1027.3622)%22%0A%20%20%20%20%20%20%20id%3D%22path4136%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A") " ";
}
.noVNC_status.noVNC_status_error {
    background: rgba(200,55,55,0.9);
}
.noVNC_status.noVNC_status_error::before {
    content: url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%0A%20%20%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%0A%20%20%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%0A%20%20%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%0A%20%20%20width%3D%2225%22%0A%20%20%20height%3D%2225%22%0A%20%20%20viewBox%3D%220%200%2025%2025%22%0A%20%20%20id%3D%22svg2%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20inkscape%3Aversion%3D%220.91%20r13725%22%0A%20%20%20sodipodi%3Adocname%3D%22error.svg%22%0A%20%20%20inkscape%3Aexport-filename%3D%22%2Fhome%2Fossman%2Fdevel%2FnoVNC%2Fimages%2Fdrag.png%22%0A%20%20%20inkscape%3Aexport-xdpi%3D%2290%22%0A%20%20%20inkscape%3Aexport-ydpi%3D%2290%22%3E%0A%20%20%3Cdefs%0A%20%20%20%20%20id%3D%22defs4%22%20%2F%3E%0A%20%20%3Csodipodi%3Anamedview%0A%20%20%20%20%20id%3D%22base%22%0A%20%20%20%20%20pagecolor%3D%22%23959595%22%0A%20%20%20%20%20bordercolor%3D%22%23666666%22%0A%20%20%20%20%20borderopacity%3D%221.0%22%0A%20%20%20%20%20inkscape%3Apageopacity%3D%220%22%0A%20%20%20%20%20inkscape%3Apageshadow%3D%222%22%0A%20%20%20%20%20inkscape%3Azoom%3D%221%22%0A%20%20%20%20%20inkscape%3Acx%3D%2214.00357%22%0A%20%20%20%20%20inkscape%3Acy%3D%2212.443398%22%0A%20%20%20%20%20inkscape%3Adocument-units%3D%22px%22%0A%20%20%20%20%20inkscape%3Acurrent-layer%3D%22layer1%22%0A%20%20%20%20%20showgrid%3D%22false%22%0A%20%20%20%20%20units%3D%22px%22%0A%20%20%20%20%20inkscape%3Asnap-bbox%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-bbox-edge-midpoints%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-paths%3D%22true%22%0A%20%20%20%20%20showguides%3D%22true%22%0A%20%20%20%20%20inkscape%3Awindow-width%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-height%3D%221136%22%0A%20%20%20%20%20inkscape%3Awindow-x%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-y%3D%2227%22%0A%20%20%20%20%20inkscape%3Awindow-maximized%3D%221%22%0A%20%20%20%20%20inkscape%3Asnap-smooth-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-intersection-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-global%3D%22true%22%3E%0A%20%20%20%20%3Cinkscape%3Agrid%0A%20%20%20%20%20%20%20type%3D%22xygrid%22%0A%20%20%20%20%20%20%20id%3D%22grid4136%22%20%2F%3E%0A%20%20%3C%2Fsodipodi%3Anamedview%3E%0A%20%20%3Cmetadata%0A%20%20%20%20%20id%3D%22metadata7%22%3E%0A%20%20%20%20%3Crdf%3ARDF%3E%0A%20%20%20%20%20%20%3Ccc%3AWork%0A%20%20%20%20%20%20%20%20%20rdf%3Aabout%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Aformat%3Eimage%2Fsvg%2Bxml%3C%2Fdc%3Aformat%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atype%0A%20%20%20%20%20%20%20%20%20%20%20rdf%3Aresource%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fdcmitype%2FStillImage%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atitle%20%2F%3E%0A%20%20%20%20%20%20%3C%2Fcc%3AWork%3E%0A%20%20%20%20%3C%2Frdf%3ARDF%3E%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%0A%20%20%20%20%20inkscape%3Alabel%3D%22Layer%201%22%0A%20%20%20%20%20inkscape%3Agroupmode%3D%22layer%22%0A%20%20%20%20%20id%3D%22layer1%22%0A%20%20%20%20%20transform%3D%22translate(0%2C-1027.3622)%22%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20%20style%3D%22opacity%3A1%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bstroke%3Anone%3Bstroke-width%3A1%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%22%0A%20%20%20%20%20%20%20d%3D%22M%207%203%20C%204.7839905%203%203%204.7839905%203%207%20L%203%2018%20C%203%2020.21601%204.7839905%2022%207%2022%20L%2018%2022%20C%2020.21601%2022%2022%2020.21601%2022%2018%20L%2022%207%20C%2022%204.7839905%2020.21601%203%2018%203%20L%207%203%20z%20M%207.6992188%206%20A%201.6916875%201.6924297%200%200%201%208.9121094%206.5117188%20L%2012.5%2010.101562%20L%2016.087891%206.5117188%20A%201.6916875%201.6924297%200%200%201%2017.251953%206%20A%201.6916875%201.6924297%200%200%201%2018.480469%208.90625%20L%2014.892578%2012.496094%20L%2018.480469%2016.085938%20A%201.6916875%201.6924297%200%201%201%2016.087891%2018.478516%20L%2012.5%2014.888672%20L%208.9121094%2018.478516%20A%201.6916875%201.6924297%200%201%201%206.5214844%2016.085938%20L%2010.109375%2012.496094%20L%206.5214844%208.90625%20A%201.6916875%201.6924297%200%200%201%207.6992188%206%20z%20%22%0A%20%20%20%20%20%20%20transform%3D%22translate(0%2C1027.3622)%22%0A%20%20%20%20%20%20%20id%3D%22rect4135%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A") " ";
}
.noVNC_status.noVNC_status_warn {
    background: rgba(180,180,30,0.9);
}
.noVNC_status.noVNC_status_warn::before {
    content: url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%0A%20%20%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%0A%20%20%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%0A%20%20%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%0A%20%20%20width%3D%2225%22%0A%20%20%20height%3D%2225%22%0A%20%20%20viewBox%3D%220%200%2025%2025%22%0A%20%20%20id%3D%22svg2%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20inkscape%3Aversion%3D%220.91%20r13725%22%0A%20%20%20sodipodi%3Adocname%3D%22warning.svg%22%0A%20%20%20inkscape%3Aexport-filename%3D%22%2Fhome%2Fossman%2Fdevel%2FnoVNC%2Fimages%2Fdrag.png%22%0A%20%20%20inkscape%3Aexport-xdpi%3D%2290%22%0A%20%20%20inkscape%3Aexport-ydpi%3D%2290%22%3E%0A%20%20%3Cdefs%0A%20%20%20%20%20id%3D%22defs4%22%20%2F%3E%0A%20%20%3Csodipodi%3Anamedview%0A%20%20%20%20%20id%3D%22base%22%0A%20%20%20%20%20pagecolor%3D%22%23959595%22%0A%20%20%20%20%20bordercolor%3D%22%23666666%22%0A%20%20%20%20%20borderopacity%3D%221.0%22%0A%20%20%20%20%20inkscape%3Apageopacity%3D%220%22%0A%20%20%20%20%20inkscape%3Apageshadow%3D%222%22%0A%20%20%20%20%20inkscape%3Azoom%3D%221%22%0A%20%20%20%20%20inkscape%3Acx%3D%2216.457343%22%0A%20%20%20%20%20inkscape%3Acy%3D%2212.179552%22%0A%20%20%20%20%20inkscape%3Adocument-units%3D%22px%22%0A%20%20%20%20%20inkscape%3Acurrent-layer%3D%22layer1%22%0A%20%20%20%20%20showgrid%3D%22false%22%0A%20%20%20%20%20units%3D%22px%22%0A%20%20%20%20%20inkscape%3Asnap-bbox%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Abbox-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-bbox-edge-midpoints%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-paths%3D%22true%22%0A%20%20%20%20%20showguides%3D%22false%22%0A%20%20%20%20%20inkscape%3Awindow-width%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-height%3D%221136%22%0A%20%20%20%20%20inkscape%3Awindow-x%3D%221920%22%0A%20%20%20%20%20inkscape%3Awindow-y%3D%2227%22%0A%20%20%20%20%20inkscape%3Awindow-maximized%3D%221%22%0A%20%20%20%20%20inkscape%3Asnap-smooth-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Aobject-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-intersection-paths%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-nodes%3D%22true%22%0A%20%20%20%20%20inkscape%3Asnap-global%3D%22true%22%3E%0A%20%20%20%20%3Cinkscape%3Agrid%0A%20%20%20%20%20%20%20type%3D%22xygrid%22%0A%20%20%20%20%20%20%20id%3D%22grid4136%22%20%2F%3E%0A%20%20%3C%2Fsodipodi%3Anamedview%3E%0A%20%20%3Cmetadata%0A%20%20%20%20%20id%3D%22metadata7%22%3E%0A%20%20%20%20%3Crdf%3ARDF%3E%0A%20%20%20%20%20%20%3Ccc%3AWork%0A%20%20%20%20%20%20%20%20%20rdf%3Aabout%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Aformat%3Eimage%2Fsvg%2Bxml%3C%2Fdc%3Aformat%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atype%0A%20%20%20%20%20%20%20%20%20%20%20rdf%3Aresource%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fdcmitype%2FStillImage%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Cdc%3Atitle%3E%3C%2Fdc%3Atitle%3E%0A%20%20%20%20%20%20%3C%2Fcc%3AWork%3E%0A%20%20%20%20%3C%2Frdf%3ARDF%3E%0A%20%20%3C%2Fmetadata%3E%0A%20%20%3Cg%0A%20%20%20%20%20inkscape%3Alabel%3D%22Layer%201%22%0A%20%20%20%20%20inkscape%3Agroupmode%3D%22layer%22%0A%20%20%20%20%20id%3D%22layer1%22%0A%20%20%20%20%20transform%3D%22translate(0%2C-1027.3622)%22%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20%20style%3D%22color%3A%23000000%3Bfont-style%3Anormal%3Bfont-variant%3Anormal%3Bfont-weight%3Anormal%3Bfont-stretch%3Anormal%3Bfont-size%3Amedium%3Bline-height%3Anormal%3Bfont-family%3Asans-serif%3Btext-indent%3A0%3Btext-align%3Astart%3Btext-decoration%3Anone%3Btext-decoration-line%3Anone%3Btext-decoration-style%3Asolid%3Btext-decoration-color%3A%23000000%3Bletter-spacing%3Anormal%3Bword-spacing%3Anormal%3Btext-transform%3Anone%3Bdirection%3Altr%3Bblock-progression%3Atb%3Bwriting-mode%3Alr-tb%3Bbaseline-shift%3Abaseline%3Btext-anchor%3Astart%3Bwhite-space%3Anormal%3Bclip-rule%3Anonzero%3Bdisplay%3Ainline%3Boverflow%3Avisible%3Bvisibility%3Avisible%3Bopacity%3A1%3Bisolation%3Aauto%3Bmix-blend-mode%3Anormal%3Bcolor-interpolation%3AsRGB%3Bcolor-interpolation-filters%3AlinearRGB%3Bsolid-color%3A%23000000%3Bsolid-opacity%3A1%3Bfill%3A%23ffffff%3Bfill-opacity%3A1%3Bfill-rule%3Aevenodd%3Bstroke%3Anone%3Bstroke-width%3A4%3Bstroke-linecap%3Abutt%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A4%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A0%3Bstroke-opacity%3A1%3Bcolor-rendering%3Aauto%3Bimage-rendering%3Aauto%3Bshape-rendering%3Aauto%3Btext-rendering%3Aauto%3Benable-background%3Aaccumulate%22%0A%20%20%20%20%20%20%20d%3D%22M%2012.513672%203.0019531%20C%2011.751609%202.9919531%2011.052563%203.4242687%2010.710938%204.1054688%20L%203.2109375%2019.105469%20C%202.5461937%2020.435369%203.5132277%2021.9999%205%2022%20L%2020%2022%20C%2021.486772%2021.9999%2022.453806%2020.435369%2021.789062%2019.105469%20L%2014.289062%204.1054688%20C%2013.951849%203.4330688%2013.265888%203.0066531%2012.513672%203.0019531%20z%20M%2012.478516%206.9804688%20A%201.50015%201.50015%200%200%201%2014%208.5%20L%2014%2014.5%20A%201.50015%201.50015%200%201%201%2011%2014.5%20L%2011%208.5%20A%201.50015%201.50015%200%200%201%2012.478516%206.9804688%20z%20M%2012.5%2017%20A%201.5%201.5%200%200%201%2014%2018.5%20A%201.5%201.5%200%200%201%2012.5%2020%20A%201.5%201.5%200%200%201%2011%2018.5%20A%201.5%201.5%200%200%201%2012.5%2017%20z%20%22%0A%20%20%20%20%20%20%20transform%3D%22translate(0%2C1027.3622)%22%0A%20%20%20%20%20%20%20id%3D%22path4208%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A") " ";
}

/* ----------------------------------------
 * Connect dialog
 * ----------------------------------------
 */

.noVNC_connect_dlg {
    transition: 0.5s ease-in-out;

    transform: scale(0, 0);
    visibility: hidden;
    opacity: 0;
}
.noVNC_connect_dlg.noVNC_open {
    transform: scale(1, 1);
    visibility: visible;
    opacity: 1;
}
.noVNC_connect_dlg .noVNC_logo {
    transition: 0.5s ease-in-out;
    padding: 10px;
    margin-bottom: 10px;

    font-size: 80px;
    text-align: center;

    border-radius: 6px;
}
@media (max-width: 440px) {
    .noVNC_connect_dlg {
        max-width: calc(100vw - 100px);
    }
    .noVNC_connect_dlg .noVNC_logo {
        font-size: calc(25vw - 30px);
    }
}
.noVNC_connect_dlg div {
    padding: 18px;

    background-color: var(--novnc-darkgrey);
    border-radius: 12px;
    text-align: center;
    font-size: 20px;

    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
}
.noVNC_connect_button {
    width: 100%;
    padding: 6px 30px;
    cursor: pointer;
    border-color: transparent;
    border-radius: 12px;
    background-color: var(--novnc-blue);
    color: white;

    display: flex;
    justify-content: center;
    place-items: center;
    gap: 4px;
}

.noVNC_connect_button img {
    vertical-align: bottom;
    height: 1.3em;
}

/* ----------------------------------------
 * Server verification dialog
 * ----------------------------------------
 */

.noVNC_verify_server_dlg {
    position: relative;

    transform: translateY(-50px);
}
.noVNC_verify_server_dlg.noVNC_open {
    transform: translateY(0);
}
.noVNC_fingerprint_block {
    margin: 10px;
}

/* ----------------------------------------
 * Password dialog
 * ----------------------------------------
 */

.noVNC_credentials_dlg {
    position: relative;

    transform: translateY(-50px);
}
.noVNC_credentials_dlg.noVNC_open {
    transform: translateY(0);
}
.noVNC_username_block.noVNC_hidden,
.noVNC_password_block.noVNC_hidden {
    display: none;
}


/* ----------------------------------------
 * Main area
 * ----------------------------------------
 */

/* Transition screen */
.noVNC_transition {
    transition: 0.5s ease-in-out;

    display: flex;
    opacity: 0;
    visibility: hidden;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    color: white;
    background: rgba(0, 0, 0, 0.5);
    z-index: 50;

    /*display: flex;*/
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
/* :root.noVNC_loading #noVNC_transition,
:root.noVNC_connecting #noVNC_transition,
:root.noVNC_disconnecting #noVNC_transition,
:root.noVNC_reconnecting #noVNC_transition {
    opacity: 1;
    visibility: visible;
}
:root:not(.noVNC_reconnecting) #noVNC_cancel_reconnect_button {
    display: none;
} */
.noVNC_transition_text {
    font-size: 1.5em;
}

/* Main container */
.noVNC_container {
    width: 100%;
    height: 100%;
    background-color: #313131;
    border-bottom-right-radius: 800px 600px;
    /*border-top-left-radius: 800px 600px;*/

    /* If selection isn't disabled, long-pressing stuff in the sidebar
       can accidentally select the container or the canvas. This can
       happen when attempting to move the handle. */
    user-select: none;
    -webkit-user-select: none;
}

.noVNC_keyboardinput {
    width: 1px;
    height: 1px;
    background-color: #fff;
    color: #fff;
    border: 0;
    position: absolute;
    left: -40px;
    z-index: -1;
    ime-mode: disabled;
}

.noVNC_logo {
    color: var(--novnc-yellow);
    font-family: 'Orbitron', 'OrbitronTTF', sans-serif;
    line-height: 0.9;
    text-shadow: 0.1em 0.1em 0 black;
}
.noVNC_logo span{
    color: var(--novnc-green);
}

.noVNC_bell {
    display: none;
}

/* ----------------------------------------
 * Media sizing
 * ----------------------------------------
 */

@media screen and (max-width: 640px){
    .noVNC_logo {
        font-size: 150px;
    }
}

@media screen and (min-width: 321px) and (max-width: 480px) {
    .noVNC_logo {
        font-size: 110px;
    }
}

@media screen and (max-width: 320px) {
    .noVNC_logo {
        font-size: 90px;
    }
}
</style>

<Uivnc 
    bind:UI 
    bind:noVNC_status 
    bind:noVNC_container 
    bind:noVNC_Element 
    bind:noVNC_fullscreen_button 
    bind:noVNC_setting_logging 
    bind:noVNC_control_bar 
    bind:noVNC_view_drag_button 
    bind:noVNC_control_bar_handle 
    bind:noVNC_keyboard_button
    bind:noVNC_keyboardinput
    bind:noVNC_toggle_extra_keys_button
    bind:noVNC_toggle_ctrl_button
    bind:noVNC_toggle_windows_button
    bind:noVNC_toggle_embedded
    bind:noVNC_toggle_alt_button
    bind:noVNC_send_tab_button
    bind:noVNC_send_esc_button
    bind:noVNC_send_ctrl_alt_del_button
    bind:noVNC_shutdown_button
    bind:noVNC_reboot_button
    bind:noVNC_reset_button
    bind:noVNC_power_button
    bind:noVNC_disconnect_button
    bind:noVNC_connect_button
    bind:noVNC_cancel_reconnect_button
    bind:noVNC_approve_server_button
    bind:noVNC_reject_server_button
    bind:noVNC_credentials_button
    bind:noVNC_clipboard_button
    bind:noVNC_clipboard_text
    bind:noVNC_settings_button
    bind:noVNC_transition_text
    bind:noVNC_verify_server_dlg
    bind:noVNC_credentials_dlg
    bind:noVNC_control_bar_anchor
    bind:noVNC_control_bar_hint_left
    bind:noVNC_control_bar_hint_right
    bind:noVNC_settings
    bind:noVNC_power
    bind:noVNC_clipboard
    bind:noVNC_connect_dlg
    bind:noVNC_fingerprint
    bind:noVNC_username_block
    bind:noVNC_password_block
    bind:noVNC_password_input
    bind:noVNC_username_input
    bind:noVNC_modifiers
    bind:noVNC_bell
    bind:noVNC_setting_shared
    bind:noVNC_setting_view_only
    bind:noVNC_setting_view_clip
    bind:noVNC_setting_resize
    bind:noVNC_setting_quality
    bind:noVNC_setting_compression
    bind:noVNC_setting_repeaterID
    bind:noVNC_setting_encrypt
    bind:noVNC_setting_host
    bind:noVNC_setting_port
    bind:noVNC_setting_path
    bind:noVNC_setting_reconnect
    bind:noVNC_setting_reconnect_delay
    bind:noVNC_setting_show_dot
    bind:noVNC_setting_embedded_server
    bind:advanced_expander
    bind:websocket_expander
    bind:connection_status
    bind:clearLocalStorage
/>

<div class={`${className}`} style={style+" position: relative; overflow: hidden;"}>
    <div bind:this={noVNC_Element} style="position:{isFullscreen ? "fixed" : "absolute"}; width: 100%; height: 100%; top: 0; left: 0; touch-action: none; background-color:#494949; z-index: {isFullscreen ? "52" : "1"};">
        <div bind:this={noVNC_fallback_error} class="noVNC_center noVNC_fallback_error">
            <div>
                <div>noVNC encountered an error:</div>
                <br>
                <div bind:this={noVNC_fallback_errormsg} class="noVNC_fallback_errormsg"></div>
            </div>
        </div>
    
        <!-- noVNC control bar -->
        <div bind:this={noVNC_control_bar_anchor} class="noVNC_vcenter noVNC_control_bar_anchor" style="{connection_status == "noVNC_connected" ? (noVNC_control_bar_anchor.classList.contains("noVNC_idle") ? "opacity: 0.8;" : "") : ""}">
            <div class="noVNC_control_bar" bind:this={noVNC_control_bar}>
                <div class="noVNC_control_bar_handle" bind:this={noVNC_control_bar_handle} title="Hide/Show the control bar"><div></div></div>
    
                <div class="noVNC_scroll">
    
                    <h1 class="noVNC_logo" translate="no"><span>no</span><br>VNC</h1>
        
                    <!-- Drag/Pan the viewport -->
                    <input type="image" alt="Drag" src={DragSvg}
                        bind:this={noVNC_view_drag_button} class="noVNC_button noVNC_hidden" style="{connection_status == "noVNC_connected" ? "" : "display: none;"}"
                        title="Move/Drag viewport">
        
                    <!--noVNC touch device only buttons-->
                    <div style="{connection_status != "noVNC_connected" && isTouchDevice() ? "" : "display: none;"}">
                        <input type="image" alt="Keyboard" src={KeyboardSvg}
                            bind:this={noVNC_keyboard_button} class="noVNC_button" title="Show keyboard">
                    </div>
        
                    <!-- Extra manual keys -->
                    <input type="image" alt="Extra keys" src={ToggleExtraKeys}
                        bind:this={noVNC_toggle_extra_keys_button} class="noVNC_button" style="{connection_status == "noVNC_connected" ? "" : "display: none;"}"
                        title="Show extra keys">
                    <div class="noVNC_center">
                        <div bind:this={noVNC_modifiers} class="noVNC_panel_key noVNC_modifiers">
                            <input type="image" alt="Ctrl" src={CtrlSvg}
                                bind:this={noVNC_toggle_ctrl_button} class="noVNC_inner_button"
                                title="Toggle Ctrl">
                            <input type="image" alt="Alt" src={AltSvg}
                                bind:this={noVNC_toggle_alt_button} class="noVNC_inner_button"
                                title="Toggle Alt">
                            <input type="image" alt="Windows" src={WindowsSvg}
                                bind:this={noVNC_toggle_windows_button} class="noVNC_inner_button"
                                title="Toggle Windows">
                            <input type="image" alt="Tab" src={TabSvg}
                                bind:this={noVNC_send_tab_button} class="noVNC_inner_button"
                                title="Send Tab">
                            <input type="image" alt="Esc" src={EscSvg}
                                bind:this={noVNC_send_esc_button} class="noVNC_inner_button"
                                title="Send Escape">
                            <input type="image" alt="Ctrl+Alt+Del" src={CtrlAltDelSvg}
                                bind:this={noVNC_send_ctrl_alt_del_button} class="noVNC_inner_button"
                                title="Send Ctrl-Alt-Del">
                        </div>
                    </div>
    
                <!-- Shutdown/Reboot -->
                <input type="image" alt="Shutdown/Reboot" src={PowerSvg}
                    bind:this={noVNC_power_button} class="noVNC_button" style="{connection_status == "noVNC_connected" ? "" : "display: none;"}"
                    title="Shutdown/Reboot...">
                <div class="noVNC_vcenter">
                <div bind:this={noVNC_power} class="noVNC_panel noVNC_power">
                    <div class="noVNC_heading">
                        <img alt="" src={PowerSvg}> Power
                    </div>
                    <input type="button" bind:this={noVNC_shutdown_button} value="Shutdown">
                    <input type="button" bind:this={noVNC_reboot_button} value="Reboot">
                    <input type="button" bind:this={noVNC_reset_button} value="Reset">
                </div>
                </div>
    
                <!-- Clipboard -->
                <input type="image" alt="Clipboard" src={ClipBoardSvg}
                    bind:this={noVNC_clipboard_button} class="noVNC_button" style="{connection_status == "noVNC_connected" ? "" : "display: none;"}"
                    title="Clipboard">
    
                <!-- Toggle fullscreen -->
                <button on:click={()=>{
                    isFullscreen = !isFullscreen
                    fullscreen(isFullscreen)
                }} aria-label="Full screen"
                    bind:this={noVNC_fullscreen_button} class="noVNC_button noVNC_hidden"
                    title="Full screen">
                    <!-- svelte-ignore a11y_img_redundant_alt -->
                    <img alt="Fullscreen Button Image" src={FullScreenSvg}/>
                </button>
    
                <!-- Settings -->
                <input type="image" alt="Settings" src={SettingsSvg}
                    bind:this={noVNC_settings_button} class="noVNC_button"
                    title="Settings">
                <div class="noVNC_vcenter">
                </div>
    
                <!-- Connection controls -->
                <input type="image" alt="Disconnect" src={DisconnectSvg}
                    bind:this={noVNC_disconnect_button} class="noVNC_button" style="{connection_status == "noVNC_connected" ? "" : "display: none;"}"
                    title="Disconnect">
    
                </div>
            </div>
            <div bind:this={noVNC_settings} class="noVNC_panel noVNC_settings">
                <div class="noVNC_heading">
                    <img alt="" src={SettingsSvg}> Settings
                </div>
                <ul>
                    <li>
                        <label>
                            <input bind:this={noVNC_setting_shared} type="checkbox"
                                   class="toggle">
                            Shared mode
                        </label>
                    </li>
                    <li>
                        <label>
                            <input bind:this={noVNC_setting_view_only} type="checkbox"
                                   class="toggle">
                            View only
                        </label>
                    </li>
                    <li><hr></li>
                    <li>
                        <label>
                            <input bind:this={noVNC_setting_view_clip} type="checkbox"
                                   class="toggle">
                            Clip to window
                        </label>
                    </li>
                    <li>
                        <label for="noVNC_setting_resize">Scaling mode:</label>
                        <select bind:this={noVNC_setting_resize} name="vncResize">
                            <option value="off">None</option>
                            <option value="scale">Local scaling</option>
                            <option value="remote">Remote resizing</option>
                        </select>
                    </li>
                    <li><hr></li>
                    <li>
                        <div class="noVNC_expander" bind:this={advanced_expander}>Advanced</div>
                        <div><ul>
                            <li>
                                <label for="noVNC_setting_quality">Quality:</label>
                                <input bind:this={noVNC_setting_quality} type="range" min="0" max="9" value="6">
                            </li>
                            <li>
                                <label for="noVNC_setting_compression">Compression level:</label>
                                <input bind:this={noVNC_setting_compression} type="range" min="0" max="9" value="2">
                            </li>
                            <li>
                                <label>Brightness:</label>
                                <input bind:value={brightness} type="range" min="0" max="200">
                            </li>
                            <li><hr></li>
                            <li>
                                <label for="noVNC_setting_repeaterID">Repeater ID:</label>
                                <input bind:this={noVNC_setting_repeaterID} type="text" value="">
                            </li>
                            <li>
                                <div class="noVNC_expander" bind:this={websocket_expander} >WebSocket</div>
                                <div><ul>
                                    <li>
                                        <label>
                                            <input bind:this={noVNC_setting_encrypt} type="checkbox"
                                                   class="toggle">
                                            Encrypt
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input bind:this={noVNC_setting_embedded_server} bind:checked={noVNC_toggle_embedded}  type="checkbox"
                                                   class="toggle">
                                            Embedded Server
                                        </label>
                                    </li>
                                    <li>
                                        <label for="noVNC_setting_host">Host:</label>
                                        <input bind:this={noVNC_setting_host}>
                                    </li>
                                    <li>
                                        <label for="noVNC_setting_port">Port:</label>
                                        <input class="noVNC_setting_port" bind:this={noVNC_setting_port} type="number">
                                    </li>
                                    <li>
                                        <label for="noVNC_setting_path">Path:</label>
                                        <input class="noVNC_setting_path" bind:this={noVNC_setting_path} type="text" value="websockify">
                                    </li>
                                </ul></div>
                            </li>
                            <li><hr></li>
                            <li>
                                <label>
                                    <input bind:this={noVNC_setting_reconnect} type="checkbox"
                                           class="toggle">
                                    Automatic reconnect
                                </label>
                            </li>
                            <li>
                                <label for="noVNC_setting_reconnect_delay">Reconnect delay (ms):</label>
                                <input bind:this={noVNC_setting_reconnect_delay} type="number">
                            </li>
                            <li><hr></li>
                            <li>
                                <label>
                                    <input bind:this={noVNC_setting_show_dot} type="checkbox"
                                           class="toggle">
                                    Show dot when no cursor
                                </label>
                            </li>
                            <li><hr></li>
                            <!-- Logging selection dropdown -->
                            <li>
                                <label>Logging:
                                    <select bind:this={noVNC_setting_logging} name="vncLogging">
                                    </select>
                                </label>
                            </li>
                        </ul></div>
                    </li>
                    <li class="noVNC_version_separator"><hr></li>
                    <li class="noVNC_version_wrapper">
                        <span>Version:</span>
                        <span class="noVNC_version">Custom 1.6.0</span>
                    </li>
                </ul>
            </div>
            <div class="noVNC_vcenter">
                <div bind:this={noVNC_clipboard} class="noVNC_panel_clipboard">
                    <div class="noVNC_heading">
                        <img alt="" src={ClipBoardSvg}> Clipboard
                    </div>
                    <p class="noVNC_subheading">
                        Edit clipboard content in the textarea below.
                    </p>
                    <textarea class="noVNC_clipboard_text" bind:this={noVNC_clipboard_text} rows=5></textarea>
                </div>
            </div>
        </div> <!-- End of noVNC_control_bar -->

        <div class="noVNC_vcenter noVNC_hint_anchor left">
            <div class="noVNC_control_bar_hint left" bind:this={noVNC_control_bar_hint_left}>
            </div>
        </div>

        <div class="noVNC_vcenter noVNC_hint_anchor">
            <div class="noVNC_control_bar_hint" bind:this={noVNC_control_bar_hint_right}>
            </div>
        </div>
    
        <!-- Status dialog -->
        <div bind:this={noVNC_status} class="noVNC_status"></div>
    
        <!-- Connect button -->
        <div class="noVNC_center">
            <div class="noVNC_connect_dlg" bind:this={noVNC_connect_dlg}>
                <p class="noVNC_logo" translate="no"><span>no</span>VNC</p>
                <div>
                    <button class="noVNC_connect_button" bind:this={noVNC_connect_button}>
                        <img alt="" src={ConnectSvg}> Connect
                    </button>
                </div>
            </div>
        </div>
    
        <!-- Server key verification dialog -->
        <div class="noVNC_center noVNC_connect_layer">
        <div bind:this={noVNC_verify_server_dlg} class="noVNC_panel noVNC_verify_server_dlg"><form>
            <div class="noVNC_heading">
                Server identity
            </div>
            <div>
                The server has provided the following identifying information:
            </div>
            <div class="noVNC_fingerprint_block">
                Fingerprint:
                <span bind:this={noVNC_fingerprint}></span>
            </div>
            <div>
                Please verify that the information is correct and press
                "Approve". Otherwise press "Reject".
            </div>
            <div class="button_row">
                <input bind:this={noVNC_approve_server_button} type="submit" value="Approve">
                <input bind:this={noVNC_reject_server_button} type="button" value="Reject">
            </div>
        </form></div>
        </div>
    
        <!-- Password dialog -->
        <div class="noVNC_center noVNC_connect_layer">
        <div bind:this={noVNC_credentials_dlg} class="noVNC_credentials noVNC_credentials_dlg"><form>
            <div class="noVNC_heading">
                Credentials
            </div>
            <div class="noVNC_username_block" bind:this={noVNC_username_block}>
                <label for="noVNC_username_input">Username:</label>
                <input bind:this={noVNC_username_input}>
            </div>
            <div class="noVNC_password_block" bind:this={noVNC_password_block}>
                <label for="noVNC_password_input">Password:</label>
                <input bind:this={noVNC_password_input} type="password">
            </div>
            <div class="button_row">
                <input bind:this={noVNC_credentials_button} type="submit" value="Send credentials">
            </div>
        </form></div>
        </div>
    

        <!-- Transition screens -->
        <div class="noVNC_transition" style="{connection_status == "noVNC_loading" || connection_status == "noVNC_connecting" || connection_status == "noVNC_disconnecting" || connection_status == "noVNC_reconnecting" ? "opacity: 1; visibility: visible;" : "visibility: hidden;"}">
            <div class="noVNC_transition_text" bind:this={noVNC_transition_text}></div>
            <div>
            <input type="button" bind:this={noVNC_cancel_reconnect_button} value="Cancel" style="{connection_status == "noVNC_reconnecting" ? "" : "display: none;"}">
            </div>
            <div class="noVNC_spinner"></div>
        </div>
    
        <!-- This is where the RFB elements will attach -->
        <div bind:this={noVNC_container} class="noVNC_container" style="{connection_status == 'noVNC_connected' ? `filter: brightness(${brightness}%)` : ""}">
            <!-- Note that Google Chrome on Android doesn't respect any of these,
                 html attributes which attempt to disable text suggestions on the
                 on-screen keyboard. Let's hope Chrome implements the ime-mode
                 style for example -->
            <textarea class="noVNC_keyboardinput" bind:this={noVNC_keyboardinput} autocapitalize="off"
                autocomplete="off" spellcheck="false" tabindex="-1"></textarea>
        </div>
    
        <audio class="noVNC_bell" bind:this={noVNC_bell}>
            <source src={BellOga} type="audio/ogg">
            <source src={BellMp3} type="audio/mpeg">
        </audio>   
    </div>
</div>
