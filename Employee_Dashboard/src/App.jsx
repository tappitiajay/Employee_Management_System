import { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import EmployeeList from './Components/EmployeeList';
import Home from './Components/Home';
import Login from './Components/Login';
import RegisterEmployee from './Components/RegisterEmployee';
import Signup from './Components/Signup';

const AppContent = () => {
  const [loggedin, setLoggedin] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoggedin(true);
  };

  const handleLogout = () => {
    setLoggedin(false);
    localStorage.removeItem('token');
    navigate('/login'); //redirect to login page when logout clicked
  };

  return (
    <>
      <nav>
        <ul>
          {loggedin && (
            <li>
              <Link to="/">Home</Link>
            </li>
          )}
          {!loggedin && (
            <>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
          {loggedin && (
            <>
              <li>
                <Link to="/employee_list">Employee</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee_list" element={<EmployeeList />} />
        <Route path="/register_employee" element={<RegisterEmployee />} />
        <Route path="/register_employee/:id" element={<RegisterEmployee />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* if any unmatch url occurs it redirect to 404-not found */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
