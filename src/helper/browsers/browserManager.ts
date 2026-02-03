import { LaunchOptions, chromium, firefox, webkit } from "@playwright/test";

export const invokeBrowser = () => {
    // Get browser type from environment variable, default to chrome
    const browserType = process.env.BROWSER || "chrome";
    
    // Determine headless mode: true if HEAD is "true" or undefined (defaults to headless for CI)
    const headless = process.env.HEAD === "true" || process.env.HEAD === undefined;
    
    // Configure browser launch options
    const options: LaunchOptions = {
        headless: headless
    };
    
    // Launch the appropriate browser based on configuration
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