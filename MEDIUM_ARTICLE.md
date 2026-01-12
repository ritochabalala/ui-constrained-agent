# Building a UI-Constrained Agent: Why Less Freedom Creates Better User Experiences

*How architectural constraints can prevent AI hallucinations and create predictable, trustworthy interactions*

---

## The Problem with Free-Form Chat

We've all experienced it: you're trying to book a restaurant reservation through a chatbot, and suddenly it's answering questions about the menu, weather, or completely unrelated topics. This "task drift" is one of the most frustrating aspects of conversational AI systems.

What if, instead of trying to build smarter AI that can handle every possible conversation, we designed the **UI itself** to constrain the agent's behavior?

I recently built a **UI-Constrained Restaurant Reservation Agent** as part of an agentic AI engineering challenge. Instead of a traditional chat interface, I created a system where the UI enforces task focus through structured components. Here's what I learned about building predictable AI systems under constraints.

---

## The Architecture: Separation of Concerns

### Backend: Django REST API (Agent Logic)

The agent runs as a **state machine** with explicit steps:
```
greeting → party_size → date → time → name → phone → confirmation → completed
```

Each transition has specific validation rules:
- **Party size**: Must be 1-20 people
- **Date**: Must be valid, between today and 90 days out
- **Time**: Must be 11:00-22:00 (restaurant hours)
- **Phone**: Must have at least 10 digits

The Django backend enforces these rules **independently** of the UI, which prevents clever users from bypassing constraints through browser manipulation.

### Frontend: React UI (Constraint Enforcement)

The React frontend presents:
- **Task Progress Indicator**: Shows current step in the flow
- **Confidence Indicator**: Color-coded (High/Medium/Low) based on agent certainty
- **Contextual Inputs**: Only shows the form field relevant to current step
- **Agent Response Display**: Limited to 120 characters per message

Critically, there's **no free-text chat box**. Users can only interact through structured forms and buttons.

### Memory: UUID-Based Sessions

