import { Mail, MapPin, Phone, Trash, User } from 'lucide-react';

// Navigation links for the header
export const NAV_LINKS = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Blog',
    path: '/blog',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

// Footer information sections
export const FOOTER_INFOS = [
  {
    title: 'Company',
    links: [
      { title: 'Feedback', link: '/feedback' },
      { title: 'Partnership', link: '/partnership' },
      { title: 'Terms and Conditions', link: '/terms-and-conditions' },
    ],
  },
  {
    title: 'Our Offerings',
    links: [
      { title: 'Products', link: '/products' },
      { title: 'Solutions', link: '/solutions' },
      { title: 'Consulting', link: '/consulting' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { title: 'Join Our Community', link: '/community' },
      { title: 'Contribute', link: '/contribute' },
    ],
  },
  {
    title: 'Connect with Us',
    links: [
      { title: 'Follow Us', link: '/social-media' },
      { title: 'Newsletter', link: '/newsletter' },
    ],
  },
];

// Footer contact information with icons
export const FOOTER_CONTACTS = [
  { title: 'diwashb999@gmail.com', link: 'mailto:<EMAIL>', icon: Mail },
  { title: '+ 977 9863447740', link: 'tel:+91 9876543210', icon: Phone },
  { title: 'Rudramati Marg, Handigaun-05, Kathmandu', link: '/', icon: MapPin },
];

// Settings Options
export const SETTINGS_OPTIONS = [
  {
    icon: User,
    label: 'General',
    link: 'general',
  },
  {
    icon: Trash,
    label: 'Delete Account',
    link: 'delete-account',
  },
];
