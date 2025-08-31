# Mangrove Guardian: Participatory Mangrove Monitoring System

## Overview
Mangrove Guardian is a full-stack web application for participatory mangrove incident reporting, verification, and government oversight. It features:
- **Reporter Dashboard**: Report incidents with photo, location, and description.
- **Verifier Dashboard**: Review, verify, or reject incidents. View LLM (AI) analysis for each report.
- **Government Dashboard**: Monitor all incidents and system activity.
- **WhatsApp Integration**: Users can report incidents via WhatsApp.
- **LLM Automation**: Each report is analyzed by an LLM (via FastAPI) for automated insights.
- **Points System**: Reporters earn points for verified reports.
- **Creative, animated, motivational UI**: Modern, glassmorphic, and animated dashboards for all roles.

---

## Features
- **User Authentication**: JWT-based login for Reporter, Verifier, and Government roles.
- **Incident Reporting**: Upload photo, description, category, and geolocation.
- **Async LLM Analysis**: Reports are instantly saved; LLM analysis is performed in the background and result is shown when ready.
- **Incident Verification**: Verifiers can verify/reject with notes and see LLM output.
- **Government Oversight**: Government users can view all incidents and system stats.
- **WhatsApp-to-Incident Automation**: WhatsApp messages are parsed and converted to incidents.
- **Error Logging**: Robust error handling and logging throughout backend.
- **Animated UI**: Confetti, parallax, glassmorphism, and motivational messages.
- **Logout**: All dashboards have a visible logout button.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js (Express), Supabase (Postgres), Multer, JWT
- **LLM Service**: FastAPI (Python, Gemini API)
- **WhatsApp**: Twilio API
- **Storage**: Supabase Storage (for incident photos)

---

## Prerequisites
- Node.js (v18+ recommended)
- npm
- Python 3.10+
- Supabase account (with a project and storage bucket named `incidents`)
- Twilio account (for WhatsApp integration)
- FastAPI LLM server (see below)

---

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd finalsubmission
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+your_twilio_number
```

### 3. Supabase Setup
- Create a table `incidents` with columns:
  - id (uuid, primary key)
  - reporter_id (uuid)
  - description (text)
  - category (text)
  - latitude (float)
  - longitude (float)
  - photo_url (text)
  - status (text)
  - created_at (timestamp)
  - llm_result (text)
  - verifier_id (uuid)
  - verified_at (timestamp)
  - verifier_notes (text)
- Create a storage bucket named `incidents`.
- Add a Postgres function `increment_reporter_points` for the points system.

### 4. FastAPI LLM Server
- Clone or set up your FastAPI server (see `backend/routes/incidents.js` for endpoint).
- The server should expose `/analyze` accepting `files` (image) and `prompt` (text), returning `{ result: <string> }`.
- Example minimal FastAPI app:
```python
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
app = FastAPI()
@app.post('/analyze')
def analyze(files: UploadFile = File(...), prompt: str = Form(...)):
    # Your LLM logic here
    return JSONResponse({"result": f"LLM analysis for: {prompt}"})
```
- Update the backend LLM URL if needed.

### 5. Install Dependencies
#### Backend
```
cd backend
npm install
```
#### Frontend
```
cd ../frontend
npm install
```

### 6. Run the Servers
#### Start FastAPI LLM server
```
uvicorn main:app --host 0.0.0.0 --port 8000
```
#### Start Backend
```
cd backend
npm run dev
```
#### Start Frontend
```
cd frontend
npm run dev
```

### 7. WhatsApp Integration
- Set up a Twilio WhatsApp sandbox and webhook to point to your backend's WhatsApp endpoint.
- See Twilio docs for details.

---

## Usage
- **Login** as Reporter, Verifier, or Government.
- **Reporters**: Submit incidents with photo, location, and description. Earn points for verified reports.
- **Verifiers**: See pending incidents, verify/reject, and view LLM analysis (modal dialog). Logout button at top right.
- **Government**: View all incidents and stats.
- **LLM Analysis**: Appears in the dashboard when ready. If not ready, shows "LLM analysis in progress...".
- **WhatsApp**: Send incident details and photo to the WhatsApp number; it will appear in the system.

---

## Troubleshooting
- Ensure all environment variables are set.
- Check Supabase and FastAPI server URLs.
- For CORS issues, allow frontend origin in backend and FastAPI.
- For file upload errors, check Supabase storage permissions.
- For WhatsApp, ensure Twilio webhook is correctly configured.

---

## Credits
- Built with ❤️ for participatory mangrove conservation.
- Tech: React, Tailwind, Node.js, Supabase, FastAPI, Twilio, Gemini API.

---

## License
MIT