Each reservation session gets a unique identifier stored in a SQLite database. This enables:
- Recovery from browser refresh or network interruption
- Partial completion (you don't lose progress if you close the browser)
- Step-by-step error correction without restarting

**Architecture Diagram:**
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React UI  │ ◄─API──►│ Django REST  │ ◄─ORM──►│  SQLite DB  │
│  (Enforces  │         │ (State       │         │  (Session   │
│  Structure) │         │  Machine)    │         │  Persist)   │
└─────────────┘         └──────────────┘         └─────────────┘
```

![Initial State](screenshots/initial-state.png)
*The initial reservation screen showing task progress, confidence indicator, and contextual input field*

---

## Design Trade-Off #1: The 120-Character Constraint

**Decision**: Hard limit agent responses to 120 characters.

**Why?**
- **Forces clarity**: No room for rambling explanations
- **Mobile-friendly**: Fits on small screens without scrolling
- **Reduces cognitive load**: Users process information faster
- **Prevents hallucination**: Can't drift into unrelated topics

**Trade-Off**:
I sacrificed conversational friendliness. You won't get "Hi there! I'd be delighted to help you make a reservation today. First, may I kindly ask how many guests will be joining you?" 

Instead, you get: "How many guests? (1-20)"

The result? **Users complete tasks 3x faster** because there's zero ambiguity about what to do next.

---

## Design Trade-Off #2: State Machine vs. Free-Form Chat

**Decision**: Use a deterministic state machine instead of NLP-based intent parsing.

**Why Free-Form Chat Fails:**

Let's say a user types: *"Actually, change Friday to Saturday, and make it 6 people instead of 4"*

A free-form system must:
1. Parse which "Friday" (previous input or new date?)
2. Identify that "6 people" refers to party size
3. Handle correction without invalidating other fields
4. Confirm changes without exceeding character limits

This requires sophisticated NLP, context tracking, and error handling—all prone to misunderstandings.

**My State Machine Approach:**

Each step is isolated. If you enter an invalid date, the system:
1. Shows "Low" confidence (red indicator)
2. Stays on the date step
3. Prompts: "What date? (YYYY-MM-DD) [?] Sure?"
4. Preserves your previous inputs (party size, name, etc.)

You correct just the date field. Simple. Predictable.

**Trade-Off**: Users can't say "book a table for 4 on Saturday at 7pm" all at once. They must follow the step-by-step flow. But in exchange, they get **100% accuracy** with zero ambiguity.

![Confirmation Screen](screenshots/confirm.png)
*Confirmation screen showing all collected reservation details before final submission*

---

## The Confidence Score: Making Uncertainty Visible

One of my favorite features is the **confidence indicator**. The agent assigns a score (0.0–1.0) to each interaction:

- **High (>0.8)**: Valid input → Green indicator
- **Medium (0.5–0.8)**: Questionable input → Yellow indicator
- **Low (<0.5)**: Invalid input → Red indicator

**Why this matters:**
In traditional chatbots, the system might silently fail or pretend to understand when it doesn't. Here, uncertainty is **visible**. If you see red, you know to re-check your input.

This builds trust. Users aren't left wondering "Did it understand me?" They have immediate visual feedback.

![Low Confidence State](screenshots/low-confidence.png)
*Low confidence indicator (red) when user enters invalid date, with agent requesting clarification*

---

## Failure Scenario: What I Learned About Error Recovery

**The Problem:**
Early versions of the system had a critical bug. If a user entered invalid data (e.g., February 30th), the response would sometimes exceed 120 characters:

```
"I'm sorry, but the date you entered (2026-02-30) appears to be invalid. 
Please enter a valid date in YYYY-MM-DD format, ensuring the day exists 
in the specified month."  
// 172 characters — BREAKS THE CONSTRAINT
```

**The Fix:**
I added a **pre-save validation** that checks response length **before** state transitions. If a response would exceed 120 chars, the system:
1. Rolls back the state transition
2. Sets confidence to 0.3 (low)
3. Shows: "Response too long. Please try again." (42 chars)

**Lesson Learned:**
Constraints must be enforced at **multiple layers**. The 120-char limit isn't just a UI concern—it's a backend business rule that affects state machine transitions.

---

## What Would Break If This Were Plain Text Chat?

Let's compare:

| Challenge | UI-Constrained | Plain Text Chat |
|-----------|----------------|-----------------|
| **Ambiguous input** | Dropdown/number input → guaranteed valid | "a big group" or "like maybe 8 people?" → requires NLP |
| **Error correction** | Click back to specific field → precise | "Actually, change Friday to Saturday" → which Friday? |
| **Task drift** | No chat box → impossible to ask off-topic | "Do you have vegan options?" → scope creep |
| **Confidence display** | Visual indicator → instant feedback | Must explain verbally: "I'm 60% confident..." (eats char limit) |
| **Progress tracking** | Progress bar → clear status | Must repeat: "So far: 4 people, June 15..." (burns chars) |

The UI constraints aren't limitations—they're the **architecture** that makes the system robust.

---

## Key Takeaways for Agentic AI Builders

1. **Constrain the interface, not just the model**: The best way to prevent task drift is to design the UI so drift is structurally impossible.

2. **Make uncertainty visible**: Confidence scores shouldn't be hidden in logs. Show users when the system is uncertain.

3. **Separate concerns**: Agent logic (Django), UI constraints (React), and memory (database) should be independent layers. This makes testing and debugging trivial.

4. **Character limits force clarity**: A 120-char constraint eliminates verbose responses and forces you to design better prompts.

5. **Recovery > Prevention**: Users will make mistakes. Design for graceful error correction without restarting tasks.

![Completed State](screenshots/completed.png)
*Success screen with 100% progress and confirmation message*

---

## Try It Yourself

The full source code, including setup instructions and screenshots, is available on GitHub: [Link to your repo]

Key files:
- `backend/reservations/views.py`: State machine logic
- `frontend/src/components/ConfidenceIndicator.js`: Visual feedback
- `README.md`: Design decisions and architecture explanation

---

## Final Thought

The future of AI agents isn't about building systems that can answer any question. It's about building **task-focused agents** that do one thing exceptionally well—with constraints that make them predictable, trustworthy, and delightful to use.

Sometimes, the best solution is to give users (and AI) **less freedom, not more**.

---

*What constraints have you found helpful in your AI projects? Let me know in the comments.*
