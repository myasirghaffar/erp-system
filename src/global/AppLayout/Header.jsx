import {
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { persistor } from "../../store";
import { useGetDriverAlertReminderQuery } from "../../services/driver/driverApi";
import {
  SearchIconHeader,
  SettingsIconHeader,
  NotificationIconHeader,
} from "../../assets/icons/icons";
import Perfil from "../../assets/images/Perfil.jpg";

function Header({ toggleSidebar }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const { data: alertsData } = useGetDriverAlertReminderQuery();
  const unreadCount =
    alertsData?.data?.alerts?.filter((alert) => !alert.read)?.length || 0;

  return (
    <header className="bg-white z-10 text-gray-800 md:ml-64 md:w-[calc(100%-16rem)] shadow-[0px_4px_5px_0px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 h-24">
        {/* Left Side - Menu and Search Bar */}
        <div className={`flex items-center gap-4 ${isSearchOpen ? "flex-1" : ""}`}>
          {/* Mobile Menu Button - Now on Left */}
          <button
            onClick={toggleSidebar}
            className="block md:hidden text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className={`${isSearchOpen ? "flex" : "hidden md:flex"} relative w-full md:w-80 h-10 shadow-[0px_4px_5.2px_0px_rgba(0,0,0,0.11)] rounded-[10px]`}>
            <div className="absolute inset-0 bg-white rounded-[10px] border border-black/10" />
            <div className="absolute left-[20px] top-[10px] flex items-center justify-center">
              <SearchIconHeader className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search"
              autoFocus={isSearchOpen}
              className="absolute left-[42px] top-0 h-full w-[calc(100%-42px)] bg-transparent text-slate-400 text-xs font-normal font-['DM_Sans'] leading-5 outline-none border-none focus:ring-0 placeholder-slate-400"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>

        {/* Right Side - Actions and Profile */}
        <div className={`flex items-center gap-2 md:gap-4 ${isSearchOpen ? "hidden md:flex" : "flex"}`}>
          {/* Search Toggle Button - Now on Right for Mobile */}
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden flex items-center justify-center"
            >
              <SearchIconHeader className="w-5 h-5" />
            </button>
          )}

          {/* Settings Button */}
          <button className="w-11 h-10 relative bg-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <SettingsIconHeader className="w-5 h-5" />
          </button>

          {/* Notification Button */}
          <button className="w-12 h-9 relative bg-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <NotificationIconHeader className="w-5 h-5" />
              {/* Notification Dot */}
              <div className="absolute top-[3px] right-[6px]">
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3.36842C0 1.50809 1.50809 0 3.36842 0C5.22875 0 6.73684 1.50809 6.73684 3.36842C6.73684 5.22875 5.22875 6.73684 3.36842 6.73684C1.50809 6.73684 0 5.22875 0 3.36842Z" fill="#1B84C5" />
                </svg>
              </div>
            </div>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 ml-2">
            <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
              <img src={Perfil} alt="User Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
