import React, { useState, useCallback } from "react";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusableFilter from "../../../../components/ReusableFilter";
import ReusablePagination from "../../../../components/ReusablePagination";
import {
    Search,
    Download,
    CheckSquare,
    Eye,
    Edit3,
    Trash2
} from "lucide-react";

const itemsPerPage = 5;

// Demo Data expanded for pagination
const demoData = [
    {
        id: 1,
        name: "John Smith",
        title: "Senior Developer",
        email: "john.smith@company.com",
        phone: "+1 (555) 234-5678",
        status: "Active",
        avatar: "JS"
    },
    {
        id: 2,
        name: "Emily Davis",
        title: "Marketing Manager",
        email: "emily.davis@company.com",
        phone: "+1 (555) 234-5678",
        status: "Active",
        avatar: "ED"
    },
    {
        id: 3,
        name: "Michael Johnson",
        title: "Sales Representative",
        email: "michael.johnson@company.com",
        phone: "+1 (555) 345-6789",
        status: "Inactive",
        avatar: "MJ"
    },
    {
        id: 4,
        name: "Sarah Wilson",
        title: "UX Designer",
        email: "sarah.wilson@company.com",
        phone: "+1 (555) 456-7890",
        status: "Active",
        avatar: "SW"
    },
    {
        id: 5,
        name: "David Brown",
        title: "Financial Analyst",
        email: "david.brown@company.com",
        phone: "+1 (555) 567-8901",
        status: "Active",
        avatar: "DB"
    },
    {
        id: 6,
        name: "James Wilson",
        title: "Product Manager",
        email: "james.wilson@company.com",
        phone: "+1 (555) 678-9012",
        status: "Active",
        avatar: "JW"
    },
    {
        id: 7,
        name: "Linda Martinez",
        title: "HR Specialist",
        email: "linda.martinez@company.com",
        phone: "+1 (555) 789-0123",
        status: "Inactive",
        avatar: "LM"
    },
    {
        id: 8,
        name: "Robert Taylor",
        title: "Software Engineer",
        email: "robert.taylor@company.com",
        phone: "+1 (555) 890-1234",
        status: "Active",
        avatar: "RT"
    },
    {
        id: 9,
        name: "Jennifer Garcia",
        title: "Content Writer",
        email: "jennifer.garcia@company.com",
        phone: "+1 (555) 901-2345",
        status: "Active",
        avatar: "JG"
    },
    {
        id: 10,
        name: "William Anderson",
        title: "DevOps Engineer",
        email: "william.anderson@company.com",
        phone: "+1 (555) 012-3456",
        status: "Active",
        avatar: "WA"
    },
    {
        id: 11,
        name: "Elizabeth Thomas",
        title: "Data Scientist",
        email: "elizabeth.thomas@company.com",
        phone: "+1 (555) 123-4567",
        status: "Inactive",
        avatar: "ET"
    },
    {
        id: 12,
        name: "Christopher Jackson",
        title: "System Administrator",
        email: "christopher.jackson@company.com",
        phone: "+1 (555) 234-5678",
        status: "Active",
        avatar: "CJ"
    }
];

const filterConfig = [
    {
        key: "department",
        label: "All Departments",
        options: [
            { label: "All Departments", value: "" },
            { label: "Engineering", value: "Engineering" },
            { label: "Marketing", value: "Marketing" }
        ]
    },
    {
        key: "role",
        label: "All Roles",
        options: [
            { label: "All Roles", value: "" },
            { label: "Developer", value: "Developer" },
            { label: "Manager", value: "Manager" }
        ]
    },
    {
        key: "status",
        label: "All Status",
        options: [
            { label: "All Status", value: "" },
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" }
        ]
    }
];

