import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Get token from the URL
  useEffect(() => {
    const query = new URLSearchParams(useLocation().search);
    const tokenFromUrl = query.get('token');
    
    if (tokenFromUrl) {
      console.log('Token found in URL:', tokenFromUrl); // Log token from URL
      setToken(tokenFromUrl);
    } else {
      console.error('No token found in the URL');
      toast.error('Invalid or missing token.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if token is available
    if (!token) {
      console.error('Token is missing or invalid');
      toast.error('Invalid or missing token.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.warn('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    console.log('Submitting reset password request:', {
      token,
      password,
    });

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        console.log('Password reset successful');
        toast.success('Password reset successfully!');
        // Redirect to login or another page after a successful reset
        setTimeout(() => navigate('/'), 2000);
      } else {
        console.error('Failed to reset password. Response status:', response.status);
        const data = await response.json();
        console.error('Error message from server:', data.error);
        toast.error(data.error || 'Failed to reset password. The token may be invalid or expired.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
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
