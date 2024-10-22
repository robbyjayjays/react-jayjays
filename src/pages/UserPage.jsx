import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarker } from 'react-icons/fa';
import profileImage from '../assets/image/profile.png';
import { toast, ToastContainer } from 'react-toastify';  // Import toast functions and container
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toasts



const UserPage = () => {
    const userEmail = localStorage.getItem('email');
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        // If no token is present, redirect to the login page
        if (!token) {
            toast.error('You are no longer logged in');
            navigate('/');  // Redirect to login if not authenticated
        }
    }, [navigate]);
  return (
    <>
    <ToastContainer />
    <section>
        <div className="container m-auto py-6 px-6">
            <Link
                to="/homepage"
                className="text-indigo-500 hover:text-indigo-600 flex items-center"
            >
                <FaArrowLeft className="mr-2" /> Back to Homepage
            </Link>
        </div>
    </section>

    <div className="min-h-screen flex items-start justify-center bg-indigo-50">
        {/* White box container */}
        <div className="bg-white w-full max-w-6xl p-8 rounded-lg shadow-md mt-10">
            
            {/* Profile Image inside the white box */}
            <div className="block mb-8 text-center">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full w-64 h-64 object-cover mx-auto"
                />
            </div>

            {/* Tabs */}
            <div className="flex justify-between border-b mb-6">
                <button
                    className={`py-2 px-4 text-lg ${activeTab === 'profile' ? 'border-b-2 border-indigo-500 font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile Info
                </button>
                <button
                    className={`py-2 px-4 text-lg ${activeTab === 'facturen' ? 'border-b-2 border-indigo-500 font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('facturen')}
                >
                    Invoices
                </button>
                <button
                    className={`py-2 px-4 text-lg ${activeTab === 'settings' ? 'border-b-2 border-indigo-500 font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            {/* Tab Content */}
            <div className="py-6">
                {activeTab === 'profile' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                        <div className="flex items-center">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="rounded-full w-32 h-32 object-cover mr-6"
                            />
                            <div>
                                <p>Name: Jane Doe</p>
                                <p>Email: {userEmail}</p>
                                <p>Phone: +1234567890</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'facturen' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Facturen</h3>
                        <p>You currently have no invoices.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Settings</h3>
                        <p>Here you can adjust your account settings.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
</>
  )
}

export default UserPage