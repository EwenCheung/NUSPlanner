# NUS Planner

A full-stack application for planning NUS modules, built with FastApi, React, and Supabase.

## Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **Supabase Account** (for database)

## Environment Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd nusplanner
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory (or `.env.local`). You can copy the example:
    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your credentials:
    ```ini
    DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_KEY=your-anon-key
    OPENAI_API_KEY=your-openai-key  # If using AI features
    ```

## Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # macOS/Linux
    python3 -m venv .venv
    source .venv/bin/activate

    # Windows
    python -m venv .venv
    .venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Database Migration:**
    Set up the database schema:
    ```bash
    # Ensure you are at repository root for env vars loading logic, or set them manually
    # The script expects env vars to be loadable.
    # Run from root:
    python backend/scripts/run_migration.py
    ```
    *Alternatively, you can run the SQL in `backend/scripts/migrate.sql` directly in your Supabase SQL Editor.*

5.  **Run the Backend Server:**
    ```bash
    # From backend directory
    uvicorn app.main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`.
    API Docs: `http://localhost:8000/docs`.

## Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be running at `http://localhost:5173`.

## Full Data Ingestion (Optional)

To fetch module data from NUSMods and populate your database:

```bash
# From root directory
python backend/scripts/nusmods_ingestion.py
```
