import { useState } from 'react';

const messages = [
  'Learn React ⚛️',
  'Apply for jobs 💼',
  'Invest your new income 🤑',
];

function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // Event handlers belong inside the components as they need to access the state
  function handleNext() {
    if (step < 3) {
      setStep((s) => {
        return s + 1;
      });
    }
  }

  function handlePrevious() {
    if (step > 1) {
      setStep((s) => {
        return s - 1;
      });
    }
  }

  return (
    <>
      <button className="close" onClick={() => setIsOpen((isOpen) => !isOpen)}>
        &times;
      </button>
      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 ? 'active' : ''}>1</div>
            <div className={step >= 2 ? 'active' : ''}>2</div>
            <div className={step >= 3 ? 'active' : ''}>3</div>
          </div>

          <Message step={step} text={messages[step - 1]} />

          <div className="buttons">
            <button
              style={{ backgroundColor: '#7950f2', color: '#ffffff' }}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              style={{ backgroundColor: '#7950f2', color: '#ffffff' }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Message(props) {
  return (
    <p className="message">
      Step {props.step}: {props.text}
    </p>
  );
}
export default App;
