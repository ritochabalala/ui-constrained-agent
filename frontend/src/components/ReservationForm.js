import React, { useState } from 'react';

const ReservationForm = ({ sessionData, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const getCurrentInputType = () => {
        if (sessionData?.current_step === 'date') return 'date';
        if (sessionData?.current_step === 'time') return 'time';
        return 'text';
    };

    const getPlaceholder = () => {
        const placeholders = {
            party_size: 'Number of guests (1-20)',
            date: 'Select date (YYYY-MM-DD)',
            time: 'Select time (HH:MM)',
            name: 'Your full name',
            phone: 'Your phone number'
        };
        return placeholders[sessionData?.current_step] || 'Enter your response';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        onSubmit(inputValue, sessionData?.current_step);
        setInputValue('');
    };

    const handleConfirm = (choice) => {
        onSubmit(choice, 'confirmation');
    };

    if (sessionData?.current_step === 'confirmation') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem'
            }}>
                <button
                    onClick={() => handleConfirm('yes')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#27ae60'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2ecc71'}
                >
                    ✅ Confirm
                </button>
                <button
                    onClick={() => handleConfirm('no')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                    ❌ Cancel
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '1rem',
            padding: '1.5rem',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <input
                type={getCurrentInputType()}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getPlaceholder()}
                style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
                autoFocus
            />
            <button
                type="submit"
                style={{
                    padding: '0.75rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
                ➤ Submit
            </button>
        </form>
    );
};

export default ReservationForm;