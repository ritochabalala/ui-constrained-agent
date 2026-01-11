import React from 'react';
// import './TaskProgress.css';

const steps = [
    { id: 'greeting', label: 'Start' },
    { id: 'party_size', label: 'Guests' },
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'name', label: 'Name' },
    { id: 'phone', label: 'Contact' },
    { id: 'confirmation', label: 'Confirm' },
    { id: 'completed', label: 'Done' }
];

const TaskProgress = ({ progress, currentStep }) => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className="task-progress">
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="steps">
                {steps.map((step, index) => {
                    let stepClass = 'step';

                    if (index <= currentStepIndex) {
                        stepClass += ' completed';
                    }

                    if (index === currentStepIndex) {
                        stepClass += ' current';
                    }

                    return (
                        <div key={step.id} className={stepClass}>
                            <div className="step-marker">{index + 1}</div>
                            <div className="step-label">{step.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskProgress;