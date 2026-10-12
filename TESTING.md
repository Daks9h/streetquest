# StreetQuest AI — Verification Testing Log

This log documents empirical testing across the photo verification pipeline, covering edge cases, negative examples, AI model latency, and frontend safeguards.

## 📋 AI Verification Results (`gemma-4-26b-a4b-it`)

| Mission ID | Mission Title | Photo Description | Expected | Actual Verdict | Reason Summary | Status |
|---|---|---|---|---|---|---|
| `easy-1` | Something green | Real photo of outdoor tree leaf in sunlight | `match` | `match` | Close-up living green leaf confirmed. | **PASS** |
| `easy-1` | Something green | Digital vector drawing of a leaf | `no_match` | `no_match` | Identified digital illustration instead of real living leaf. | **PASS** |
| `easy-1` | Something green | Gray brick wall with no vegetation | `no_match` | `no_match` | No living leaf or botanical element detected. | **PASS** |
| `easy-2` | Look up | Blue sky with clouds filling 75% frame | `match` | `match` | Open sky exceeds half the frame area. | **PASS** |
| `easy-2` | Look up | Close-up asphalt pavement | `no_match` | `no_match` | Ground view, no sky visible. | **PASS** |
| `easy-3` | Round things | Round pebble on outdoor gravel path | `match` | `match` | Clearly spherical/rounded natural stone. | **PASS** |
| `easy-3` | Round things | Square concrete block | `no_match` | `no_match` | Geometry is angular/square, not round. | **PASS** |
| `med-1` | Heart shape | Two twinned leaves forming heart contour | `match` | `match` | Distinct bilateral heart silhouette. | **PASS** |
| `med-1` | Heart shape | Extremely dark/underexposed blurry photo | `unclear` | `unclear` | Insufficient lighting/focus to discern contour. | **PASS** |
| `med-2` | Tiny life | Garden ladybug on stem | `match` | `match` | Small living insect clearly in focus. | **PASS** |
| `med-3` | Two textures | Weathered bark with green moss patch | `match` | `match` | Rough tree bark juxtaposed with soft moss. | **PASS** |
| `hard-1` | Unusual leaf | Autumn maple leaf with ragged insect notches | `match` | `match` | Irregular serrations and distinctive hue. | **PASS** |
| `hard-2` | Pattern in nature | Pinecone spiral structure | `match` | `match` | Fibonacci spiral pattern clearly visible. | **PASS** |
| `hard-3` | Shadow art | Tree branch shadow silhouette on wall | `match` | `match` | Distinct shadow projection forming pattern. | **PASS** |

---

## 🛡 Frontend & Safety Tests

| Test Case | Procedure | Expected Behavior | Actual Result | Status |
|---|---|---|---|---|
| **Double Click Submit** | Double tap "Check my photo" button rapidly | Button is disabled on first click, only 1 request sent | Disabled with spinner; single network request confirmed | **PASS** |
| **Direct Locked URL** | Navigate directly to `/mission/hard-1` when Hard is locked | Redirect to `/levels` | Instantly redirected to `/levels` | **PASS** |
| **Unknown URL** | Navigate directly to `/mission/non-existent-id` | Redirect to `/levels` | Redirected to `/levels` | **PASS** |
| **Single Reward Rule** | Verify completed mission again | Screen shows "Already completed", no upload permitted | Shows "Already completed", zero additional points | **PASS** |
| **Quota Exceeded** | Simulate HTTP 429 response | Calm error banner without retry spam button | Calm banner displayed, retry button suppressed | **PASS** |
| **Timeout (30s)** | Simulate delayed response beyond client abort threshold | Timeout error banner with retry option | Displays friendly timeout banner with retry action | **PASS** |
| **Responsive Viewports** | Tested at 375px, 768px, and 1280px widths | Clean layout, proper button positioning and typography | All three breakpoints verified in Chromium | **PASS** |
