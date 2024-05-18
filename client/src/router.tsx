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
} from '@/pages';
import { RootLayout, AuthLayout, Layout } from '@/layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      <Route path="" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset" element={<ResetPage />} />
        <Route path="new-password" element={<NewPasswordPage />} />
        <Route path="new-verification" element={<NewVerificationPage />} />
      </Route>
    </Route>
  )
);

export { router };
