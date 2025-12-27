import {
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../../store/slices/authSlice";
import { persistor } from "../../store";
import { useGetDriverAlertReminderQuery } from "../../services/driver/driverApi";
import {
  SearchIconHeader,
  SettingsIconHeader,
  NotificationIconHeader,
  GlobeIcon,
  UserCircleIcon,
  LogOutIcon,
  ToggleOnIcon,
  ToggleOffIcon,
} from "../../assets/icons/icons";
import Perfil from "../../assets/images/Perfil.jpg";
import Dropdown from "../../components/Dropdown";

function Header({ toggleSidebar }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Sync selected language with i18n
  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

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

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  const { data: alertsData } = useGetDriverAlertReminderQuery();
  const unreadCount =
    alertsData?.data?.alerts?.filter((alert) => !alert.read)?.length || 0;

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New Employee Added",
      message: "John Doe has been added to the system",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Attendance Report",
      message: "Monthly attendance report is ready",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "System Update",
      message: "System will be updated tonight",
      time: "2 hours ago",
      read: true,
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "cs", name: "Čeština", flag: "🇨🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
  ];

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
              placeholder={t('common.search')}
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

          {/* Language Selector Dropdown */}
          <Dropdown
            trigger={
              <button className="w-11 h-10 relative bg-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <GlobeIcon className="w-5 h-5 text-gray-600" />
              </button>
            }
            align="right"
          >
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                {t('header.selectLanguage')}
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors ${selectedLanguage === lang.code ? "bg-blue-50" : ""
                    }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`text-sm ${selectedLanguage === lang.code ? "text-blue-600 font-medium" : "text-gray-700"
                    }`}>
                    {lang.name}
                  </span>
                  {selectedLanguage === lang.code && (
                    <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Settings Dropdown */}
          <Dropdown
            trigger={
              <button className="w-11 h-10 relative bg-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <SettingsIconHeader className="w-5 h-5" />
              </button>
            }
            align="right"
          >
            <div className="py-2 min-w-[280px]">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                {t('header.quickSettings')}
              </div>

              {/* Notifications Toggle */}
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">{t('header.notificationsEnabled')}</div>
                    <div className="text-xs text-gray-500">{t('header.notificationsDesc')}</div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="ml-3"
                  >
                    {notificationsEnabled ? (
                      <ToggleOnIcon className="w-11 h-6" />
                    ) : (
                      <ToggleOffIcon className="w-11 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Email Notifications Toggle */}
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">{t('header.emailAlerts')}</div>
                    <div className="text-xs text-gray-500">{t('header.emailAlertsDesc')}</div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className="ml-3"
                  >
                    {emailNotifications ? (
                      <ToggleOnIcon className="w-11 h-6" />
                    ) : (
                      <ToggleOffIcon className="w-11 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sound Alerts Toggle */}
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">{t('header.soundAlerts')}</div>
                    <div className="text-xs text-gray-500">{t('header.soundAlertsDesc')}</div>
                  </div>
                  <button
                    onClick={() => setSoundAlerts(!soundAlerts)}
                    className="ml-3"
                  >
                    {soundAlerts ? (
                      <ToggleOnIcon className="w-11 h-6" />
                    ) : (
                      <ToggleOffIcon className="w-11 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Dropdown>

          {/* Notification Dropdown */}
          <Dropdown
            trigger={
              <button className="w-12 h-9 relative bg-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <NotificationIconHeader className="w-5 h-5" />
                  {/* Notification Dot */}
                  {unreadCount > 0 && (
                    <div className="absolute top-[3px] right-[6px]">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 3.36842C0 1.50809 1.50809 0 3.36842 0C5.22875 0 6.73684 1.50809 6.73684 3.36842C6.73684 5.22875 5.22875 6.73684 3.36842 6.73684C1.50809 6.73684 0 5.22875 0 3.36842Z" fill="#1B84C5" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            }
            align="right"
          >
            <div className="py-2 min-w-[320px] max-h-[400px] overflow-y-auto">
              <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">{t('header.notifications')}</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {t('header.newNotifications', { count: unreadCount })}
                  </span>
                )}
              </div>

              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!notification.read ? "bg-blue-50/30" : ""
                        }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.read ? "bg-blue-500" : "bg-gray-300"
                          }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-50 transition-colors font-medium">
                    {t('header.viewAllNotifications')}
                  </button>
                </>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">{t('header.noNotifications')}</p>
                </div>
              )}
            </div>
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-2.5 ml-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                  <img src={Perfil} alt="User Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            }
            align="right"
          >
            <div className="py-2 min-w-[240px]">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={Perfil} alt="User Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role || "Administrator"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                  <UserCircleIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{t('header.myProfile')}</span>
                </button>
                <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                  <SettingsIconHeader className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{t('header.accountSettings')}</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
                >
                  <LogOutIcon className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                  <span className="text-sm text-gray-700 group-hover:text-red-600">{t('header.logout')}</span>
                </button>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default Header;
