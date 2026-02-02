import { LaunchOptions, chromium, firefox, webkit } from "@playwright/test";

export const invokeBrowser = () => {
    const browserType = process.env.BROWSER || "chrome";
    const headless = process.env.HEAD === "true" || process.env.HEAD === undefined;
    
    const options: LaunchOptions = {
        headless: headless
    };
    
    switch (browserType) {
        case "chrome":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error("Please set the proper browser!")
    }
}