import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Bus, 
  Map, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`bg-blue-700 text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } flex flex-col`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-blue-600">
        {!collapsed && (
          <div className="text-xl font-bold flex items-center">
            <Bus className="h-6 w-6 mr-2" />
            <span>BusRoute AI</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <Bus className="h-6 w-6" />
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          <SidebarItem 
            to="/" 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            to="/routes" 
            icon={<Map />} 
            label="Route Planner" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            to="/students" 
            icon={<Users />} 
            label="Students" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            to="/buses" 
            icon={<Bus />} 
            label="Buses" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            to="/stops" 
            icon={<MapPin />} 
            label="Stops" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            to="/settings" 
            icon={<SettingsIcon />} 
            label="Settings" 
            collapsed={collapsed} 
          />
        </ul>
      </nav>

      <div className="border-t border-blue-600 p-4">
        <div className="flex items-center">
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="User"
          />
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Sarah Johnson</p>
              <p className="text-xs text-blue-200">Transportation Director</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, collapsed }) => {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
          ${isActive 
            ? 'bg-blue-800 text-white' 
            : 'text-blue-100 hover:bg-blue-600 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`
        }
      >
        <div className={`${collapsed ? '' : 'mr-3'}`}>
          {icon}
        </div>
        {!collapsed && <span>{label}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;