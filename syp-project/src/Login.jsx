import React, { useState } from 'react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [popup, setPopup] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    return newErrors;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setPopup('');
    if (isLogin) {
      const newErrors = validateLoginForm();
      if (Object.keys(newErrors).length === 0) {
        // Backend login
        try {
          const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });
          const data = await res.json();
          if (res.ok) {
            setSuccessMessage('Login successful! Welcome back.');
            setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
            setErrors({});
          } else {
            setPopup(data.error || 'Invalid email or password');
          }
        } catch (err) {
          setPopup('Server error. Please try again.');
        }
      } else {
        setErrors(newErrors);
      }
    } else {
      const newErrors = validateSignupForm();
      if (Object.keys(newErrors).length === 0) {
        // Backend register
        try {
          const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password
            })
          });
          const data = await res.json();
          if (res.ok) {
            setSuccessMessage('Account created successfully! You can now log in.');
            setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
            setErrors({});
            setTimeout(() => {
              setIsLogin(true);
              setSuccessMessage('');
            }, 2000);
          } else {
            setPopup(data.error || 'Registration failed');
          }
        } catch (err) {
          setPopup('Server error. Please try again.');
        }
      } else {
        setErrors(newErrors);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h1>
        {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-medium border border-green-300">{successMessage}</div>}
        {popup && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-semibold border border-red-400 flex items-center justify-between">
            <span>{popup}</span>
            <button className="ml-4 text-red-700 font-bold" onClick={() => setPopup('')}>x</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fullName && <span className="text-red-500 text-sm font-medium">{errors.fullName}</span>}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <span className="text-red-500 text-sm font-medium">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <span className="text-red-500 text-sm font-medium">{errors.password}</span>}
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm font-medium">{errors.confirmPassword}</span>}
            </div>
          )}
          <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-all mt-2">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={toggleForm} className="ml-2 text-indigo-600 font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-3 text-gray-400 font-medium">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 font-semibold text-gray-700 hover:bg-gray-50 transition">
            <span>🔵</span>
            <span>Sign in with Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 font-semibold text-gray-700 hover:bg-gray-50 transition">
            <span>⭐</span>
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
