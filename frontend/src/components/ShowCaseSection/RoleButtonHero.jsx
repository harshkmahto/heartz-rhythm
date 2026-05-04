import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleButtonHero = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  const isSeller = user?.role === 'seller' || user?.sellerPanel !== undefined;
  
  if (!user || (!isAdmin && !isSeller)) {
    return null;
  }

  const buttons = isAdmin 
    ? [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Package, label: "Products", path: "/admin/products" },
        { icon: ShoppingBag, label: "Orders", path: "/admin/orders" }
      ]
    : [
        { icon: Store, label: "Dashboard", path: "/seller" },
        { icon: Package, label: "Products", path: "/seller/products" },
        { icon: ShoppingBag, label: "Orders", path: "/seller/orders" }
      ];

  return (
    <div className="py-9 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Join Cards Container - NO GAPS */}
        <div className='flex justify-center items-center'>
          {buttons.map((button, index) => (
            <Link
              key={index}
              to={button.path}
              className={`
                w-40 h-40 flex flex-col items-center justify-center gap-3 
                transition-all duration-300 hover:scale-105
                ${isAdmin ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                ${index === 0 ? 'rounded-l-xl' : ''}
                ${index === buttons.length - 1 ? 'rounded-r-xl' : ''}
                ${index !== 0 ? 'border-l border-white/20' : ''}
              `}
            >
              <button.icon className="w-8 h-8 text-white" />
              <span className="text-white font-semibold">
                {button.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleButtonHero;