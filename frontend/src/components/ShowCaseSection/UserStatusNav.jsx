import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from './Buttons';
import { AlertCircle, Clock, Shield, X, XCircle, HelpCircle } from 'lucide-react';

const UserStatusNav = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user.status === 'active') return null;

  const getStatusConfig = () => {
    if (user?.isBlocked) {
      return {
        bg: 'bg-gradient-to-r from-red-600 to-red-700',
        icon: <XCircle className="w-5 h-5" />,
        title: 'Account Blocked',
        message: 'Your account has been blocked. Please contact support for assistance.',
        buttonText: 'Contact Support',
      };
    }
    
    if (user?.status === 'pending') {
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        icon: <Clock className="w-5 h-5 animate-pulse" />,
        title: 'Pending Approval',
        message: user?.role === 'seller' 
          ? 'Your seller account is pending review. We\'ll notify you within 48 hours.'
          : 'Please verify your email to activate your account.',
        buttonText: 'Contact Support',
      };
    }
    
    if (user?.status === 'review') {
      return {
        bg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
        icon: <AlertCircle className="w-5 h-5 animate-bounce" />,
        title: 'Under Review',
        message: 'Your account is under review. You\'ll receive an update soon.',
        buttonText: 'Check Status',
      };
    }
    
    return null;
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`${config.bg} text-white sticky top-0 z-40 shadow-lg mt-10`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {config.icon}
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                {config.title}
              </p>
              <p className="text-xs sm:text-sm text-white/90">
                {config.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              text={config.buttonText}
              size="sm"
              variant="white"
              onClick={() => window.location.href = '/contact'}
            />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatusNav;