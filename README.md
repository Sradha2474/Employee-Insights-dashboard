# Employee Insights Dashboard

A 4-screen React application: Login, Employee List (with custom virtualization), Identity Verification (camera + signature overlay + merge), and Analytics (audit image, salary chart, city map). Built with **raw CSS** and **custom logic only**—no UI libraries (MUI, Bootstrap, etc.) and no virtualization libraries (react-window, react-virtualized).

---

## Project Overview

| Screen | Route | Description |
|--------|--------|-------------|
| **Login** | `/` | Username/password auth. Session in `localStorage`; protected routes redirect unauthenticated users to login. |
| **List** | `/list` | POST to the assignment API for table data. **Custom virtualization**: only viewport rows + buffer are rendered. |
| **Details** | `/details/:id` | Camera capture → profile photo → HTML5 canvas overlay for signature → merge into single image (Base64). |
| **Analytics** | `/analytics/:id` | Displays merged audit image, **raw SVG** salary-by-city chart, and **raw SVG** city map. |

---

## How to Run

```bash
npm install
npm run dev
```

**Credentials:** `testuser` / `Test123`  
**Flow:** List → **Details** on a row → Start Camera → Capture → Sign on canvas → **Merge and Continue** → Analytics.

---

## Intentional Bug (Assignment Requirement)

**What:** Minor memory leak—the media stream reference is not cleared from the ref on unmount.  
**Where:** `src/componets/DetailsPage.tsx`, in the `useEffect` cleanup (unmount). We stop tracks with `getTracks().forEach(track => track.stop())` but **do not** set `streamRef.current = null`.  
**Why:** Intentionally left to satisfy the single-documented-vulnerability requirement. Camera stops correctly; one stream reference is retained until the next camera start.

---

## Virtualization Math (Technical Explanation)

Implementation: `src/componets/ListPage.tsx`. Custom logic only.

- **Constants:** `ROW_HEIGHT = 40` px, `BUFFER = 5` rows.
- **Scroll state:** From the scroll container we read `scrollTop` and `containerHeight`; total content height is `data.length × ROW_HEIGHT`.
- **Visible range:**  
  `startIndex = max(0, floor(scrollTop / ROW_HEIGHT) - BUFFER)`  
  `endIndex = min(data.length - 1, ceil((scrollTop + containerHeight) / ROW_HEIGHT) - 1 + BUFFER)`  
  Only `data.slice(startIndex, endIndex + 1)` is rendered.
- **Positioning:** The visible block uses `transform: translateY(startIndex × ROW_HEIGHT)` so row alignment matches scroll position.

---

## City-to-Coordinate Mapping (Analytics Map)

No map library. Raw SVG in `src/componets/AnalyticsPage.tsx`.

- **Known cities:** `CITY_COORDS` maps names to (x, y) pixel coordinates.
- **Unknown cities:** `getFallbackCoord(city)` returns deterministic coordinates from a hash of the city name.

---

## Deliverables

- **Source code:** [GitHub repository URL]
- **Screen recording:** [Video URL] — walkthrough + ≤60s explainer (image merging + scroll offset).
