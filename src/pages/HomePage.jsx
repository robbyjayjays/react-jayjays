import Hero from '../components/Hero'
import HomeCards from '../components/HomeCards';
import JobListings from '../components/JobListings';
import ViewAllJobs from '../components/ViewAllJobs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';  // Import toast functions and container
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toasts

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');

        // If no token is present, redirect to the login page
        if (!token) {
            toast.error('You are not logged in!');
            navigate('/login');  // Redirect to login if not authenticated
        }
    }, [navigate]);

    return (
        <>
            <Hero title="Become a JAYJAYS partner." subtitle="High quality websites for low prices"/>
            <HomeCards />
            <JobListings isHome={true}/>
            <ViewAllJobs />
        </>
    );
};

export default HomePage