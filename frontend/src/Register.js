import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:3001/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      alert('Registration successful!');

      // Optional: Clear form after registration
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: ''
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Customer Registration</h2>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
      <input name="address" placeholder="Shipping Address" value={formData.address} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
