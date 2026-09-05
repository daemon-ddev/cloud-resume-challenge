# Cloud/DevOps Build Runbook

A reusable, step-by-step record of how the backend/infra/CI-CD side of
this project was actually built, generalized so it can be followed for a
*different* future product too — swap in your own names wherever you see
`<placeholders>`. Frontend styling/content work is skipped here since
that's product-specific and won't transfer; everything below is the part
that does.

---

## Phase 1 — Azure CLI install & login

```bash
brew install azure-cli
az login
```

If you see "No subscriptions found," a login can succeed while the
account still has zero subscriptions attached (a subscription is the
billing container everything else lives inside). Fix: sign up for a free
Azure account at azure.microsoft.com/free with the same login, then:

```bash
az login                 # retry after the subscription exists
az account show          # confirms a real subscription is attached
```

---

## Phase 2 — Provision infrastructure from IaC (Bicep/Terraform)

```bash
az group create --name <your-resource-group> --location <region>

az deployment group create \
  --resource-group <your-resource-group> \
  --template-file infra/main.bicep \
  --parameters namePrefix=<your-prefix>
```

**Always validate before applying:**
```bash
az bicep build --file infra/main.bicep                  # syntax check
az deployment group validate \                           # dry run against the real resource group
  --resource-group <your-resource-group> \
  --template-file infra/main.bicep \
  --parameters namePrefix=<your-prefix>
```

Things that went wrong here, worth expecting next time too:
- **Region capacity rejection**: `RequestDisallowedByAzure — the selected
  region is currently not accepting new customers`. New subscriptions can
  get blocked from specific regions. Fix: override the region param on
  the CLI call rather than editing the file's default, e.g.
  `staticWebAppLocation=eastus2`.
- **Service isn't available in every region**: some Azure services (e.g.
  Static Web Apps) only run in a short list of regions — check before
  assuming your usual region works for a *new* service type.

---

## Phase 3 — Wire up CI/CD and do the first real deploy

```bash
# Get whatever deployment credential the hosting service needs
az staticwebapp secrets list \
  --name <app-name> --resource-group <your-resource-group> \
  --query "properties.apiKey" -o tsv

# Store it as a GitHub Actions secret — never commit this
gh secret set <SECRET_NAME> \
  --repo <owner>/<repo> \
  --body "<paste the token>"
```

If `main` doesn't exist on GitHub yet (or your local `main` is checked out
in a different worktree so you can't touch it directly), push your working
branch straight to the remote `main` ref without touching local `main`:

```bash
git push origin <your-branch>:main
```

Watch the workflow the push triggers, then verify it's actually live —
not just "the job said success":

```bash
gh run list --repo <owner>/<repo> --limit 1
gh run watch <run-id> --repo <owner>/<repo> --exit-status

curl -s -o /dev/null -w "%{http_code}\n" https://<your-live-url>/
curl -s https://<your-live-url>/api/<some-endpoint>
```

---

## Phase 4 — Confirm no secrets leaked into git

Do this once real infra exists and again before any public release:

```bash
git ls-files | grep -iE "local\.settings\.json$|\.env$"    # confirm none tracked
git grep -inE "AccountKey=|DefaultEndpointsProtocol="        # only an IaC *expression* should match, never a literal key
git log --all -p | grep -inE "AccountKey=[A-Za-z0-9+/]{20}"  # scan full history for a real key
```
A real secret referenced correctly in Bicep/Terraform looks like a
function call (`storageAccount.listKeys().keys[0].value`), resolved by
the cloud provider at deploy time — never a literal string in source.

---

## Phase 5 — Write it like production, not a demo

Two things worth doing on *any* backend, however small:

1. **Handle concurrency properly** if multiple requests can touch the same
   data — don't assume read-then-write is safe. Use optimistic
   concurrency (ETags / version columns) with retry-on-conflict instead.
2. **Test the failure/race case, not just the happy path** — write a test
   that actually simulates two concurrent writers, not just "does it
   return the right value once."

```bash
npm test           # confirm before shipping, every time
```

---

## Phase 6 — Make CI actually gate deploys

Add a real test step to your deploy workflow *before* the deploy step
(e.g. `actions/setup-node@v4` + `npm ci` + `npm test`), so a failing test
blocks the deploy instead of shipping broken code. Then set the branch
protection rule requiring that check:

```bash
gh api repos/<owner>/<repo>/branches/main/protection \
  -X PUT -H "Accept: application/vnd.github+json" --input - <<'EOF'
{
  "required_status_checks": { "strict": true, "contexts": ["<job-name-from-workflow>"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```
