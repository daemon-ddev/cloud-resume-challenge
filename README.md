# Cloud Resume Challenge

A personal portfolio site built to apply what I learned studying for the
Microsoft AZ-900 (Azure Fundamentals) certification — deployed on real
Azure infrastructure, not just described in a document.

**Live site:** https://yellow-wave-045f3af0f.3.azurestaticapps.net

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
