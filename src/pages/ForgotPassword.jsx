import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        toast.error('Email not found. Please try again.');
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
                Forgot Password
              </h2>

              <div className='mb-4'>
                <label
                  htmlFor='email'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  className='border rounded w-full py-2 px-3'
                  placeholder='Enter your email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default ForgotPasswordPage;
