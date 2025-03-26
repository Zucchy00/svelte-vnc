<script lang="ts">
    import "./app/styles/constants.css"
    import "./app/styles/input.css"
    import "./app/styles/base.css"
	import { onMount } from "svelte";
	import Uivnc from "./UIvnc.svelte";

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

    // CONNECTION STATUS
    let connection_status:string = ""

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
    let noVNC_control_bar_hint:any
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
    let advanced_expander:any
    let websocket_expander:any

    // SETTINGS LIST
    let settings = {
        logging, host, port, encrypt, password, autoconnect, view_clip,
        quality, compression, shared, bell, view_only, show_dot, path,
        repeaterID, reconnect, reconnect_delay, controlbar_pos, resize
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
        let response;

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
    bind:noVNC_control_bar_hint
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
    bind:advanced_expander
    bind:websocket_expander
    bind:connection_status
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

        <div class="noVNC_vcenter noVNC_hint_anchor">
            <div class="noVNC_control_bar_hint" bind:this={noVNC_control_bar_hint}>
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
        <div bind:this={noVNC_container} class="noVNC_container">
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
