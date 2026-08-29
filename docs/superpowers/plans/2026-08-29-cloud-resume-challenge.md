# Cloud Resume Challenge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page React portfolio/resume site with a live serverless visitor counter, hosted on Azure Static Web Apps, provisioned via Bicep, and auto-deployed via GitHub Actions.

**Architecture:** A React (Vite) frontend calls one Azure Function (`/api/counter`) that reads/increments a count stored in Azure Table Storage. Static Web Apps hosts both the frontend and the Function together. Infrastructure (Storage Account, Table, Static Web App) is defined in Bicep and provisioned via the Azure CLI; deployment happens automatically on every push to `main` via GitHub Actions.

**Tech Stack:** React 18 + Vite, Azure Functions v4 (Node.js), @azure/data-tables, Jest, Bicep, GitHub Actions, Azure Static Web Apps (Free tier).

---

## File Structure

```
frontend/
  index.html
  package.json
  vite.config.js
  public/
    staticwebapp.config.json
  src/
    main.jsx
    App.jsx
    App.css
    components/
      Hero.jsx
      About.jsx
      Certifications.jsx
      Journey.jsx
      Projects.jsx
      Footer.jsx

api/
  package.json
  host.json
  local.settings.json.example
  src/
    counterStore.js
    functions/
      counter.js
  test/
    counterStore.test.js

infra/
  main.bicep

.github/
  workflows/
    deploy.yml

README.md
.gitignore (already created)
```

Each React component owns exactly one section of the page. `counterStore.js` is separated from `functions/counter.js` specifically so the counting logic can be unit-tested without spinning up the Azure Functions runtime.

---

### Task 1: Scaffold the frontend with Vite

**Files:**
- Create: `frontend/` (via Vite scaffold)

- [ ] **Step 1: Scaffold the project**

Run: `npm create vite@latest frontend -- --template react`
Expected: creates `frontend/` with a working React + Vite starter.

- [ ] **Step 2: Install dependencies**

Run: `cd frontend && npm install`
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Confirm the starter runs**

Run: `npm run dev` (from `frontend/`), then open the printed local URL in a browser.
Expected: default Vite + React starter page loads. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 4: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure "
git add frontend
git commit -m "Scaffold frontend with Vite + React"
```

---

### Task 2: Azure Blue theme

**Files:**
- Modify: `frontend/src/App.css` (replace entire contents)
- Modify: `frontend/src/index.css` (replace entire contents)

- [ ] **Step 1: Replace `frontend/src/index.css`**

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0B1F3A;
  --bg-secondary: #10294f;
  --accent: #0078D4;
  --text: #f5f7fa;
  --text-muted: #9fb3d1;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
}

a {
  color: var(--accent);
}
```

- [ ] **Step 2: Replace `frontend/src/App.css`**

```css
.nav {
  position: sticky;
  top: 0;
  display: flex;
  gap: 24px;
  padding: 16px 24px;
  background: rgba(11, 31, 58, 0.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 14px;
}

.nav a:hover {
  color: var(--text);
}

.section {
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 24px;
}

.btn {
  display: inline-block;
  background: var(--accent);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  margin-top: 12px;
}

.tagline {
  color: var(--text-muted);
  margin-top: 8px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  list-style: none;
  margin-top: 16px;
}

.skills-grid li {
  background: var(--bg-secondary);
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 14px;
}

.cert-card, .project-card {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 6px;
  margin-top: 16px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 12px;
}

.visitor-count {
  color: var(--text-muted);
  font-size: 13px;
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/App.css frontend/src/index.css && git commit -m "Add Azure Blue theme"
```

---

### Task 3: Hero component

**Files:**
- Create: `frontend/src/components/Hero.jsx`

- [ ] **Step 1: Create the component**

```jsx
function Hero() {
  return (
    <section className="section hero" id="hero">
      <h1>Your Name</h1>
      <p className="tagline">Cloud Computing Enthusiast | AZ-900 Certified</p>
      <a className="btn" href="#certifications">View Certifications</a>
    </section>
  );
}

export default Hero;
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/Hero.jsx && git commit -m "Add Hero component"
```

