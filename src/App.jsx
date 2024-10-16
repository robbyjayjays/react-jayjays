import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import LoginPage from './pages/LoginPage';

const App = () => {

  // Define routes
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />, // The LoginPage is separate, not wrapped by MainLayout
      index: true,
    },
    {
      path: '/',
      element: <MainLayout />, // All other pages are wrapped by MainLayout
      children: [
        { path: 'homepage', element: <HomePage isHome={true} /> },
        { path: 'jobs', element: <JobsPage isHome={false} /> },
        { path: 'add-job', element: <AddJobPage /> },
        { path: 'edit-job/:id', element: <EditJobPage /> },
        { path: 'job/:id', element: <JobPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
