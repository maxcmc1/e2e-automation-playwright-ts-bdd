export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit",
            BASEURL: string,
            HEAD: "true" | "false"
        }
    }
}