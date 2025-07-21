import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import FriendsPage from "./pages/FriendsPage.jsx";

const App = () => {

  // Fetching authenticated users data by linking frontend and backend with axios
  const { isLoading, authUser } = useAuthUser();

  // Zustand: Used for themepicker in navbar. Makes the state global in all pages and simpler than redux etc
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Shows a spinning wheel while the page is loading
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className='h-screen' data-theme={theme}>
      {/* Routes to render different pages of our website */}
      <Routes>

        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          } // Only routes to homepage if authenticated and onboarded else if not authenticated then to login page else to onboarding page
        />

        <Route
          path='/signup'
          element={!isAuthenticated ?
            <SignUpPage /> :
            <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          } // Only navigates if not already signed in else if onboarded then homepage else onboarding page
        />

        <Route path='/login'
          element={!isAuthenticated ?
            <LoginPage /> :
            <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          } // Only navigates if not authenticated else if onboarded then homepage else onboarding page
        />

        <Route
          path='/notifications'
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )} // Only navigates if authenticated and onboarded else if not authenticated then to login else onboarding
        />

        <Route
          path='/friends'
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <FriendsPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )} // Only navigates if authenticated and onboarded else if not authenticated then to login else onboarding
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          } // Only navigates if authenticated and onboarded else if not authenticated login page else onboarding page
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          } // Only navigates if Authenticated and Onboarded else if not authenticated then login page else onboarding page
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          } // Only navigates if authenticated and onboarded else if not onboarded but authenticated then onboarding page else if not even authenticated then login page
        />

      </Routes>

      {/* react hot toast plugin used to show flash msgs with the use of toast.success/error etc */}
      <Toaster />
    </div>
  )
}

export default App
