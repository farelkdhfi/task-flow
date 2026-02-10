# 🚀 TaskFlow - Modern Kanban Board

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=flat&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/State-Zustand-orange.svg)

**TaskFlow** is a high-performance, dark-themed productivity application that leverages **Zustand** for state management and **@dnd-kit** for fluid interactions. Featuring a fully customizable drag-and-drop interface, rich media support for tasks, and persistent local storage.

> **100% Client-Side Persistence.** All your boards and tasks are saved instantly to your browser's Local Storage, ensuring you never lose progress.

---

## ✨ Key Features

### 🖐️ Drag & Drop Experience
* **Fluid Interactions:** Powered by **@dnd-kit** for silky smooth sorting and moving of items.
* **Smart Reordering:** Automatic list sorting and cross-column task transfer with collision detection.
* **Touch Optimized:** Fully functional on touch devices using specialized sensors.

### 🎨 Customization & Rich Media
* **Visual Organization:** Color-coded columns with a predefined pastel palette (16+ colors).
* **Image Covers:** Upload and preview cover images for any task to make your board visual.
* **Label Tags:** Categorize tasks with multi-colored aesthetic tags.
* **Dark Mode UI:** A sleek, modern interface designed for focus and reduced eye strain.

### 📋 Workflow Control
* **Dynamic Columns:** Add, rename, or delete columns on the fly to match your workflow (To Do, In Progress, Review, etc.).
* **Task Management:** Create detailed tasks with descriptions and rich metadata.
* **Edit Mode:** Intuitive modal interface for updating task content and assets.

### ⚡ Engineering & UX
* **State Persistence:** Robust state management using **Zustand Middleware** to sync data with Local Storage.
* **Responsive Design:** Optimized layout that adapts from desktop wide-screens to mobile devices.
* **Modular Architecture:** Clean code structure separating logic, stores, and UI components.

---

## 🛠️ Tech Stack

* **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Drag & Drop:** [@dnd-kit](https://dndkit.com/) (Core, Sortable, Utilities)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Utilities:** [UUID](https://github.com/uuidjs/uuid)

---

## 🚀 Getting Started

Follow these steps to run TaskFlow locally.

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/farelkdhfi/task-flow.git](https://github.com/farelkdhfi/task-flow.git)
    cd task-flow
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open in browser**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📸 DEMO WEBSITE
https://task-flow-pink-omega.vercel.app/