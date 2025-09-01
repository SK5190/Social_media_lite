import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await registerUser(data);
      setMessage(response.data.message);
      navigate('/login'); // Redirect to login page on successful registration
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4 sm:p-6 h-full">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className={`shadow-sm appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Choose a username"
              {...register('username')}
            />
            {errors.username && <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>}
          </div>
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`shadow-sm appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="********"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-5 sm:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className={`shadow-sm appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="********"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword.message}</p>}
          </div>
          {message && (
            <div className={`mb-4 text-center text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 mt-5 sm:mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-5 sm:px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <a className="inline-block align-baseline font-semibold text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out" href="/login">
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