---

### Task 4: About + Skills component

**Files:**
- Create: `frontend/src/components/About.jsx`

- [ ] **Step 1: Create the component**

```jsx
const skills = [
  'Microsoft Azure Fundamentals (AZ-900)',
  'Cloud Concepts',
  'Azure Core Services',
  'Azure Storage',
  'Cost Management & Governance',
  'React',
  'Node.js',
  'Git & GitHub Actions',
];

function About() {
  return (
    <section className="section" id="about">
      <h2>About</h2>
      <p>
        Replace this paragraph with a short bio: who you are, what you're
        learning, and what you're aiming for next in cloud computing.
      </p>
      <h3>Skills</h3>
      <ul className="skills-grid">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default About;
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/About.jsx && git commit -m "Add About and Skills component"
```

---

### Task 5: Certifications component

**Files:**
- Create: `frontend/src/components/Certifications.jsx`

- [ ] **Step 1: Create the component**

```jsx
function Certifications() {
  return (
    <section className="section" id="certifications">
      <h2>Certifications</h2>
      <div className="cert-card">
        <h3>Microsoft Certified: Azure Fundamentals (AZ-900)</h3>
        <a
          className="btn"
          href="REPLACE_WITH_YOUR_CREDENTIAL_VERIFICATION_LINK"
          target="_blank"
          rel="noreferrer"
        >
          Verify Certificate
        </a>
      </div>
    </section>
  );
}

export default Certifications;
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/Certifications.jsx && git commit -m "Add Certifications component"
```

---

### Task 6: My AZ-900 Journey component

**Files:**
- Create: `frontend/src/components/Journey.jsx`

- [ ] **Step 1: Create the component**

```jsx
function Journey() {
  return (
    <section className="section" id="journey">
      <h2>My AZ-900 Journey</h2>
      <p>
        Replace this with your own write-up: why you started learning Azure,
        what studying for AZ-900 was like, what clicked and what didn't, and
        why you built this project. Write it in your own words — this section
        is the part of the site that's actually about you.
      </p>
    </section>
  );
}

export default Journey;
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/Journey.jsx && git commit -m "Add AZ-900 Journey component"
```

---

### Task 7: Projects component

**Files:**
- Create: `frontend/src/components/Projects.jsx`

- [ ] **Step 1: Create the component**

```jsx
const projects = [
  {
    name: 'Cloud Resume Challenge',
    description:
      'This site: a React frontend and a serverless visitor counter, deployed to Azure Static Web Apps with infrastructure defined in Bicep and CI/CD via GitHub Actions.',
    repoUrl: 'https://github.com/daemon-ddev/REPLACE_WITH_REPO_NAME',
  },
];

function Projects() {
  return (
    <section className="section" id="projects">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div className="project-card" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/Projects.jsx && git commit -m "Add Projects component"
```

---

### Task 8: Footer component with visitor counter

**Files:**
- Create: `frontend/src/components/Footer.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useEffect, useState } from 'react';

function Footer() {
  const [count, setCount] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/counter')
      .then((res) => {
        if (!res.ok) throw new Error('request failed');
        return res.json();
      })
      .then((data) => setCount(data.count))
      .catch(() => setFailed(true));
  }, []);

  return (
    <footer className="section footer">
      <div className="footer-links">
        <a href="https://github.com/daemon-ddev" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="REPLACE_WITH_YOUR_LINKEDIN_URL" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="mailto:REPLACE_WITH_YOUR_EMAIL">Email</a>
      </div>
      {!failed && (
        <p className="visitor-count">
          Visitors: {count === null ? '—' : count}
        </p>
      )}
    </footer>
  );
}

export default Footer;
```

