# UI-Constrained Agent: Restaurant Reservation Assistant

This application demonstrates a task-focused assistant where the UI constrains the agent's behavior, ensuring focused interactions without free-form chat.

The UI constraints enforce a predictable, robust interaction flow.

## Screenshots
![Initial State](screenshots/initial-state.png)
![Low Confidence](screenshots/low-confidence.png)
![Confirm](screenshots/confirm.png)
![Completed](screenshots/completed.png)

## How to Run the Application Locally

### Manual Setup (Step-by-Step)

#### Prerequisites
- Python 3.8+ with venv support
- Node.js 14+ and npm
- Git

### Backend Setup (Django REST API)

```bash
# 1) Ensure venv support is installed
sudo apt update
sudo apt install -y python3-venv python3-full

# 2) Navigate to the backend directory
cd backend

# 3) Create a virtual environment
python3 -m venv .venv

# 4) Activate it (Linux/WSL bash)
source .venv/bin/activate

# 5) Upgrade pip inside the venv
python -m pip install --upgrade pip

# 6) Install dependencies
pip install -r requirements.txt

# 7) Run database migrations
python manage.py migrate

# 8) Start the Django development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup (React)

Open a **new terminal** window:

```bash
# 1) Navigate to the frontend directory
cd frontend

# 2) Install Node dependencies
npm install

# 3) Start the React development server
npm start
```

The frontend UI will open automatically at `http://localhost:3000`

### Quick Start (Automated Setup)

```bash
# Run the automated setup script
./setup.sh

# Then start backend (Terminal 1)
cd backend && ./start.sh

# Then start frontend (Terminal 2)
cd frontend && ./start.sh
```

### Testing the Application

#### ▶️ Let's Test the Full Flow
Follow these steps to see all features in action:

**1. Enter Party Size**
- Type: `4` → Click Submit
- ✅ Should move to "Date" step
- Progress bar advances to ~12%

**2. Test Error Recovery (Low Confidence)**
- At Date step, enter: `2026-02-30` (invalid date)
- Click Submit
- 🔴 Observe:
  - Confidence changes from "High" → "Low" (red indicator)
  - Agent message: "What date? (YYYY-MM-DD) [?] Sure?"
  - Progress bar stays at ~12%
- Now correct it: enter `2026-06-15`
- ✅ Confidence recovers → moves to "Time"

**3. Complete the Booking**
- Time: `18:20`
- Name: `Rito Chabalala`
- Phone: `0712345678`
- On confirmation screen → click ✅ Confirm

**4. See Completion Screen**
- Message: "Reservation confirmed! See you soon."
- Progress bar at 100%
- All steps turn green

## Design Decisions

### Architecture: Django REST + React
**Decision**: Separate backend API (Django) from frontend UI (React)  
**Rationale**: 
- Clear separation between agent logic (Django state machine) and UI constraints (React components)
- Backend enforces business rules independently of UI
- Enables testing agent logic without frontend dependency
- RESTful API makes system extensible (could add mobile app later)

### State Machine Over Free-Form Chat
**Decision**: Explicit step-by-step state machine (`greeting → party_size → date → time → name → phone → confirmation`)  
**Rationale**:
- Predictable flow ensures all required fields are collected
- Each step has specific validation rules (no ambiguous parsing needed)
- State transitions are deterministic (no context inference required)
- Failures are isolated to specific steps (user corrects only the problematic field)

### 120-Character Constraint
**Decision**: Hard limit on agent responses enforced at generation time  
**Rationale**:
- Forces clarity and conciseness (no verbose explanations)
- Mobile-friendly (fits small screens without scrolling)
- Cognitive load reduction (users process information faster)
- Prevents hallucination creep (no room for off-topic content)

