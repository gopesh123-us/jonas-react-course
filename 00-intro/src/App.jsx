import { useState } from "react";
function App() {
  const [name, setName] = useState("React Learner");
  return (
    <main>
      <h1>Welcome to React Learning Lab</h1>
      <p>Hello, {name}!</p>
      <button onClick={() => setName("Gopesh")}>Personalize Greeting</button>
      <button onClick={() => setName("React Learner")}>Reset Greeting</button>
    </main>
  );
}

export default App;
