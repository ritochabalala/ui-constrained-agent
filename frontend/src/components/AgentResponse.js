import React from 'react';
import ConfidenceIndicator from './ConfidenceIndicator';

const AgentResponse = ({ message, confidence }) => {
    const truncatedMessage = message.length > 120 ? message.substring(0, 117) + "..." : message;

    return (
        <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.5rem'
            }}>
                <strong style={{ color: '#2c3e50', fontSize: '1.1rem' }}>🤖 Agent:</strong>
                <ConfidenceIndicator confidence={confidence} />
            </div>
            <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.5',
                color: '#34495e',
                wordBreak: 'break-word'
            }}>
                {truncatedMessage}
            </p>
        </div>
    );
};

export default AgentResponse;