### UUID-Based Session Persistence
**Decision**: Each session gets unique ID, state stored in database  
**Rationale**:
- Enables recovery from browser refresh or network interruption
- Partial completion preserved (user doesn't restart from scratch)
- Allows async processing (backend can validate while frontend waits)
- Session can be resumed across devices (same UUID)

### Confidence-Driven UI Feedback
**Decision**: Confidence score (0.0-1.0) determines visual indicator color  
**Rationale**:
- Makes uncertainty visible (user knows when to double-check input)
- Prevents silent failures (low confidence = immediate feedback)
- Builds trust (system admits when unsure rather than faking certainty)
- Guides user corrections (red indicator = check this field)

## UI vs Agent vs Memory State Model

### UI Components
- **Task Progress Indicator**: Visual step tracker (Start → Guests → Date → ... → Done)
- **Agent Response Display**: Messages capped at 120 characters
- **Confidence Indicator**: Color-coded certainty (High/Medium/Low)
- **Contextual Inputs**: Form fields adapt to current task step
- **Confirmation Buttons**: Binary choice for final step

### Agent Logic
- State machine driven by `current_step`
- Validates inputs against business rules
- Adjusts `confidence` score based on validity
- Generates constrained responses (≤120 chars)
- Never accepts free-text beyond current field

### Memory State (`ReservationSession`)
- Stores partial inputs (e.g., valid party size even if date is wrong)
- Tracks `progress_percentage` based on completed fields
- Persists state via UUID session ID
- Recovers gracefully from errors without restart

## Failure Scenario
When user enters invalid date (e.g., `2026-02-30`):
- Agent detects error
- Confidence drops to "Low"
- Task stays on Date step
- User corrects input → task resumes
- Previously entered data (party size) preserved

## Why Plain Text Chat Fails
- **No structured validation**: Ambiguous inputs like "a big group" or "next Tuesday"
- **Complex corrections**: "Actually, make it June 15" requires parsing intent and context
- **Hidden uncertainty**: Can't show visual confidence indicators
- **Task drift**: Users can ask off-topic questions ("Do you have vegan options?")
- **Character limit conflicts**: Must repeat context verbally within 120 chars

## Project Structure

```
ui-constrained-agent/
├── backend/                    # Django REST API
│   ├── requirements.txt        # Python dependencies
│   ├── manage.py              # Django management script
│   ├── db.sqlite3             # SQLite database
│   ├── reservation_agent/     # Django project settings
│   │   ├── settings.py        # Configuration
│   │   ├── urls.py            # API routing
│   │   └── wsgi.py            # WSGI entry point
│   └── reservations/          # Main app
│       ├── models.py          # ReservationSession model
│       ├── views.py           # Agent logic + API endpoints
│       ├── serializers.py     # Data serialization
│       └── urls.py            # App-level routing
├── frontend/                  # React UI
│   ├── package.json           # Node dependencies
│   ├── public/                # Static assets
│   └── src/
│       ├── App.js             # Main application component
│       └── components/
│           ├── ReservationForm.js      # Form container
│           ├── AgentResponse.js        # 120-char response display
│           ├── ConfidenceIndicator.js  # Visual confidence meter
│           └── TaskProgress.js         # Step progression UI
├── screenshots/               # UI screenshots
│   ├── initial-state.png      # Starting screen
│   ├── low-confidence.png     # Error recovery state
│   ├── confirm.png            # Confirmation screen
│   └── completed.png          # Success screen
├── interaction-diagram.mmd    # Mermaid interaction flow diagram
└── README.md                  # This file
```

## Technical Requirements Met

✅ **Runnable Web Application**: React frontend + Django REST backend  
✅ **120-Character Constraint**: Enforced in `views.py` agent response generation  
✅ **Predefined UI Components**: No free-text chat — only forms, buttons, indicators  
✅ **Partial Task Completion**: Session model stores incremental progress  
✅ **User Correction Without Restart**: Session persists, allows step-by-step fixes  
✅ **Visible Confidence**: Color-coded confidence indicator component  

## Troubleshooting

### Backend Issues
- **Port 8000 already in use**: `sudo lsof -i :8000` then `kill <PID>`
- **Migration errors**: Delete `db.sqlite3` and run `python manage.py migrate` again
- **Module not found**: Ensure virtual environment is activated (`source .venv/bin/activate`)

### Frontend Issues
- **Port 3000 already in use**: `sudo lsof -i :3000` then `kill <PID>`, or set `PORT=3001 npm start`
- **Proxy errors**: Ensure backend is running on port 8000 before starting frontend
- **Module errors**: Delete `node_modules` and `package-lock.json`, run `npm install` again


