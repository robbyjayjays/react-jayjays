import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobListings from '../components/JobListings'

const JobsPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    // If no token is present, redirect to the login page
    if (!token) {
        navigate('/');  // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
   <section className="bg-blue-50 px-4 py-6"><JobListings /></section> 
  )
}

export default JobsPage