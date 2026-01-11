import React from 'react';

const ConfidenceIndicator = ({ confidence }) => {
    let color = '#2ecc71'; // green
    let label = 'High';

    if (confidence < 0.7) {
        color = '#e74c3c'; // red
        label = 'Low';
    } else if (confidence < 0.9) {
        color = '#f39c12'; // orange
        label = 'Medium';
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            color: color,
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: `${color}20`,
            border: `1px solid ${color}`
        }}>
            <span>💡 {label}</span>
            <div style={{
                height: '6px',
                width: '60px',
                backgroundColor: '#ecf0f1',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${confidence * 100}%`,
                    backgroundColor: color,
                    transition: 'width 0.3s ease'
                }}></div>
            </div>
        </div>
    );
};

export default ConfidenceIndicator;