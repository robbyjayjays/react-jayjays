import React from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate(); // Assuming you're using React Router for navigation
  
    const submitForm = async (e) => {
      e.preventDefault();
      
      const loginData = {
        email,
        password,
      };
  
      console.log(loginData); // For debugging
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status}, ${errorText}`);
        }
  
        // Assuming the response contains a token or user info
        const data = await response.json();
        console.log('Login successful:', data);
  
        // Optionally save token/user info to localStorage or context
        // localStorage.setItem('token', data.token);
  
        toast.success('Login successful!');
        navigate('/homepage'); // Redirect user to the homepage after successful login
      } catch (error) {
        console.log('Login error:', error);
        toast.error('Failed to login. Please check your credentials and try again.');
      }
    };
    return (
        <>
            <section className='bg-indigo-50'>
                <div className='container m-auto max-w-md py-24'>
                    <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
                    <form onSubmit={submitForm}>
                        <h2 className='text-3xl text-center font-semibold mb-6'>Login</h2>

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

                        <div className='mb-4'>
                        <label
                            htmlFor='password'
                            className='block text-gray-700 font-bold mb-2'
                        >
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='border rounded w-full py-2 px-3'
                            placeholder='Enter your password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>

                        <div>
                        <button
                            className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                            type='submit'
                        >
                            Login
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            </section>

        </>
    );
};

export default LoginPage