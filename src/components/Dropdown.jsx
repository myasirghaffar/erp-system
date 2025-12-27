import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * Reusable Dropdown Component
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - The element that triggers the dropdown
 * @param {React.ReactNode} props.children - The dropdown content
 * @param {string} props.align - Alignment of dropdown: 'left' or 'right' (default: 'right')
 * @param {string} props.className - Additional classes for the dropdown container
 */
function Dropdown({ trigger, children, align = "right", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger */}
            <div onClick={toggleDropdown} className="cursor-pointer">
                {trigger}
            </div>

            {/* Dropdown Content */}
            {isOpen && (
                <div
                    className={`absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px] max-w-[320px] ${align === "left" ? "left-0" : "right-0"
                        } animate-fadeIn`}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

Dropdown.propTypes = {
    trigger: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    align: PropTypes.oneOf(["left", "right"]),
    className: PropTypes.string,
};

export default Dropdown;
