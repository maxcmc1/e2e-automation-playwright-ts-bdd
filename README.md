# E2E Automation Framework - Playwright TypeScript BDD

End-to-end automation testing framework using Playwright, TypeScript, and Cucumber BDD.

## Prerequisites

- Node.js >= 20.0.0
- npm

## Installation

```bash
npm install
npx playwright install --with-deps chromium
```

## Environment Setup

Create `.env` file in `src/helper/env/` directory:

```env
BASEURL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
BROWSER=chrome
HEAD=false
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific feature
```bash
npm run test:pim
```

### Run failed tests only
```bash
npm run test:failed
```

### Run with specific tag
```bash
npm run test:invalid-login
```

## Test Reports

After test execution, reports are generated in:
- **HTML Report**: `test-results/reports/index.html`
- **Videos**: `test-results/videos/`
- **Screenshots**: `test-results/screenshots/` (on failure only)
- **Traces**: `test-results/trace/`

## Project Structure

```
src/
├── helper/          # Utilities, wrappers, test data
├── hooks/          # Cucumber hooks (setup/teardown)
├── pages/          # Page Object Model classes
└── test/
    ├── features/   # Cucumber feature files
    └── steps/      # Step definitions
```

## CI

GitHub Actions workflow automatically:
- Runs all tests on push/PR
- Retries failed scenarios once
- Generates and uploads reports, videos, and test results as artifacts

## Test Scenarios

- **Login Feature**: Authentication scenarios (2 scenarios)
- **PIM Feature**: Employee management scenarios (2 scenarios)
