# 🍔 CanteenGo

A beginner-friendly, highly interactive frontend web application designed for hassle-free food ordering from the hostel canteen. 

This project operates completely as a **Single Page Application (SPA)** architecture, delivering a fast and seamless user experience without requiring a complex backend server.

---

## 🚀 Live Deployment
The application is fully compiled and hosted online via GitHub Pages. You can access the live system here:
👉 **[Launch CanteenGo Web App]( https://karishmas0.github.io/MIRAX_PROJECT_final/)**

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Vanilla HTML5, Custom CSS3, Modern JavaScript (ES6+).
* **State Management & Storage:** Browser Client-Side `localStorage` API.
* **Hosting Pipeline:** GitHub Actions & GitHub Pages static environment.

---

## ✨ System Features & Core Modules

### 1. Client-Side Authentication (Session Layer)
* Implements an authentication check layer using `localStorage` states.
* Captures and securely logs student details including **Email, Room Number, and Roll Number**.
* Features a dynamic dynamic session lifecycle with a persistent **Logout** and layout refresh mechanism.

### 2. Deep Search & Multi-Tier Filter Loop
* Powered by a real-time JavaScript `input/keyup` event listener system.
* Dynamically manipulates the DOM tree layout configuration (`hidden-layout` classes) to remove sliders/banners instantly when a user searches.
* Runs a double-nested iteration loop over the global data structures to fetch matching varieties instantly.

### 3. Food Variety Modals (Dynamic UI Mapping)
* Clicking on any main item card triggers an atomic modal system (`foodModal`).
* Maps a specific key query to a comprehensive JSON data bank (`foodData`) to dynamically inject and list up to 10 distinct variants complete with remote CDN image sources and price tags.

### 4. Interactive Checkout Tray Layer
* Tracks user selections dynamically using global object arrays.
* Features an intuitive aggregate summary engine using JS arrays `.reduce()` methods to compute a cumulative real-time price total.
* Integrates a responsive floating bottom utility strip notification tray with automatic visibility states (`hidden-cart`).

---

## 📂 Repository Layout

* `index.html` — Contains core application markup layouts, overlay modals, and skeletal structures.
* `style.css` — Custom CSS handling layout properties, grid matrix setups, and interactive transitions.
* `javas.js` / `javascript.js` — Core application logic controller mapping memory systems and rendering DOM elements.

---

Developed with ❤️ for Hostel Students.
