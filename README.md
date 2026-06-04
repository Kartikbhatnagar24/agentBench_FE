# RAG System - Frontend

This is the frontend user interface for the Retrieval-Augmented Generation (RAG) system, built with **React**, **TypeScript**, **Vite**, and styled using **Tailwind CSS**. It connects to the FastAPI backend to provide user authentication, chat conversations, document upload, and evaluation visualizations.

## Tech Stack
- **Framework**: React 18+ (with TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router (or equivalent)
- **HTTP Client**: Fetch API / Axios

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn installed

### 1. Clone and Navigate
Clone the frontend repository and navigate to the directory:
```bash
git clone <YOUR_FRONTEND_GITHUB_REPO_URL> rag-frontend
cd rag-frontend
```

### 2. Install Dependencies
Run npm install to install the required node modules:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of the `frontend` directory:
```env
VITE_API_URL=http://127.0.0.1:8000
```
Change `http://127.0.0.1:8000` to your deployed backend API URL when deploying to production.

### 4. Run the Development Server
Start the Vite development server:
```bash
npm run dev
```
The application will run locally, typically at `http://localhost:5173`. Open this URL in your web browser to interact with the application.

### 5. Build for Production
To create a production-ready build of the application:
```bash
npm run build
```
This generates a static `dist/` directory that can be hosted on platforms like Vercel, Netlify, or AWS S3.

---

## Key Features
- **Authentication**: Sign up, log in, and session management integrated with the backend's Supabase auth.
- **Chat Interface**: Interactive chat window for running RAG queries, displaying agent analysis/thought processes, and latex formatting support.
- **Document Management**: UI for uploading PDF/text files to be processed and indexed by the RAG backend.
- **Evaluation Dashboard**: Visualizations of performance scores (correctness, faithfulness, relevancy) calculated by Ragas.
