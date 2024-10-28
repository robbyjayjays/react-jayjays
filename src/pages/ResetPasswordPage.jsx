import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Get token from the URL
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token'); // assuming the token is passed as a query parameter

  console.log(token)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        toast.success('Password reset successfully!');
        // Redirect to login or another page after a successful reset
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error('Failed to reset password. The token may be invalid or expired.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <section className='bg-indigo-50'>
        <div className='container m-auto max-w-md py-24'>
          <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
            <form onSubmit={handleSubmit}>
              <h2 className='text-3xl text-center font-semibold mb-6'>
                Reset Password
              </h2>

              <div className='mb-4'>
                <label
                  htmlFor='password'
                  className='block text-gray-700 font-bold mb-2'
                >
                  New Password
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  className='border rounded w-full py-2 px-3'
                  placeholder='Enter your new password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className='mb-4'>
                <label
                  htmlFor='confirmPassword'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Confirm Password
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  className='border rounded w-full py-2 px-3'
                  placeholder='Confirm your new password'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default ResetPasswordPage;
