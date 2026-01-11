# UI-Constrained Agent: Restaurant Reservation Assistant

This application demonstrates a task-focused assistant where the UI constrains the agent's behavior, ensuring focused interactions without free-form chat.

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

## Failure Scenario and Recovery

**Scenario**: User enters invalid date (`2026-02-30`)

**System Response**:
1. Agent detects invalid date
2. Confidence drops to 0.4 → UI shows "Low"
3. Response: `"What date? (YYYY-MM-DD) [?] Sure?"` (118 chars)
4. Task remains on "Date" step
5. Progress percentage unchanged

**Recovery**:
- User corrects to `2026-06-15`
- Confidence rises to 0.85 → "Medium"
- Task advances to "Time"
- Previously entered data (party size) preserved

## Why Plain Text Chat Would Fail

1. **No Input Constraints**: Users might say "4 people next Tuesday at 7" — hard to parse reliably
2. **State Ambiguity**: Did they mean *this* Tuesday or *next*? No structured validation
3. **Error Recovery**: Correcting requires natural language ("Actually, make it 6 people") — complex NLP needed
4. **Confidence Hidden**: No visual indicator of uncertainty
5. **Task Drift**: Users might ask unrelated questions ("Do you have vegan options?")

The UI constraints enforce a predictable, robust interaction flow.

## Screenshots
![Initial State](screenshots/initial-state.png)
![Low Confidence](screenshots/low-confidence.png)
![Completed](screenshots/completed.png)