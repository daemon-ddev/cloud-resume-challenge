# Cloud CV Challenge

A personal portfolio and Cloud CV Challenge site — deployed on real
Azure infrastructure, not just described in a document.

**Live site:** https://yellow-wave-045f3af0f.3.azurestaticapps.net

## What this is

- A React single-page site: Hero, About (with a Skills list), My Journey,
  Where I'm Headed (a roadmap of skills toward an MLOps career), Projects,
  and a Footer with the visitor counter and social links
- A serverless visitor counter: an Azure Function backed by Azure Table
  Storage, called from the frontend on every page load, using ETag-based
  optimistic concurrency so concurrent visits don't clobber each other's
  increment
- Infrastructure defined in Bicep (`infra/main.bicep`) — the Storage
  Account, Table, and Static Web App are all provisioned from code
- CI/CD via GitHub Actions — every push to `main` runs the API test suite
  and then rebuilds and redeploys automatically; `main` is protected so
  that check must pass before a pull request can merge
- Open Graph / Twitter meta tags with a generated preview image, so
  sharing the link renders a proper card instead of a blank preview

## Architecture

```
Browser → React app (Azure Static Web Apps)
              │
              └── GET /api/counter → Azure Function (Node.js)
                                          │
                                          └── Azure Table Storage (VisitorCounter table)
```

Profile photo and social-preview image are hosted in a public Blob
Storage container (`assets`) on the same Storage Account, rather than
committed to the repo.

## How this maps to Azure Fundamentals

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
5. Upload your own profile/preview images to the `assets` blob container
   (created automatically by the Bicep template) and update the image
   URLs in `frontend/src/components/Hero.jsx` and `frontend/index.html`
   to point at them
6. Push to `main` — GitHub Actions runs the API tests and deploys
   automatically
