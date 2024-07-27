import React from 'react';
import './Home.css';

function Home(){
    return (
        <div>
            <header>
                <h1>Welcome to the Employee Management System</h1>
            </header>
            <main>
                <section>
                    <p>
                        Welcome to the Employee Management System, your one-stop solution for managing employee
                        information efficiently. Our platform allows you to easily maintain and access vital employee
                        details, ensuring seamless management of your workforce.
                    </p>
                    <p>In this application, you can store and manage various employee data, including:</p>
                    <ul>
                        <li><strong>Name</strong>: The full name of the employee.</li>
                        <li><strong>Email</strong>: The employee's professional email address.</li>
                        <li><strong>Phone Number</strong>: The contact number for direct communication.</li>
                        <li><strong>Designation</strong>: The current job title or position of the employee within the company.</li>
                        <li><strong>Gender</strong>: The gender identity of the employee.</li>
                        <li><strong>Course</strong>: Any courses or training programs the employee has completed.</li>
                        <li><strong>Image</strong>: A profile picture for easy identification.</li>
                    </ul>
                    <p>
                        Whether you're a manager looking to keep track of your team's qualifications or an HR professional ensuring accurate records, our system is designed to support your needs. We strive to provide a robust and intuitive platform that enhances your operational efficiency and helps you focus on what truly matters – your employees.
                    </p>
                    <p>Thank you for choosing our Employee Management System. We look forward to supporting your journey in effective employee management.</p>
                </section>
            </main>
        </div>
    );
};

export default Home;
