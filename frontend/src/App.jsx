import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import SignupPage from "./Pages/SignupPage";
import ResetPassword from "./Pages/ResetPassword";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import EmailVerificationPage from "./Pages/EmailVerficationPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore"
import LoadingSpinner from "./components/LoadingSpinner";
import MindMap from "./MapRender";
import { ReactFlowProvider } from "@xyflow/react";
import MindMap2 from "./MapRender2";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
    
	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};


const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	console.log("RedirectAuthenticatedUser - isAuthenticated:", isAuthenticated, "user:", user);

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/home' replace />;
	}

	return children;
};

export default function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div
				>
	
           {/* <Navbar/> */}
			<Routes>
			
          <Route path='/' element={<LandingPage />} />
        <Route
          path='/home'
          element={
             <ProtectedRoute>
              <HomePage />
             </ProtectedRoute>
          }
        />
			
				
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignupPage />
						</RedirectAuthenticatedUser>
					}
				/>
						<Route
					path='/map'
					element={
				<ReactFlowProvider>
							<MindMap />
						</ReactFlowProvider>
					}
				/>
						<Route
					path='/map2'
					element={
				<ReactFlowProvider>
							<MindMap2 />
						</ReactFlowProvider>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPassword />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</div>
	);
}