This is the failure handling from the design spec: while the fetch is pending, `count` is `null` so it renders "—"; if the fetch fails, `failed` becomes `true` and the whole line disappears rather than showing an error.

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/Footer.jsx && git commit -m "Add Footer component with visitor counter"
```

---

### Task 9: Assemble the page

**Files:**
- Modify: `frontend/src/App.jsx` (replace entire contents)

- [ ] **Step 1: Replace `frontend/src/App.jsx`**

```jsx
import Hero from './components/Hero';
import About from './components/About';
import Certifications from './components/Certifications';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <nav className="nav">
        <a href="#about">About</a>
        <a href="#certifications">Certifications</a>
        <a href="#journey">Journey</a>
        <a href="#projects">Projects</a>
      </nav>
      <Hero />
      <About />
      <Certifications />
      <Journey />
      <Projects />
      <Footer />
    </>
  );
}

export default App;
```

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev` (from `frontend/`), open the printed URL.
Expected: all six sections render in order, nav links jump-scroll correctly, footer shows "Visitors: —" (no live API yet, so it stays on the loading dash). Stop the dev server once confirmed.

- [ ] **Step 3: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/App.jsx && git commit -m "Assemble single-page layout"
```

---

### Task 10: Scaffold the API project

**Files:**
- Create: `api/package.json`
- Create: `api/host.json`
- Create: `api/local.settings.json.example`
- Modify: `.gitignore` (append `local.settings.json`)

- [ ] **Step 1: Create `api/package.json`**

```json
{
  "name": "api",
  "version": "1.0.0",
  "private": true,
  "main": "src/functions/*.js",
  "scripts": {
    "test": "jest",
    "start": "func start"
  },
  "dependencies": {
    "@azure/functions": "^4.5.1",
    "@azure/data-tables": "^13.2.2"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

- [ ] **Step 2: Create `api/host.json`**

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

- [ ] **Step 3: Create `api/local.settings.json.example`**

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_STORAGE_CONNECTION_STRING": "<your storage account connection string, filled in after Task 16>"
  }
}
```

- [ ] **Step 4: Add `local.settings.json` to `.gitignore`**

Append this line to `.gitignore`:

```
local.settings.json
```

- [ ] **Step 5: Install dependencies**

Run: `cd api && npm install`
Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add api/package.json api/host.json api/local.settings.json.example .gitignore && git commit -m "Scaffold API project"
```

---

### Task 11: Visitor counter logic (TDD)

**Files:**
- Create: `api/test/counterStore.test.js`
- Create: `api/src/counterStore.js`

- [ ] **Step 1: Write the failing test**

Create `api/test/counterStore.test.js`:

```js
const { getAndIncrementCount } = require('../src/counterStore');

function makeFakeClient(initialCount) {
  const state = { count: initialCount };
  return {
    getEntity: jest.fn(async () => {
      if (state.count === null) {
        const err = new Error('not found');
        err.statusCode = 404;
        throw err;
      }
      return { count: state.count };
    }),
    upsertEntity: jest.fn(async (entity) => {
      state.count = entity.count;
    }),
  };
}

test('increments count from an existing value', async () => {
  const client = makeFakeClient(5);
  const result = await getAndIncrementCount(client);
  expect(result).toBe(6);
  expect(client.upsertEntity).toHaveBeenCalledWith(
    expect.objectContaining({ count: 6 })
  );
});

test('starts at 1 when no entity exists yet', async () => {
  const client = makeFakeClient(null);
  const result = await getAndIncrementCount(client);
  expect(result).toBe(1);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `cd api && npm test`
Expected: FAIL — `Cannot find module '../src/counterStore'`

- [ ] **Step 3: Write the implementation**

Create `api/src/counterStore.js`:

```js
const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'VisitorCounter';
const PARTITION_KEY = 'counter';
const ROW_KEY = 'site';

function getClient() {
  return TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    TABLE_NAME
  );
}

