# My Work Checklist (What I Need to Do)

Use this file for your own steps. The recruiter sees **README.md** only.

---

## 1. Git and GitHub

- [ ] `git init` (if not done)
- [ ] Ensure `.gitignore` has `node_modules` and `dist`
- [ ] Make **meaningful commits** (not one big push). Example:

```bash
git add src/context/ src/componets/login.tsx src/componets/ProtectedRoute.tsx src/App.tsx src/main.tsx package.json index.html vite.config.* tsconfig.* .gitignore
git commit -m "Add auth: login, AuthProvider, protected routes"

git add src/componets/ListPage.tsx src/componets/employeeApi.ts
git commit -m "Add list page: API fetch, custom virtualization"

git add src/componets/DetailsPage.tsx
git commit -m "Add details page: camera, signature, merge"

git add src/componets/AnalyticsPage.tsx src/App.tsx
git commit -m "Add analytics: audit image, SVG chart, city map"

git add README.md
git commit -m "Add README: docs for evaluator"
```

- [ ] Create repo on GitHub, add `origin`, push
- [ ] **Put the repo URL in README.md** in the "Deliverables" section

---

## 2. Screen Recording

- [ ] **Walkthrough:** Login → List → Details (one row) → Start Camera → Capture → Sign on photo → Merge and Continue → Analytics (show audit image, chart, map)
- [ ] **Explainer (max 60 seconds):**
  - **Image merging:** `DetailsPage` → `mergeAndContinue` → offscreen canvas → draw photo then signature → `toDataURL('image/png')`
  - **Scroll offset:** `ListPage` → `scrollTop` / `containerHeight` → `startIndex` / `endIndex` → `translateY(startIndex × ROW_HEIGHT)` → only a slice of rows in DOM
- [ ] Upload video and get link
- [ ] **Put the video URL in README.md** in the "Deliverables" section (if required)

---

## 3. Before Submitting

- [ ] README.md has **GitHub repo link** and **video link** (if instructor wants it in README)
- [ ] Multiple commits pushed (no single large push)
- [ ] Submit repo link (and video link) as instructor asked (form, LMS, etc.)
