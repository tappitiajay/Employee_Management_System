const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT Secret
const SECRET = 'SECr3t';

// multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb+srv://ajay8374877:83Wt5M4D7kaARp8G@cluster0.dwaghd5.mongodb.net/', {
  dbName: 'Employee_DashBoard'
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobileNumber: { type: String, unique: true },
  designation: String,
  gender: String,
  course: [String],
  image: String, // image file path
});

// creating the mongoose model
const User = mongoose.model('User', userSchema);
const Employee = mongoose.model('Employee', employeeSchema);

// Middleware for JWT authentication
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// user signup 
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    // if user name already exits status is 403
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

// userlogin 
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

// token verification 
app.get('/verifyToken', authenticateJwt, (req, res) => {
  res.status(200).json({ username: req.user.username });
});

// creating the employee details  with authentication
app.post('/CreateEmployee', authenticateJwt, upload.single('image'), async (req, res) => {
  try {
    const { name, email, mobileNumber, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : null;

    const existingEmail = await Employee.findOne({ email });
    const existingNumber = await Employee.findOne({ mobileNumber });

    if (existingEmail) {
      // in the register process the employee email already exits means throw error 
      return res.status(401).json({ message: "Email already exists" });
    } else if (existingNumber) {
      // in the register process the employee mobilenumber already exits means throw error
      return res.status(401).json({ message: "Phone number already exists" });
    }

    const newEmployee = new Employee({ name, email, mobileNumber, designation, gender, course, image });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error.message);
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
});

// getting the detials of the employee in json format
app.get('/employees', authenticateJwt, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error retrieving employees:', error.message);
    res.status(500).json({ message: 'Error retrieving employees', error: error.message });
  }
});

app.get('/employees/data/:id', authenticateJwt, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error retrieving employee:', error.message);
    res.status(500).json({ message: 'Error retrieving employee', error: error.message });
  }
});

// updating the employee details in the database by using id
app.put('/employees/update/:id', authenticateJwt, upload.single('image'), async (req, res) => {
  try {
    const { name, email, mobileNumber, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : null;

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { name, email, mobileNumber, designation, gender, course, image }, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error.message);
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});


// deleting the employee details form the database by using id
app.delete('/employees/delete/:id', authenticateJwt, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (deletedEmployee.image) {
      fs.unlink(deletedEmployee.image, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error.message);
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