async function getAndIncrementCount(client = getClient()) {
  let entity;
  try {
    entity = await client.getEntity(PARTITION_KEY, ROW_KEY);
  } catch (err) {
    if (err.statusCode === 404) {
      entity = { count: 0 };
    } else {
      throw err;
    }
  }

  const newCount = entity.count + 1;
  await client.upsertEntity({
    partitionKey: PARTITION_KEY,
    rowKey: ROW_KEY,
    count: newCount,
  });

  return newCount;
}

module.exports = {
  getAndIncrementCount,
  getClient,
  TABLE_NAME,
  PARTITION_KEY,
  ROW_KEY,
};
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `cd api && npm test`
Expected: PASS — 2 passed, 2 total

- [ ] **Step 5: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add api/src/counterStore.js api/test/counterStore.test.js && git commit -m "Add visitor counter logic with tests"
```

---

### Task 12: Wire the Azure Function

**Files:**
- Create: `api/src/functions/counter.js`

- [ ] **Step 1: Create the Function**

```js
const { app } = require('@azure/functions');
const { getAndIncrementCount } = require('../counterStore');

app.http('counter', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'counter',
  handler: async () => {
    const count = await getAndIncrementCount();
    return { jsonBody: { count } };
  },
});
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add api/src/functions/counter.js && git commit -m "Wire counter Azure Function"
```

---

### Task 13: Static Web App routing config

**Files:**
- Create: `frontend/public/staticwebapp.config.json`

- [ ] **Step 1: Create the config**

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/*.{css,js,png,jpg,jpeg,svg,ico,webp}"]
  }
}
```

Vite copies everything in `public/` into `dist/` on build, so this ends up at the site root where Static Web Apps expects it.

- [ ] **Step 2: Confirm the production build includes it**

Run: `cd frontend && npm run build`
Expected: build succeeds; `frontend/dist/staticwebapp.config.json` exists.

- [ ] **Step 3: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/public/staticwebapp.config.json && git commit -m "Add Static Web Apps routing config"
```

---

### Task 14: Infrastructure as code

**Files:**
- Create: `infra/main.bicep`

- [ ] **Step 1: Create the Bicep template**

```bicep
@description('Short name prefix (max 11 chars, lowercase alphanumeric) used to build resource names')
@maxLength(11)
param namePrefix string = 'gjresume'

@description('Azure region for all resources')
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: toLower('${namePrefix}${uniqueString(resourceGroup().id)}')
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource visitorTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-01-01' = {
  parent: tableService
  name: 'VisitorCounter'
}

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${namePrefix}-site'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    AZURE_STORAGE_CONNECTION_STRING: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
  }
}

output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = staticWebApp.properties.defaultHostname
output storageAccountName string = storageAccount.name
```

This provisions the Storage Account, the `VisitorCounter` table, the Static Web App, and wires the connection string into the Static Web App's Function settings — all from one file, no manual portal configuration.

- [ ] **Step 2: Commit**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add infra/main.bicep && git commit -m "Add Bicep infrastructure template"
```

---

### Task 15: Push to GitHub

**Files:** none (repo operations only)

- [ ] **Step 1: Create the GitHub repository**

Run: `gh repo create daemon-ddev/cloud-resume-challenge --public --source="." --remote=origin`

