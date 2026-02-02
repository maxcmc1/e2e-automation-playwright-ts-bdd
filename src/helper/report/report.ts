const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "test-results",
  reportPath: "test-results/reports/",
  reportName: "Playwright Automation Report",
  pageTitle: "Orange HRM Test Report",
  displayDuration: true,
  metadata: {
    browser: {
      name: "chrome",
      version: "145",
    },
    device: "Local test machine",
    platform: {
      name: "Windows",
      version: "11",
    },
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Orange HRM" },
      { label: "Release", value: "1.2.3" },
      { label: "Cycle", value: "Regerssion" }
    ],
  },
});