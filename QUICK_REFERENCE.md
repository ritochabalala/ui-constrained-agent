# Quick Reference Card

## 🚀 One-Command Setup

```bash
./setup.sh
```

## 🎯 Start Application

**Terminal 1 (Backend):**
```bash
cd backend && ./start.sh
```

**Terminal 2 (Frontend):**
```bash
cd frontend && ./start.sh
```

**Access:** http://localhost:3000

## 📋 Project Requirements Checklist

### ✅ Working Code Requirements
- [x] Runnable UI (React web application)
- [x] Agent responses constrained to 120 characters max
- [x] Responses only via predefined UI components (forms, buttons, indicators)
- [x] Partial task completion states support
- [x] User correction without restarting the task
- [x] Visible agent confidence/uncertainty indicator

## 📚 Key Documentation Sections

1. **How to Run Locally**
   - Quick start (automated)
   - Manual setup (step-by-step with venv)
   - Backend and frontend instructions

2. **UI vs Agent vs Memory State Model**
   - UI Components explanation
   - Agent Logic description
   - Memory State (ReservationSession) details

3. **Failure Scenario and Recovery**
   - Invalid date entry example (2026-02-30)
   - System response breakdown
   - Recovery mechanism details

4. **Why Plain Text Chat Would Break**
   - 7 detailed failure points
   - Comparison of UI-constrained vs plain text
   - Technical reasoning

## 🛠️ Tech Stack

**Backend:**
- Django 5.x
- Django REST Framework
- SQLite database
- CORS enabled

**Frontend:**
- React 19.x
- Functional components with hooks
- Proxy to Django backend

## 🔧 Troubleshooting Quick Fixes

```bash
# Backend port conflict
sudo lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Frontend port conflict  
sudo lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Reset database
cd backend && rm db.sqlite3 && python manage.py migrate

# Reinstall frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## 📁 Essential Files

```
requirements.txt       → Python dependencies
package.json          → Node dependencies
models.py             → ReservationSession model
views.py              → Agent logic (120-char constraint)
App.js                → Main React component
AgentResponse.js      → Response display (capped)
ConfidenceIndicator.js → Visual confidence meter
TaskProgress.js       → Step tracker UI
```

## 🎓 Key Concepts

**State Machine:** greeting → party_size → date → time → name → phone → email → confirm

**Confidence Levels:**
- High (0.8-1.0): Green
- Medium (0.5-0.79): Yellow  
- Low (0-0.49): Orange/Red

**Session Persistence:** UUID-based sessions stored in SQLite

**Error Recovery:** Field-level validation, no restart needed

---

**Ready to run?** `./setup.sh` then start both servers! 🎉
