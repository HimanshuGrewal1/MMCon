import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Landingpage";
import SignupPage from "./Pages/SignupPage";
import ResetPassword from "./Pages/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