const EmployeeReport = ({ onViewProfile }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(demoData);

    // Reset pagination when filter changes
    const handleFilteredDataChange = useCallback((newData) => {
        setFilteredData(newData);
        setCurrentPage(1);
    }, []);

    // Calculate pagination slice
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTableData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const columns = [
        {
            key: "selection",
            label: "",
            width: "3.75rem", // 60px
            render: () => (
                <div className="flex justify-center w-full">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer" />
                </div>
            )
        },
        {
            key: "name",
            label: "Name",
            minWidth: "18.75rem", // 300px
            grow: 1,
            render: (row) => (
                <div className="flex items-center gap-3 py-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                        {/* Avatar Image Placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-bold text-xs uppercase tracking-tighter">
                            {row.avatar}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-bold text-[0.875rem] leading-tight">{row.name}</span>
                        <span className="text-gray-400 text-[0.75rem] font-medium mt-0.5">{row.title}</span>
                    </div>
                </div>
            )
        },
        {
            key: "email",
            label: "Email",
            minWidth: "12.5rem", // 200px
            grow: 1,
            render: (row) => (
                <span className="text-[#374151] font-medium text-[0.8125rem]">{row.email}</span>
            )
        },
        {
            key: "phone",
            label: "Phone",
            minWidth: "10rem", // 160px
            render: (row) => (
                <span className="text-[#374151] font-medium text-[0.8125rem]">{row.phone}</span>
            )
        },
        {
            key: "status",
            label: "Status",
            minWidth: "7.5rem", // 120px
            render: (row) => (
                <div
                    className={`px-3.5 py-1 rounded-full text-[0.6875rem] font-bold inline-flex items-center justify-center transition-colors ${row.status === "Active"
                        ? "bg-green-50 text-green-500"
                        : "bg-red-50 text-red-500"
                        }`}
                >
                    {row.status}
                </div>
            )
        },
        {
            key: "actions",
            label: "Actions",
            width: "12.5rem", // 200px
            render: () => (
                <div className="flex items-center gap-5">
                    <button className="text-gray-400 hover:text-sky-500 transition-colors">
                        <CheckSquare size={18} strokeWidth={2} />
                    </button>
                    <button onClick={onViewProfile} className="text-gray-400 hover:text-sky-500 transition-colors">
                        <Eye size={18} strokeWidth={2} />
                    </button>
                    <button className="text-gray-400 hover:text-sky-500 transition-colors">
                        <Edit3 size={18} strokeWidth={2} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} strokeWidth={2} />
                    </button>
                </div>
            )
        }
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleToggleDropdown = (key) => {
        setActiveDropdown(prev => prev === key ? null : key);
    };

    return (
        <div className="w-full space-y-6" onClick={(e) => {
            if (!e.target.closest(".filter-dropdown")) {
                setActiveDropdown(null);
            }
        }}>
            {/* Search & Filter Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-7">
                    <h2 className="text-[#111827] text-[16px] font-bold font-inter tracking-tight">Search & Filter</h2>
                    <button className="text-sky-500 text-[13px] font-semibold hover:text-sky-600 transition-colors">Reset Filters</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Search Field */}
                    <div className="space-y-2">
                        <label className="text-gray-500 text-[13px] font-semibold block">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-inter focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    {filterConfig.map((filter) => (
                        <div key={filter.key} className="space-y-2 text-left filter-dropdown">
                            <label className="text-gray-500 text-[13px] font-semibold block">{filter.key.charAt(0).toUpperCase() + filter.key.slice(1)}</label>
                            <ReusableFilter
                                filters={[filter]}
                                data={demoData}
                                onFilteredDataChange={handleFilteredDataChange}
                                className="w-full"
                                filterClassName="w-full"
                                dropdownClassName="min-w-full"
                                externalOpenDropdowns={{ [filter.key]: activeDropdown === filter.key }}
                                onToggleDropdown={handleToggleDropdown}
                                fullWidth={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-6 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-[#111827] text-[18px] font-bold font-inter">Employee Directory</h2>
                        <p className="text-gray-400 text-[13px] font-medium mt-0.5">{totalItems} total employees</p>
                    </div>
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                        <Download size={18} strokeWidth={2} />
                    </button>
                </div>

                <div className="w-full">
                    <ReusableDataTable
                        columns={columns}
                        data={currentTableData}
                    />
                </div>

                {/* Pagination Footer */}
                <ReusablePagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};

export default EmployeeReport;
