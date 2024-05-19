import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ResetPage,
  NewPasswordPage,
  NewVerificationPage,
  ContactPage,
  BlogPage,
  AboutPage,
  NotFoundPage,
  SettingsPage,
  AppearancePage,
  SocialProfilePage,
  NotificationsPage,
  DeleteAccountPage,
} from '@/pages';
import { RootLayout, AuthLayout, Layout, SettingsLayout } from '@/layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Root */}
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Settings */}
      <Route path="/settings" element={<SettingsLayout />}>
        <Route path="" element={<SettingsPage />} />
        <Route path="general" element={<SettingsPage />} />
        <Route path="appearance" element={<AppearancePage />} />
        <Route path="social-profiles" element={<SocialProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="delete-account" element={<DeleteAccountPage />} />
      </Route>

      {/* Auth */}
      <Route path="" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset" element={<ResetPage />} />
        <Route path="new-password" element={<NewPasswordPage />} />
        <Route path="new-verification" element={<NewVerificationPage />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export { router };
