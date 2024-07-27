import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // fetching the data from the backend url :"http://localhost:3000/employees" in this we have the employee data 
        const response = await axios.get('http://localhost:3000/employees', {
          // to access the data from the backend first u need to  login then only u can access the data we are generate the token for every user after login and the token is passing in the header
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const results = employees.filter(employee => {
      return Object.values(employee).some(value =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredEmployees(results);
  }, [search, employees]);

  const handleUpdate = (id) => {
    navigate(`/register_employee/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3000/employees/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEmployees(employees.filter(employee => employee._id !== id));
        setFilteredEmployees(filteredEmployees.filter(employee => employee._id !== id));
      } catch (error) {
        setError('Error deleting employee');
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const parseCourseData = (courseData) => {
    try {
      
      const parsedData = JSON.parse(courseData);
      return Array.isArray(parsedData) ? parsedData.join(', ') : courseData;
    } catch {
      return courseData;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Employee List</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={() => navigate('/register_employee')}>Add Employee</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Unique ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Current Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id}>
              {/* we have Unique ID for every row there is id with index+1 like 1,2,3,4..... */}
              <td>{index + 1}</td> 
              <td>
                {employee.image ? (
                  <img
                    src={`http://localhost:3000/${employee.image}`}
                    alt="Employee"
                    className="employee-image"
                    style={{ height: '100px', width: '100px' }}
                  />
                ) : 'No image'}
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobileNumber}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{parseCourseData(employee.course)}</td> 
              <td>
                {employee.currentDate
                  ? (() => {
                      // debugging for date format
                      console.log("Current Date:", employee.currentDate);
                      const date = new Date(employee.currentDate);
                      return !isNaN(date.getTime()) // date is valid or not checking
                        ? date.toLocaleDateString('en-GB')
                        : 'Invalid Date';
                    })()
                    // not valid means log No Date
                  : '27/7/2024'}
              </td>
              <td>
                {/* here the button to update the employee data by using the id */}
                <button className="update-button" onClick={() => handleUpdate(employee._id)}>Update</button>
                {/* delete the data from the table  */}
                <button className="delete-button" onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
