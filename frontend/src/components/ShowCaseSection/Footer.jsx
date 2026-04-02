import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Guitar, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Music, 
  Headphones, 
  Award, 
  Truck 
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Returns & Refunds', path: '/returns' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const categories = [
    { name: 'Electric Guitars', path: '/shop?category=electric' },
    { name: 'Acoustic Guitars', path: '/shop?category=acoustic' },
    { name: 'Bass Guitars', path: '/shop?category=bass' },
    { name: 'Accessories', path: '/shop?category=accessories' },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold italic text-neutral-900 dark:text-neutral-50 mb-2">
                Stay in Rhythm
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Subscribe to get special offers, new releases, and exclusive content.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-neutral-900 dark:text-neutral-50 min-w-[250px]"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <Heart className="text-red-500" size={28} fill="currentColor" />
              <span className="text-2xl font-bold italic text-neutral-900 dark:text-neutral-50 tracking-tighter">
                Heart Rhythm
              </span>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              Your ultimate destination for premium guitars and musical instruments. Find your perfect rhythm with us.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-headline font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <ArrowUpRight size={16} className="text-red-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200 text-sm group inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-headline font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <Music size={16} className="text-red-500" />
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200 text-sm group inline-flex items-center gap-1"
                  >
                    {category.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-headline font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <Headphones size={16} className="text-red-500" />
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200 text-sm group inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-headline font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <Guitar size={16} className="text-red-500" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span>123 Music Avenue, Nashville, TN 37201, USA</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Phone size={16} className="text-red-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-red-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail size={16} className="text-red-500 flex-shrink-0" />
                <a href="mailto:info@heartrhythm.com" className="hover:text-red-500 transition-colors">
                  info@heartrhythm.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Truck className="text-red-500" size={24} />
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">Free Shipping</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-red-500" size={24} />
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">Quality Guarantee</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">Premium instruments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Headphones className="text-red-500" size={24} />
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">24/7 Support</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">Dedicated assistance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="text-red-500" size={24} />
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">Secure Payments</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {currentYear} Heart Rhythm. All rights reserved. Made with <Heart size={12} className="inline text-red-500" fill="currentColor" /> for music lovers.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;