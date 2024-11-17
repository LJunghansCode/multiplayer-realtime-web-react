// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { authenticateUser } from "./auth";
import Home from "./Home";
import GameRoom from "./components/GameRoom";

const App: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    authenticateUser()
      .then(() => {
        setIsAuthenticating(false);
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        // Optionally handle errors (e.g., show an error message)
      });
  }, []);

  if (isAuthenticating) {
    return <div>Authenticating...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
