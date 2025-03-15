import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import History from "./components/History";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Profile from "./components/Profile";
import { ThemeProvider } from "./context/ThemeContext";

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
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
