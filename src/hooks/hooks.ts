import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
const fs = require("fs-extra");

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
});

Before({ tags: "not @auth" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
});


After(async function ({ pickle, result }) {
    let videoPath: string;
    let img: Buffer;
    const path = `./test-results/trace/${pickle.id}.zip`;
    
    if (result?.status == Status.FAILED) {
        try {
            if (fixture.page) {
                img = await fixture.page.screenshot(
                    { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
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
    
    try {
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');
    } catch (error) {
        console.log("Trace file attachment failed:", error);
    }
});

AfterAll(async function () {
    await browser.close();
})