/// <reference types="vite-plus/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*?url" {
    const result: string;
    export default result;
}
