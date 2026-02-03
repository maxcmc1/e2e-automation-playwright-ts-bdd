import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
const fs = require("fs-extra");

let browser: Browser;
let context: BrowserContext;

/**
 * BeforeAll Hook: Runs once before all scenarios
 * Initializes environment variables and launches the browser instance
 */
BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
});

/**
 * Before Hook: Runs before each scenario (except those tagged with @auth)
 * Creates a new browser context with video recording and tracing enabled
 * 
 * @param {Object} pickle - Cucumber scenario metadata (name, id, etc.)
 */
Before({ tags: "not @auth" }, async function ({ pickle }) {
    // Create unique scenario identifier for trace files
    const scenarioName = pickle.name + pickle.id;
    
    // Create new browser context with video recording enabled
    context = await browser.newContext({
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    
    // Start Playwright tracing for debugging (captures network, DOM, console logs)
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true
    });
    
    // Create new page and assign to fixture for step definitions to use
    const page = await context.newPage();
    fixture.page = page;
});


After(async function ({ pickle, result }) {
    let videoPath: string;
    let img: Buffer;
    const path = `./test-results/trace/${pickle.id}.zip`;
    
    // Capture screenshot if scenario failed
    if (result?.status == Status.FAILED) {
        try {
            if (fixture.page) {
                img = await fixture.page.screenshot(
                    { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
                // Attach screenshot to Cucumber report
                await this.attach(img, "image/png");
            }
        } catch (error) {
            console.log("Screenshot capture failed:", error);
        }
    }
    
    videoPath = await fixture.page.video()?.path();
    
    await context.tracing.stop({ path: path });
    await fixture.page.close();
    await context.close();
    
    // Attach video to Cucumber report if available
    if (videoPath) {
        try {
            await this.attach(
                fs.readFileSync(videoPath),
                'video/webm'
            );
        } catch (error) {
            console.log("Video attachment failed:", error);
        }
    }
    
    // Attach trace file link to Cucumber report
    try {
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`;
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');
    } catch (error) {
        console.log("Trace file attachment failed:", error);
    }
});

AfterAll(async function () {
    await browser.close();
})