`enforce_admins: false` means the repo owner can still push directly
(shows as "Bypassed rule violations" in the push output) — collaborators
without admin rights are actually blocked until the check passes.

Also worth doing once CI/CD is live: set the real default branch and
delete throwaway branches once merged:

```bash
gh repo edit <owner>/<repo> --default-branch main
git push origin --delete <old-branch>
```

---

## Phase 7 — Host large/user-specific assets outside the repo

If a file (photo, generated image, PDF, anything not source code) needs
to be public on the live product but shouldn't be committed to git, use
cloud object storage instead:

```bash
# Check + enable public access on the storage account — a security-relevant
# setting change, do it deliberately, not as a default
az storage account show --name <account> --resource-group <your-resource-group> \
  --query "allowBlobPublicAccess"
az storage account update --name <account> --resource-group <your-resource-group> \
  --allow-blob-public-access true

# Create a public container
az storage container create --name <container> --account-name <account> \
  --public-access blob --auth-mode login

# Upload (auth-mode key if you don't have an RBAC role assigned for blob data)
az storage blob upload \
  --account-name <account> --container-name <container> \
  --name <file> --file <local-path> \
  --auth-mode key --overwrite
```
Then reference the resulting `https://<account>.blob.core.windows.net/<container>/<file>`
URL directly — no file added to the repo.

**If this asset store should be reproducible from scratch next time**, add
it to your IaC template too (don't leave it as a one-off manual CLI step) —
a `blobServices` + `containers` resource, plus `allowBlobPublicAccess: true`
on the storage account itself, then re-run validate/apply to confirm it's
idempotent against what's already live.

---

## Phase 8 — Repo hygiene

```bash
gh repo edit <owner>/<repo> \
  --description "..." \
  --homepage "https://<your-live-url>" \
  --add-topic <relevant> --add-topic <tags>
```

Search before renaming anything, to separate "just wording" from "actual
technical identifiers that are a much bigger change to touch":

```bash
git grep -ni "<old-term>" -- .
```
Update display text (README, titles, UI copy) but leave resource group
names, storage account names, and repo URLs alone unless you deliberately
intend to migrate/rename infrastructure — those are live identifiers, not
copy.

---

## Phase 9 — Rewriting git history safely (if it's ever needed)

Rewriting shared history is genuinely destructive — never do it in a
working checkout. Clone fresh, do it there, verify before pushing:

```bash
git clone <repo-url> /tmp/rewrite-clone
cd /tmp/rewrite-clone
brew install git-filter-repo

git filter-repo --force --message-callback '
import re
message = re.sub(rb"<pattern-to-remove>", b"", message)
return message.rstrip(b"\n") + b"\n"
'

git remote add origin <repo-url>          # filter-repo removes it as a safety measure
git fetch origin main
git diff HEAD origin/main --stat          # should be EMPTY — confirms only messages changed, not file content
```

Branch protection blocks force-pushes by default — relax it, use it
immediately, restore it:

```bash
# 1. temporarily allow force pushes (same protection PUT as Phase 6, add "allow_force_pushes": true)
# 2. push
git push origin HEAD:main --force
# 3. restore protection ("allow_force_pushes": false)
```

Every existing local checkout is now behind the rewritten remote and needs
resyncing — this applies any time remote history diverges from a local
branch, not just after a rewrite:

```bash
git fetch origin
git reset --hard origin/main
```

Verify from a completely independent fresh clone, not the one you just
used, that the remote is actually clean:

```bash
git clone <repo-url> /tmp/verify-clone
```

---

## Recurring patterns worth remembering, project-agnostic

- **Validate before applying**: `az deployment group validate` /
  `az bicep build` (or `terraform plan`) before `apply`/`create`, every time.
- **Fresh clone for anything destructive to history**: clone fresh, do the
  risky thing there, diff against the original to confirm nothing but
  intent changed, then push.
- **`--force` needs to be earned, not assumed**: treat "temporarily
  disable a protection" as a deliberate three-step process (relax → do
  the one thing → restore), not a standing setting.
- **Verify from *outside* your own working copy**: after a risky change,
  clone/curl fresh rather than trusting your local state matches what's
  actually live.
- **Multiple worktrees/checkouts share one remote**: a push doesn't
  update a *different* local checkout's branch pointer — each one needs
  its own `git fetch && git reset --hard origin/main` after a
  shared-history change.
- **Concurrency and testing aren't extras** — even a "toy" backend should
  handle simultaneous writes correctly and have a test that proves it.
- **IaC should describe everything that's actually live** — if you find
  yourself doing a manual CLI step to create something permanent, that's
  a sign it belongs in the template, not a one-off command.
