import React, { useState, useEffect } from 'react';
import TaskProgress from './components/TaskProgress';
import AgentResponse from './components/AgentResponse';
import ReservationForm from './components/ReservationForm';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  // const [agentResponse, setAgentResponse] = useState("Welcome! Let's book your table.");
  const [agentResponse, setAgentResponse] = useState("What's your seating preference? e.g Window Seat, Bar, Patio, Quiet, High-top, No Preference");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/session/start/', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setSessionId(data.session?.id || data.id);
        setSessionData(data.session || data);
        if (data.agent_response) {
          setAgentResponse(data.agent_response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error starting session:', error);
        setIsLoading(false);
      });
  }, []);

  const handleUserInput = (input, field) => {
    if (!sessionId) return;

    fetch(`/api/session/${sessionId}/input/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, field }),
    })
      .then(res => res.json())
      .then(data => {
        setSessionData(data.session);
        setAgentResponse(data.agent_response);
      });
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          fontSize: '1.2rem',
          color: '#7f8c8d'
        }}>
          🚀 Starting your reservation assistant...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <h1 style={{
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        🍽️ Restaurant Reservation Assistant
      </h1>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {['Start', 'Guests', 'Date', 'Time', 'Name', 'Contact', 'Confirm', 'Done'].map((label, index) => {
          const stepIndex = index + 1;
          const stepName = stepIndex === 1 ? 'greeting' :
            stepIndex === 2 ? 'party_size' :
              stepIndex === 3 ? 'date' :
                stepIndex === 4 ? 'time' :
                  stepIndex === 5 ? 'name' :
                    stepIndex === 6 ? 'phone' :
                      stepIndex === 7 ? 'confirmation' :
                        stepIndex === 8 ? 'completed' : null;

          const isCurrent = sessionData?.current_step === stepName;

          // Determine step order for completion check
          const stepOrder = {
            'greeting': 1,
            'party_size': 2,
            'date': 3,
            'time': 4,
            'name': 5,
            'phone': 6,
            'confirmation': 7,
            'completed': 8
          };
          const currentStepOrder = stepOrder[sessionData?.current_step] || 1;
          const thisStepOrder = stepOrder[stepName] || 1;
          const isCompleted = thisStepOrder < currentStepOrder;

          return (
            <div key={label} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0.5rem',
              borderRadius: '8px',
              backgroundColor: isCurrent ? '#3498db' : isCompleted ? '#2ecc71' : '#ecf0f1',
              color: isCurrent || isCompleted ? 'white' : '#7f8c8d',
              minWidth: '80px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isCurrent ? '#ffffff' : isCompleted ? '#ffffff' : '#bdc3c7',
                color: isCurrent ? '#3498db' : isCompleted ? '#2ecc71' : '#7f8c8d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {stepIndex}
              </div>
              <div style={{ fontSize: '0.85rem' }}>{label}</div>
            </div>
          );
        })}
      </div>

      {/* Agent Response */}
      <AgentResponse message={agentResponse} confidence={sessionData?.confidence || 1.0} />

      {/* Form */}
      {sessionId && !sessionData?.completed && (
        <ReservationForm sessionData={sessionData} onSubmit={handleUserInput} />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#7f8c8d'
      }}>
        UI-Constrained Agent • Responses limited to 120 characters
      </footer>
    </div>
  );
}

export default App;