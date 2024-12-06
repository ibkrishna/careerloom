import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import JobEdit from "./components/admin/JobEdit";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { TestHomePage } from "./components/ThomePage/ThomePage";
// import FrontendJobs from "./components/domain/FrontendJobs";
// import BackendJobs from "./components/domain/BackendJobs";
// import FullStackJobs from "./components/domain/FullStackJobs";
// import Graphicsjobs from "./components/domain/Graphicsjobs";
// import DataScienceJobs from "./components/domain/DataScienceJobs";
// import Filter from "./components/domain/Filter";
// import Header from "./components/domain/Header";
import Wishlist from "./components/Wishlist";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import Company from './components/Companies';
import SelectedJobs from './components/SelectedJobs';
import CompanyDetails from './components/CompaniesDetails';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <TestHomePage/>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
   path : "/jobs/:title" ,
   element : <SelectedJobs />,
  },
  {
    path:"/company-details/:companyName",
    element : <CompanyDetails />
  },
  {
    path: "/company",
    element: <Company/>,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword/>,
  },
  {
    path: "/resetpassword",
    element: <ResetPassword/>,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/wishlist",
    element: (
      // <ProtectedRoute>
        <Wishlist />
      // </ProtectedRoute>
    ),
  },

  // admin(Recruiter) ke liye yha se start hoga
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path:"/admin/jobs/:id/edit",
    element:(
      <ProtectedRoute>
        <JobEdit />
      </ProtectedRoute>
      )
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
