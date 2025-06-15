# CodeSnip / Lovable ✨


<div align="center">
  <img src="https://github.com/user-attachments/assets/96c9de61-405f-416c-970c-71a20b1d1843" alt="Project Banner" width="800">
</div>

<p align="center">
  <strong>An elegant web application for creating, sharing, and managing code snippets.</strong>
  <br />
  Built with a focus on a clean user experience and modern design principles.
</p>

<p align="center">
  <a href="https://code-spark-snippets.vercel.app"><strong>🚀 View Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/tech-React%20%7C%20TypeScript%20%7C%20Supabase-green.svg" alt="Tech Stack">
  <img src="https://img.shields.io/github/last-commit/1525164075/code-spark-snippets" alt="Last Commit">
</p>

---

## 🌟 About The Project

CodeSnip is a full-featured platform meticulously designed for developers who value both functionality and aesthetics. It provides a seamless experience for writing and sharing code, powered by the same editor as VS Code (Monaco) for superior syntax highlighting.

Whether you need to quickly share a piece of code with a colleague, save a useful snippet for later, or present code in a beautiful way, CodeSnip has you covered.

## 🚀 Key Features

* **💻 First-Class Code Editor**: A superior editing experience with Monaco Editor, featuring syntax highlighting and multiple themes.
* **🔗 Flexible Sharing**: Share snippets publicly with a unique URL, or keep them private with secure, password-protected links.
* **👤 Full User Authentication**: Sign up and log in with Supabase to manage all your personal snippets in a dedicated dashboard.
* **🎨 Polished & Inspired UI**: A clean, minimalist, and responsive interface designed with a focus on clarity, space, and user experience.
* **🌍 Internationalization (i18n)**: Fully translated interface supporting both English and Simplified Chinese.
* **✍️ Rich Markdown Support**: Add detailed, formatted descriptions to your snippets using a Markdown editor with a live preview.
* **🖱️ Interactive Experience**: Features like one-click modal previews and a smooth, modern user flow.

## 🛠️ Tech Stack

This project is built with a modern and robust tech stack:

* **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
* **UI Framework**: [Ant Design](https://ant.design/)
* **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
* **State Management**: [React Query (TanStack Query)](https://tanstack.com/query/latest) for server state
* **Deployment**: [Vercel](https://vercel.com/)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/1525164075/code-spark-snippets.git](https://github.com/1525164075/code-spark-snippets.git)
    cd code-spark-snippets
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up your environment variables**
    * Create a `.env` file in the root directory.
    * You'll need to get your Supabase URL and Anon Key from your Supabase project dashboard.
    ```
    VITE_SUPABASE_URL=[Your Supabase Project URL]
    VITE_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Your application should now be running on `http://localhost:5173` (or another port).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
