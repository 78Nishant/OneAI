import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import History from "./components/History";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Profile from "./components/Profile";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
