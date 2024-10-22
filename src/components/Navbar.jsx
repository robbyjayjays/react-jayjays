import logo from '../assets/image/jayjays.png';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const linkClass = ({ isActive }) => isActive ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2' : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
    const userEmail = localStorage.getItem('email');

    // Handle logout function
    const handleLogout = () => {
        // Remove token and any other user-related data
        localStorage.removeItem('token');
        localStorage.removeItem('email');

        // Redirect to the login page
        navigate('/', { replace: true });
    };

    return (
        <nav className="bg-indigo-700 border-b border-indigo-500">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
                <div
                className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
                >
                <NavLink className="flex flex-shrink-0 items-center mr-4" to="/homepage">
                    <img
                    className="h-10 w-auto"
                    src= { logo }
                    alt="JAYJAYS"
                    />
                </NavLink>
                <div className="md:ml-auto">
                    <div className="flex space-x-2">
                    <NavLink
                        to="/homepage"
                        className={linkClass}
                        >Home</NavLink
                    >
                    <NavLink
                        to="/jobs"
                        className={linkClass}
                        >Jobs</NavLink
                    >
                    <NavLink
                        to="/add-job"
                        className={linkClass}
                        >Add Job</NavLink
                    >
                    <NavLink
                        to="/"
                        className={linkClass}
                        onClick={handleLogout}
                        >Log Out</NavLink
                    >
                    <NavLink
                        to="/user"
                        className={linkClass}
                        >{userEmail ? `${userEmail}` : ''}</NavLink
                    >
                    </div>
                </div>
                </div>
            </div>
            </div>
        </nav>
    )
};
export default Navbar