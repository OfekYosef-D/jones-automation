# Jones automation exercise

Requires Node.js 20+.

```bash
npm ci
npx playwright install chromium
npm start
```

`npm start` opens https://test.netlify.app/, fills Name, Email, Phone, Company, and Website, sets Number of Employees to 51-500, saves `screenshots/before-request-callback.png`, clicks **Request a call back**, and logs the thank-you page URL.

To watch the browser: `node automation.js --headed`

Written answers for the billing widget are in `ANSWERS.md`.
