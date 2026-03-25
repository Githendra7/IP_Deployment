# Application Testing Guide

This guide details how to run and test the AI-Assisted Product Development Support Tool API.

## 1. Running the Application

Before testing, ensure your FastAPI application is running.

1. Open your terminal in the project directory (`d:\Main Projects\IPWithTools`).
2. Activate your virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Start the server with hot-reloading:
   ```powershell
   uvicorn app.main:app --reload
   ```

The server should now be running at `http://127.0.0.1:8000`.

---

## 2. Manual Testing via Swagger UI (Recommended)

FastAPI automatically generates an interactive testing interface. This is the easiest way to test your endpoints manually.

1. Open your web browser and navigate to: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
2. You will see a list of all available API endpoints (e.g., `/health`, `/api/projects`).
3. Click on any endpoint to expand it.
4. Click the **"Try it out"** button.
5. Fill in any required parameters or request body (JSON).
   * *Example for POST `/api/projects`:*
     ```json
     {
       "problem_statement": "Design a portable solar-powered water purifier."
     }
     ```
6. Click **"Execute"**. The UI will show the exact response from your server.

> **Note on Authentication:** Your API uses `Depends(get_current_user)`. To test endpoints requiring authentication via Swagger UI, you may need to click the "Authorize" button and provide a valid token, OR temporarily disable authentication in your routes for local testing.

---

## 3. Automated End-to-End Testing

You can use the provided `test_flow.py` script to run an automated end-to-end test of the core application flow.

The script tests:
- Creating a new project.
- Running Phase 1 (Functional Decomposition) and approving it.
- Running Phase 2 (Morphological Chart) and approving it.
- Running Phase 3 (Risk Analysis).

### To run the automated test:

1. Ensure the FastAPI server is running (see step 1).
2. Open a *new* terminal window in your project directory.
3. Activate the virtual environment (`.\venv\Scripts\activate`).
4. Execute the test script:
   ```powershell
   python test_flow.py
   ```

### Important requirement for `test_flow.py`:
The script sends a test JWT token (`Bearer test-token`). If your API specifically validates real Supabase JWTs, the test script will fail with a 401 Unauthorized or similar error. 
To make the script work locally, either:
- Temporarily remove the `Depends(get_current_user)` dependency from the endpoints in `app/api/routes.py`.
- Update the `test_flow.py` headers to include a valid JWT from your Supabase project.

---

## 4. Quick Health Check

To simply verify that the server is up and responding, you can use the health check endpoint.

* **Browser:** Visit [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
* **Terminal (cURL):**
  ```powershell
  curl http://127.0.0.1:8000/health
  ```
