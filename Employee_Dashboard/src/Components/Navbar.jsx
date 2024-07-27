import React from 'react';
import { Link } from 'react-router-dom';
import '/Navbar.css';

const Navbar = ({ loggedIn, logout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {/* it the ternary operator if user loggedin means the navbar look like Home Employee and Logout button 
                                      else the navbar look like signup and login button  */}
        {!loggedIn ? (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/employee_list">Employee</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
