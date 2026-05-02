# 🔔 PingHub

🌐 **Live Demo:** [https://ping-hub-smart-notification-dashboard.vercel.app](https://ping-hub-smart-notification-dashboa-alpha.vercel.app/)

PingHub is a **visual, interactive campus notification dashboard** built for university students. It allows students to view, filter, and prioritize campus alerts (Placements, Results, Events) through a premium, cheerful light-themed interface. The system calculates priority scores to surface the most urgent updates instantly.

---

## ✅ Live Features

* **Interactive Dashboard** — A clean, grid-based view of all campus notifications with colorful, type-specific accents.
* **Rich Detail Drawer** — Click any notification card to slide out a comprehensive detail panel showing full descriptions, company details, eligibility, CTC/prizes, and deadlines.
* **Priority Engine** — Automatically ranks notifications based on type weight (Placements > Results > Events) and recency, displaying the top alerts in a dedicated "Priority Inbox" with gold/silver/bronze medals.
* **Live Search & Filter** — Instantly filter alerts by category via the sidebar quick-stats or use the global search bar to find specific companies or keywords.
* **Bookmarking & Read Tracking** — Save important notifications for later. Unread alerts are clearly marked and counted.
* **Notification Bell** — A working top-nav bell that tracks unread alerts and opens a popover to quickly view or mark them as read.

---

## 🏗️ Architecture

```text
+-------------------------------------------------------------------+
|                       BROWSER (Client)                            |
|                                                                   |
|   +-------------+    +----------------+    +------------------+   |
|   |   Navbar    |    |   FilterBar    |    |   Search Bar     |   |
|   |  (w/ Bell)  |    | (Quick Stats)  |    | (Live text match)|   |
|   +-------------+    +----------------+    +------------------+   |
|          |                   |                       |            |
|          v                   v                       v            |
|   +-----------------------------------------------------------+   |
|   |                   Custom React Hooks                      |   |
|   |   useNotifications() | useReadTracker() | useBookmarks()  |   |
|   +-----------------------------------------------------------+   |
|                               |                                   |
|                               v                                   |
|   +-----------------------------------------------------------+   |
|   |                   Priority Engine                         |   |
|   |  Computes: (Type Weight × 0.6) + (Recency × 0.4) = Score  |   |
|   +-----------------------------------------------------------+   |
|                               |                                   |
|                               v                                   |
|   +-----------------------------------------------------------+   |
|   |                Local Storage / Mock API                   |   |
|   |     Stores read receipts, bookmarks, and serves data      |   |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
```

---

## 📁 Project Structure

```text
CampusNotify/
├── index.html
├── vite.config.js
└── src/
    ├── App.jsx                 # Routing and Layout wrapper
    ├── theme.js                # Custom MUI light-theme tokens & colors
    ├── pages/
    │   ├── AllNotifications.jsx # Main feed
    │   ├── FilterPage.jsx       # Category-specific views
    │   └── PriorityInbox.jsx    # Ranked top-N alerts
    ├── components/
    │   ├── NotificationCard.jsx # The visual alert card
    │   ├── NotificationDetailDrawer.jsx # Slide-in details
    │   ├── NotificationBell.jsx # Unread alerts popover
    │   ├── Navbar.jsx           # Sidebar and top navigation
    │   ├── StatsBar.jsx         # Clickable overview metrics
    │   └── SearchBar.jsx        # Text filtering input
    ├── hooks/
    │   └── useNotifications.js  # State, bookmarks, and read tracking
    └── utils/
        ├── mockData.js          # 2026/2027 context-aware mock alerts
        └── priorityEngine.js    # Ranking logic
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Framework** | React 18 | Component model, hooks, reactivity |
| **Build Tool** | Vite | Instant HMR, lightning-fast cold starts |
| **Styling** | Material UI (v5) | Accessible components, custom theme tokens |
| **Icons** | MUI Icons | Consistent, scalable SVG iconography |
| **Routing** | React Router DOM | Client-side navigation between views |
| **State Persistence**| LocalStorage API | Saving bookmarks and read-states locally |
| **Ranking Logic** | Custom JS Engine | Algorithmic scoring based on weight/time |

---

## 🚀 How to Run

### Prerequisites
* Node.js v18+ installed

### 1 — Install Dependencies
```bash
git clone https://github.com/Khushii0212/PingHub.git
cd PingHub
npm install
```

### 2 — Start the Dev Server
```bash
npm run dev
```

### 3 — Open the App
Visit `http://localhost:3000` in your browser. The Vite dev server handles all routing and module bundling automatically.

---

## 👤 About the Developer

**Built with ❤️ by Khushi Prasad**

I'm a passionate full-stack developer who loves crafting clean, functional, and visually premium web experiences. PingHub is a reflection of that passion — combining thoughtful architecture with a polished UI that actually feels good to use.

If you have feedback, ideas, or just want to connect — feel free to reach out!

<hr>

<p align="center">
  <b>PingHub</b> · Built with ⚡ React + Material UI
</p>
