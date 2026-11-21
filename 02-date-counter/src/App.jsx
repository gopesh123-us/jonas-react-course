import { useState } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + count);

  return (
    <>
      <Step step={step} setStep={setStep} />
      <Counter count={count} step={step} setCount={setCount} />
      <TodayDate date={date} count={count} />
    </>
  );
}

function Step({ step, setStep }) {
  function handleStepDecrement() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleStepIncrement() {
    setStep((s) => s + 1);
  }

  return (
    <div>
      <button onClick={handleStepDecrement}>-</button>
      <span className="label">Step: {step}</span>
      <button onClick={handleStepIncrement}>+</button>
    </div>
  );
}

function Counter({ count, step, setCount }) {
  function handleCountIncrement() {
    setCount((c) => c + step);
  }

  function handleCountDecrement() {
    setCount((c) => c - step);
  }

  return (
    <div>
      <button onClick={handleCountDecrement}>-</button>
      <span className="label">Count: {count}</span>
      <button onClick={handleCountIncrement}>+</button>
    </div>
  );
}

function TodayDate({ date, count }) {
  return (
    <>
      {count === 0 && (
        <p className="date label">Today is {date.toDateString()}</p>
      )}
      {count < 0 && (
        <p className="date label">
          {Math.abs(count)} day ago it was {date.toDateString()}
        </p>
      )}

      {count > 0 && (
        <p className="date label">
          {Math.abs(count)} day from now is {date.toDateString()}
        </p>
      )}
    </>
  );
}

export default App;
