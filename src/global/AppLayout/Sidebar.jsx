"use client";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { persistor } from "../../store";
import { useTranslation } from "react-i18next";
import {
  DashboardIconNew,
  ManageEmployeeIcon,
  ManageWorkplacesIcon,
  ManageQrCodeIcon,
  ViewMapIcon,
  ApproveRequestIcon,
  AttendanceIcon,
  SettingsIconNew,
  LogoutIcon,
  XIcon,
  TeacherIcon,
} from "../../assets/icons";
import { main_logo } from "../../assets/logos";

function Sidebar({ isMobileSidebarOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [expandedMenus, setExpandedMenus] = useState({});

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSidebarOpen &&
        !event.target.closest(".sidebar-content") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        toggleSidebar();
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when mobile sidebar is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore scrolling when mobile sidebar is closed
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen, toggleSidebar]);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'admin'; // Default fallback

  const getRoleBasedMenuItems = (role) => {
    const menu = {
      admin: {
        main: [
          { path: "/admin/dashboard", name: t('sidebar.dashboard'), icon: DashboardIconNew },
          { path: "/admin/users", name: t('sidebar.manageEmployee'), icon: ManageEmployeeIcon },
          { path: "/admin/attendance", name: t('sidebar.attendance'), icon: AttendanceIcon },
          { path: "/admin/manage-workplaces", name: t('sidebar.manageWorkplaces'), icon: ManageWorkplacesIcon },
          {
            path: "/admin/manage-qr-code",
            name: t('sidebar.manageQrCode'),
            icon: ManageQrCodeIcon,
          },
          {
            path: "/admin/view-map", // Corrected path to match typical expectation for View Map
            name: t('sidebar.viewMap'),
            icon: ViewMapIcon,
          },
          {
            path: "/admin/approve-requests",
            name: t('sidebar.approveRequest'),
            icon: ApproveRequestIcon,
          },
          {
            path: "/admin/settings",
            name: t('sidebar.settings'),
            icon: SettingsIconNew,
          },
        ],
        bottom: [],
      },
      user: {
        main: [
          { path: "/user/dashboard", name: t('sidebar.dashboard'), icon: DashboardIconNew },
          { path: "/user/jobs", name: t('sidebar.manageWorkplaces'), icon: ManageWorkplacesIcon },
          { path: "/user/attendance", name: t('sidebar.attendance'), icon: AttendanceIcon },
          {
            path: "/user/bids",
            name: t('sidebar.manageQrCode'),
            icon: ManageQrCodeIcon,
          },
          {
            path: "/user/work-orders",
            name: t('sidebar.viewMap'),
            icon: ViewMapIcon,
          },
          {
            path: "/user/payments",
            name: t('sidebar.approveRequest'),
            icon: ApproveRequestIcon,
          },
        ],
        bottom: [],
      },
      contractor: {
        main: [
          {
            path: "/contractor/dashboard",
            name: t('sidebar.dashboard'),
            icon: DashboardIconNew,
          },
          {
            path: "/contractor/jobs",
            name: t('sidebar.manageWorkplaces'),
            icon: ManageWorkplacesIcon,
          },
          { path: "/contractor/attendance", name: t('sidebar.attendance'), icon: AttendanceIcon },
          {
            path: "/contractor/bids",
            name: t('sidebar.manageQrCode'),
            icon: ManageQrCodeIcon,
          },
          {
            path: "/contractor/work-orders",
            name: t('sidebar.viewMap'),
            icon: ViewMapIcon,
          },
          {
            path: "/contractor/payments",
            name: t('sidebar.approveRequest'),
            icon: ApproveRequestIcon,
          },
          {
            path: "/contractor/reports",
            name: t('sidebar.settings'),
            icon: SettingsIconNew,
          },
        ],
        bottom: [],
      },
    };
    return menu[role] || menu['admin']; // Fallback to admin if role doesn't match
  };

  const menuItems = getRoleBasedMenuItems(role);
  const finalMenuItems = menuItems;

  // Utility function to render NavLink items
  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };
  const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

  const handleClickMobile = () => {
    if (isMobile) {
      toggleSidebar(); // your custom function
    }
  };

  const toggleMenuExpansion = (parentName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [parentName]: !prev[parentName],
    }));
  };
  const renderNavLink = (item, extraClasses = "") => {
    // Check if this item should be active based on current location
    const isActive =
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");

    return (
      <div
        onClick={() => {
          handleClickMobile();
          // Navigate to the item path using React Router
          navigate(item.path);
        }}
        className={`
          flex items-center w-56 h-12 pl-4 pr-4 gap-3 group transition-all duration-200 relative rounded-lg cursor-pointer mx-auto
          ${isActive
            ? "bg-[#38bdf8] text-white shadow-sm"
            : "text-white hover:bg-white/5"
          }
          ${extraClasses}
        `}
      >
        {!item.parent && item.icon && (
          <div
            className={`w-5 h-5 flex items-center justify-center ${isActive ? "text-white" : "text-white"
              }`}
          >
            <item.icon />
          </div>
        )}
        <span className={`text-sm leading-6 font-inter ${isActive ? "font-medium" : "font-normal"}`}>
          {item.name}
        </span>
        {item.badge && (
          <span className="ml-auto bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  const renderSidebarContent = () => {
    // Group menu items by parent for nested structure
    const groupedMenuItems = {};
    const standaloneItems = [];
    const processedParents = new Set();

    finalMenuItems?.main?.forEach((item) => {
      if (item.parent) {
        if (!groupedMenuItems[item.parent]) {
          groupedMenuItems[item.parent] = [];
        }
        groupedMenuItems[item.parent].push(item);
      } else {
        standaloneItems.push(item);
      }
    });

    return (
      <div className="sidebar-content w-64 bg-[#0A2841] flex flex-col h-[100vh] relative shadow-[0px_10px_15px_0px_rgba(0,0,0,0.10)] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white/70 hover:text-white md:hidden z-50"
          >
            <XIcon size={20} />
          </button>

          {/* Brand Section */}
          <div className="py-5 px-6 flex justify-center">
            {/* Using the logo from the original code but ensuring it fits the new design if needed. 
                 The design didn't explicitly show a logo, but it's good practice to keep it. 
                 I'll keep it but maybe adjust spacing. */}
            <h1 className="text-white text-xl font-bold font-poppins tracking-wide">
              <img src={main_logo} alt="Logo" className="w-24 h-24 object-contain" />
            </h1>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4 space-y-2 mt-0">
            {/* Render items in order, checking for parent groups */}
            {finalMenuItems?.main?.map((item, index) => {
              // If this item has a parent and we haven't processed this parent yet
              if (item.parent && !processedParents.has(item.parent)) {
                processedParents.add(item.parent);
                const children = groupedMenuItems[item.parent];
                const hasActiveChild = children.some(
                  (child) =>
                    location.pathname === child.path ||
                    location.pathname.startsWith(child.path + "/")
                );
                const isExpanded = expandedMenus[item.parent];

                return (
                  <div key={`parent-${item.parent}`} className="space-y-1">
                    {/* Parent header */}
                    <div
                      onClick={() => toggleMenuExpansion(item.parent)}
                      className={`flex items-center w-56 h-12 pl-4 pr-4 gap-3 group transition-all duration-200 relative rounded-lg cursor-pointer mx-auto ${hasActiveChild
                        ? "bg-[#38bdf8] text-white"
                        : "text-white hover:bg-white/5"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center ${hasActiveChild ? "text-white" : "text-white"
                          }`}
                      >
                        <TeacherIcon />
                      </div>
                      <span className="text-base font-normal leading-6 font-inter">
                        {item.parent}
                      </span>
                      <div className="ml-auto">
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                            } ${hasActiveChild ? "text-white" : "text-white"
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Children items - only show when expanded */}
                    {isExpanded && (
                      <div className="space-y-1 mt-1">
                        {children.map((child, childIndex) => (
                          <div
                            key={`child-${item.parent}-${childIndex}`}
                            className=""
                          >
                            {renderNavLink(child, "text-sm scale-95")}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // If this is a standalone item (no parent), render it normally
              if (!item.parent) {
                return <div key={index}>{renderNavLink(item)}</div>;
              }

              // If this item has a parent but we've already processed the parent, skip it
              return null;
            })}

            {/* Bottom Navigation */}
            <div className="space-y-1 pt-4">
              {finalMenuItems?.bottom?.map((item, index) => (
                <div key={index}>{renderNavLink(item)}</div>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full h-12 pl-4 pr-4 gap-3 group transition-all duration-200 relative rounded-lg cursor-pointer text-white hover:bg-white/5"
            >
              <div className="w-5 h-5 flex items-center justify-center text-white">
                <LogoutIcon />
              </div>
              <span className="text-sm leading-6 font-normal font-inter">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - always visible on larger screens */}
      <aside className="hidden md:block mt-0 bg-[#0A2841]">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar - only visible when toggled */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Overlay when mobile sidebar is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;
