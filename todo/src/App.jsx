import React, { useState } from "react";
import Home from "./Home/Home";
import Register from './Register/Register';
import Login from './Login';
import { useAuth } from "./AuthContext";

const App = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="App">
        {user ? (
          <Home />
        ) : showLogin ? (
          <Login switchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register switchToLogin={() => setShowLogin(true)} />
        )}
    </div>
  );
};

export default App;
