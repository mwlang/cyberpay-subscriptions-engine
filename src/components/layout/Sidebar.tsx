
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CreditCard, Users, RefreshCcw, Clock, AlertCircle } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-slate-100",
        active ? "bg-slate-100 text-payment-primary" : "text-slate-600"
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Transactions",
      href: "/transactions"
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Customers",
      href: "/customers"
    },
    {
      icon: <RefreshCcw className="h-5 w-5" />,
      label: "Subscriptions",
      href: "/subscriptions"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Payment History",
      href: "/payment-history"
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      label: "Failed Payments",
      href: "/failed-payments"
    }
  ];

  return (
    <div className="h-full border-r bg-white w-64 flex-shrink-0">
      <div className="flex flex-col h-full p-4">
        <div className="space-y-1 mt-4">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              active={pathname === route.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
