import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ResetPage from './pages/auth/Reset';
import NewPasswordPage from './pages/auth/NewPassword';
import NewVerificationPage from './pages/auth/NewVerification';
import RootLayout from './pages/RootLayout';
import AuthLayout from './pages/auth/AuthLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<HomePage />} />
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset" element={<ResetPage />} />
        <Route path="new-password" element={<NewPasswordPage />} />
        <Route path="new-verification" element={<NewVerificationPage />} />
      </Route>
    </>
  )
);

export { router };
