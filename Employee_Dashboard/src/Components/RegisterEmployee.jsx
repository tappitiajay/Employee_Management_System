import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import './RegisterEmployee.css';

const RegisterEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // fetch employee details for update
      const fetchEmployee = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/employees/data/${id}`, {
            // here we are passing the JWT token in header for security 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const emp = response.data;
          setEmployee(emp);
          setName(emp.name);
          setEmail(emp.email);
          setMobileNumber(emp.mobileNumber);
          setDesignation(emp.designation);
          setGender(emp.gender);
          setCourse(emp.course);
        } catch (error) {
          setError('Error fetching employee details');
          //Debugging 
          console.error('Error fetching employee:', error); 
        }
      };
      // invoking the function
      fetchEmployee();
    }
  }, [id]);

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCourse([...course, value]);
    } else {
      setCourse(course.filter(c => c !== value));
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    designation: Yup.string().required('Designation is required'),
    gender: Yup.string().required('Gender is required'),
    course: Yup.array().min(1, 'At least one course is required')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobileNumber', mobileNumber);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('course', JSON.stringify(course));

    if (image) {
      formData.append('image', image);
    }

    try {
      await validationSchema.validate(
        { name, email, mobileNumber, designation, gender, course },
        { abortEarly: false }
      );

      if (id) {
        // Update employee details
        await axios.put(`http://localhost:3000/employees/update/${id}`, formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new employee details
        await axios.post('http://localhost:3000/CreateEmployee', formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      navigate('/employee_list');
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errorMessages = err.inner.reduce((acc, currentError) => {
          acc[currentError.path] = currentError.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      } else {
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          setError('Error saving employee');
          console.error('Error saving employee:', err);
        }
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>{id ? 'Update Employee' : 'Add Employee'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        {errors.name && <p>{errors.name}</p>}
        
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {errors.email && <p>{errors.email}</p>}
        
        <label>Mobile Number:</label>
        <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
        {errors.mobileNumber && <p>{errors.mobileNumber}</p>}
        
        <label>Designation:</label>
        <select value={designation} onChange={(e) => setDesignation(e.target.value)} required>
          <option value="">Select</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        {errors.designation && <p>{errors.designation}</p>}
        
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p>{errors.gender}</p>}
        
        <label>Course:</label>
        <div>
          <input type="checkbox" value="MCA" checked={course.includes('MCA')} onChange={handleCourseChange} /> MCA
          <input type="checkbox" value="BCA" checked={course.includes('BCA')} onChange={handleCourseChange} /> BCA
          <input type="checkbox" value="BSC" checked={course.includes('BSC')} onChange={handleCourseChange} /> BSC
        </div>
        {errors.course && <p>{errors.course}</p>}
        
        <label>Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        
        <button type="submit">{id ? 'Update' : 'Add'}</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterEmployee;
