// index.d.ts
declare module 'svelte-vnc' {
    import type { Component } from 'svelte';
  
    // Declare the component with typed props (without extending Component)
    export const NoVNC: Component<{
      isFullscreen?: boolean;
      class?: string;
      style?: string;
      logging?: boolean | null;
      host?: string | null;
      port?: string | null;
      encrypt?: boolean | null;
      password?: string | null;
      autoconnect?: boolean | null;
      view_clip?: boolean | null;
      quality?: number | null;
      compression?: number | null;
      shared?: boolean | null;
      bell?: boolean | null;
      view_only?: boolean | null;
      show_dot?: boolean | null;
      path?: string | null;
      repeaterID?: string | null;
      reconnect?: boolean | null;
      reconnect_delay?: number | null;
      controlbar_pos?: string | null;
      clearLocalStorage?: boolean | null;
      resize?: string | null;
      embedded_server?: boolean | null;
    }>;
  }
  