(If `gh` isn't installed/authenticated, create an empty public repo named `cloud-resume-challenge` at github.com/daemon-ddev instead, then run: `git remote add origin https://github.com/daemon-ddev/cloud-resume-challenge.git`)

Expected: a new public repo exists at `https://github.com/daemon-ddev/cloud-resume-challenge`, and `origin` is set locally.

- [ ] **Step 2: Push**

Run: `git push -u origin main`
Expected: all commits so far appear on GitHub.

- [ ] **Step 3: Update the placeholder repo URL**

In `frontend/src/components/Projects.jsx`, change `REPLACE_WITH_REPO_NAME` to `cloud-resume-challenge` (or whatever name you actually used in Step 1).

- [ ] **Step 4: Commit and push**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components/Projects.jsx && git commit -m "Fix project repo link" && git push
```

---

### Task 16: Provision Azure infrastructure

**Files:** none (Azure CLI operations only)

- [ ] **Step 1: Log in and confirm the active subscription**

Run: `az login`
Then: `az account show`
Expected: shows the subscription you want to deploy into. If you have more than one, run `az account set --subscription "<name-or-id>"` to pick the right one.

- [ ] **Step 2: Create a resource group**

Run: `az group create --name cloud-resume-rg --location uksouth`
Expected: JSON output with `"provisioningState": "Succeeded"`.

- [ ] **Step 3: Deploy the Bicep template**

Run:
```bash
az deployment group create \
  --resource-group cloud-resume-rg \
  --template-file infra/main.bicep \
  --parameters namePrefix=gjresume
```
Expected: JSON output ending `"provisioningState": "Succeeded"`, with `staticWebAppName`, `staticWebAppUrl`, and `storageAccountName` in the outputs.

- [ ] **Step 4: Note the outputs**

Write down `staticWebAppName` and `staticWebAppUrl` from the previous step's output — they're needed in the next task and in the README.

---

### Task 17: Connect GitHub Actions to Azure

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Retrieve the deployment token**

Run:
```bash
az staticwebapp secrets list \
  --name <staticWebAppName from Task 16> \
  --resource-group cloud-resume-rg \
  --query "properties.apiKey" -o tsv
```
Expected: prints a long token string.

- [ ] **Step 2: Add it as a GitHub secret**

Run: `gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo daemon-ddev/cloud-resume-challenge --body "<token from Step 1>"`

(If `gh` isn't available: on GitHub, go to the repo's Settings → Secrets and variables → Actions → New repository secret, name it `AZURE_STATIC_WEB_APPS_API_TOKEN`, paste the token.)

Expected: secret appears under the repo's Actions secrets.

- [ ] **Step 3: Create the workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: "frontend"
          api_location: "api"
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: close
```

- [ ] **Step 4: Commit and push**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add .github/workflows/deploy.yml && git commit -m "Add GitHub Actions deployment workflow" && git push
```

Expected: pushing triggers the workflow. Check the "Actions" tab on GitHub — the `build_and_deploy` job should run and finish green.

---

### Task 18: Verify the live deployment

**Files:** none (manual verification)

- [ ] **Step 1: Open the live site**

Open `https://<staticWebAppUrl from Task 16>` in a browser.
Expected: the full page loads — Hero through Footer — with the Azure Blue theme.

- [ ] **Step 2: Confirm the counter works**

Reload the page two or three times.
Expected: the "Visitors: N" number in the footer increases by 1 on each reload (it counts every page load, not unique visitors — that's expected for this simple version).

- [ ] **Step 3: If the counter stays on "—"**

Open the browser dev tools Network tab, reload, and check the `/api/counter` request. A 500 usually means `AZURE_STORAGE_CONNECTION_STRING` didn't get set correctly — re-check the Task 16 Bicep deployment output and the Static Web App's Configuration blade in the Azure Portal.

---

### Task 19: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write the README**

```markdown
# Cloud Resume Challenge

A personal portfolio site built to apply what I learned studying for the
Microsoft AZ-900 (Azure Fundamentals) certification — deployed on real
Azure infrastructure, not just described in a document.

**Live site:** https://<staticWebAppUrl from Task 16>

## What this is

- A React single-page site (Hero, About, Certifications, my AZ-900 journey,
  Projects, Contact)
- A serverless visitor counter: an Azure Function backed by Azure Table
  Storage, called from the frontend on every page load
- Infrastructure defined in Bicep (`infra/main.bicep`) — the Storage
  Account, Table, and Static Web App are all provisioned from code
- CI/CD via GitHub Actions — every push to `main` rebuilds and redeploys
  automatically

## Architecture

```
Browser → React app (Azure Static Web Apps)
              │
              └── GET /api/counter → Azure Function (Node.js)
                                          │
                                          └── Azure Table Storage (VisitorCounter table)
```

## How this maps to AZ-900

- **Shared responsibility model** — Azure manages the Static Web Apps and
  Functions runtime/hosts; I'm responsible for my code and data.
- **Resource groups** — every resource for this project lives in one
  resource group (`cloud-resume-rg`) so it can be managed and torn down
  as a unit.
- **Storage redundancy** — the Storage Account uses locally-redundant
  storage (LRS), the cheapest tier, appropriate for non-critical data
  like a visitor count.
- **Cost management** — everything here runs on Azure's Free tier
  (Static Web Apps) or at near-zero cost (Table Storage transactions);
  no ongoing bill for a project at this scale.

## Running locally

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**API tests:**
```bash
cd api
npm install
npm test
```

## Deploying from scratch

1. `az login`
2. `az group create --name cloud-resume-rg --location uksouth`
3. `az deployment group create --resource-group cloud-resume-rg --template-file infra/main.bicep --parameters namePrefix=gjresume`
4. Add the Static Web App's deployment token as a GitHub Actions secret
   named `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Push to `main` — GitHub Actions builds and deploys automatically
```

Replace `<staticWebAppUrl from Task 16>` with the real URL in both places before committing.

- [ ] **Step 2: Commit and push**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add README.md && git commit -m "Add README" && git push
```

---

### Task 20: Personalize the content

**Files:**
- Modify: `frontend/src/components/Hero.jsx` — replace `Your Name`
- Modify: `frontend/src/components/About.jsx` — replace the bio paragraph
- Modify: `frontend/src/components/Certifications.jsx` — replace `REPLACE_WITH_YOUR_CREDENTIAL_VERIFICATION_LINK` with your real Microsoft Learn/Credly verification link
- Modify: `frontend/src/components/Journey.jsx` — replace the placeholder paragraph with your own write-up
- Modify: `frontend/src/components/Footer.jsx` — replace `REPLACE_WITH_YOUR_LINKEDIN_URL` and `REPLACE_WITH_YOUR_EMAIL`
- Modify: `frontend/src/components/Projects.jsx` — replace `REPLACE_WITH_REPO_NAME` with the real repo name from Task 15
- Modify: `frontend/index.html` — replace `Your Name` in the `<title>` tag

- [ ] **Step 1: Fill in every placeholder listed above with your real details**

This content should be genuinely yours — the Journey section especially, since it's the part of the site that makes the case you understand what you built, not just that you followed a plan.

- [ ] **Step 2: Rebuild and check locally**

Run: `cd frontend && npm run dev`, review every section.

- [ ] **Step 3: Commit and push**

```bash
cd "/Users/a/Desktop/Cloud Computing/Microsoft Azure " && git add frontend/src/components && git commit -m "Personalize site content" && git push
```

Expected: GitHub Actions redeploys automatically; the live site reflects your real content within a couple of minutes.

---

## Self-Review Notes

- **Spec coverage:** repo layout (Task 1, 10), single-page scroll (Task 9), Azure Blue style (Task 2), all six sections (Tasks 3–8), counter data flow + non-blocking failure handling (Task 8, 11, 12), Table Storage choice (Task 11, 14), Static Web Apps hosting (Task 14, 16), GitHub Actions CI/CD (Task 17), Bicep IaC (Task 14), Jest tests on counter logic (Task 11), README with AZ-900 mapping (Task 19), no-AI-trace requirement (no explanatory comments added beyond the one non-obvious note in Task 8; commits in this plan carry no co-author trailer) — all covered.
- **Placeholder scan:** the `REPLACE_WITH_*` strings are intentional — they're real personal details only the user can supply, called out explicitly in Task 20, not a plan gap.
- **Type/name consistency:** `getAndIncrementCount`, `TABLE_NAME`, `PARTITION_KEY`, `ROW_KEY` are defined once in Task 11 and reused as-is in Task 12; the `/api/counter` route matches between Task 12 (Function route) and Task 8 (frontend fetch path).
