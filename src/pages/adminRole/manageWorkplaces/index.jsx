import React, { useState, useCallback, useEffect } from "react";
import { Plus, Download, Eye, Trash2, MapPin, Building2, QrCode } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableDataTable from "../../../components/ReusableDataTable";
import ReusablePagination from "../../../components/ReusablePagination";
// ReusableFilter creates a row of filters. To match the design's "Search" + "Dropdowns" + "Filter Button",
// we can use flexible column layout or just use ReusableFilter if it fits, or build a custom top bar.
// The design shows: [Search Input (long)] [Dropdown] [Filter Button (icon + text)]
// ReusableFilter typically renders inputs and dropdowns. Let's try to adapt it or build a custom bar using basic inputs if ReusableFilter is too rigid.
// Looking at previous usages (EmployeeReport), ReusableFilter handles search + dropdowns well.
import ReusableFilter from "../../../components/ReusableFilter";
import AddWorkplace from "./features/AddWorkplace";
import WorkPlaceQrForm from "./features/workPlaceQrForm";

const itemsPerPage = 4;
const qrItemsPerPage = 5;

// Mock Data for Workplaces
const workplaceData = [
    {
        id: 1,
        name: "Downtown Office",
        type: "Office",
        address: "123 Business Plaza, Suite 400\nNew York, NY 10001",
        radius: "150m",
        checkIns: 42,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: Building2
    },
    {
        id: 2,
        name: "Manufacturing Plant A",
        type: "Factory",
        address: "4567 Industrial Blvd\nBrooklyn, NY 11201",
        radius: "200m",
        checkIns: 87,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        icon: Building2 
    },
    {
        id: 3,
        name: "Storage Facility",
        type: "Warehouse",
        address: "890 Logistics Way\nQueens, NY 11375",
        radius: "300m",
        checkIns: 23,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: Building2
    },
    {
        id: 4,
        name: "West Side Branch",
        type: "Branch",
        address: "567 Commerce Street\nManhattan, NY 10013",
        radius: "100m",
        checkIns: 18,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        icon: Building2
    },
     {
        id: 5,
        name: "East Side Branch",
        type: "Branch",
        address: "567 Commerce Street\nManhattan, NY 10013",
        radius: "100m",
        checkIns: 12,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        icon: Building2
    },
     {
        id: 6,
        name: "North Side Branch",
        type: "Branch",
        address: "567 Commerce Street\nManhattan, NY 10013",
        radius: "100m",
        checkIns: 15,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        icon: Building2
    }
];

// Mock Data for QR Codes
const qrData = [
    { id: 1, qrName: "Main Entrance", qrId: "QR-2024-001", workplace: "Downtown Office", created: "Jan 15, 2024\n09:30 AM", scans: "1,248", status: "Active", iconBg: "bg-blue-600" },
    { id: 2, qrName: "Conference Room A", qrId: "QR-2024-002", workplace: "Downtown Office", created: "Jan 18, 2024\n02:15 PM", scans: "856", status: "Active", iconBg: "bg-purple-600" },
    { id: 3, qrName: "Employee Parking", qrId: "QR-2024-003", workplace: "North Campus", created: "Jan 22, 2024\n11:45 AM", scans: "2,104", status: "Active", iconBg: "bg-green-600" },
    { id: 4, qrName: "Cafeteria Menu", qrId: "QR-2024-004", workplace: "Downtown Office", created: "Feb 03, 2024\n08:20 AM", scans: "3,567", status: "Active", iconBg: "bg-orange-600" },
    { id: 5, qrName: "Emergency Exit", qrId: "QR-2024-005", workplace: "South Building", created: "Feb 08, 2024\n03:00 PM", scans: "124", status: "Inactive", iconBg: "bg-red-600" },
     { id: 6, qrName: "Visitor Check-In", qrId: "QR-2024-006", workplace: "Reception Desk", created: "Feb 12, 2024\n10:30 AM", scans: "124", status: "Inactive", iconBg: "bg-blue-600" },
     { id: 7, qrName: "Service Elevator", qrId: "QR-2024-007", workplace: "Warehouse", created: "Feb 15, 2024\n11:00 AM", scans: "45", status: "Active", iconBg: "bg-gray-600" },
     { id: 8, qrName: "Back Door", qrId: "QR-2024-008", workplace: "Warehouse", created: "Feb 16, 2024\n09:00 AM", scans: "88", status: "Active", iconBg: "bg-gray-600" },
];

const WorkplaceManagement = () => {
    const [view, setView] = useState("list");
    const [currentPage, setCurrentPage] = useState(1); // Workplace Pagination state
    const [qrCurrentPage, setQrCurrentPage] = useState(1); // QR Pagination state

    if (view === "generateQR") {
        return (
             <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <WorkPlaceQrForm onBack={() => setView("list")} />
             </div>
        );
    }

    if (view === "add") {
        return (
             <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <AddWorkplace onBack={() => setView("list")} />
             </div>
        );
    }

    const [filteredWorkplaces, setFilteredWorkplaces] = useState(workplaceData);
    const [filteredQRs, setFilteredQRs] = useState(qrData);
    const [qrTab, setQrTab] = useState("All");

     // Reset pagination when filter changes
    const handleFilteredWorkplaceChange = useCallback((newData) => {
        setFilteredWorkplaces(newData);
        setCurrentPage(1);
    }, []);

    // Filter QR Data based on tab
    useEffect(() => {
        if (qrTab === "All") {
            setFilteredQRs(qrData);
        } else {
            setFilteredQRs(qrData.filter(item => item.status === qrTab));
        }
        setQrCurrentPage(1);
    }, [qrTab]);

    // Workplace Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentWorkplaceData = filteredWorkplaces.slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredWorkplaces.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // QR Pagination Logic
    const indexOfLastQr = qrCurrentPage * qrItemsPerPage;
    const indexOfFirstQr = indexOfLastQr - qrItemsPerPage;
    const currentQrData = filteredQRs.slice(indexOfFirstQr, indexOfLastQr);
    const totalQrItems = filteredQRs.length;
    const totalQrPages = Math.ceil(totalQrItems / qrItemsPerPage);


    const workplaceColumns = [
        {
            key: "name",
            label: "Workplace Name",
            minWidth: "250px",
            grow: 1,
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg}`}>
                        <row.icon className={`w-5 h-5 ${row.iconColor}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-bold text-[14px]">{row.name}</span>
                        <span className="text-gray-400 text-[12px] font-medium">{row.type}</span>
                    </div>
                </div>
            )
        },
        {
            key: "address",
            label: "Address",
            minWidth: "200px",
             grow: 1,
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[#374151] font-medium text-[13px] whitespace-pre-line">{row.address.split('\n')[0]}</span>
                    <span className="text-gray-400 text-[11px] font-medium">{row.address.split('\n')[1]}</span>
                </div>
            )
        },
        {
            key: "radius",
            label: "Radius",
            width: "100px",
             render: (row) => {
                // Radius pill color matching design (greenish)
                 return <span className="px-2.5 py-1 rounded bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold">{row.radius}</span>;
             }
        },
         {
            key: "qrCode",
            label: "QR Code",
            width: "120px",
            render: (row) => (
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        <QrCode size={16} />
                     </div>
                     <div className="flex gap-1">
                        <button className="text-gray-400 hover:text-blue-500"><Download size={14} /></button>
                        <button className="text-gray-400 hover:text-blue-500"><Eye size={14} /></button>
                     </div>
                </div>
            )
        },
        {
            key: "checkIns",
            label: "Today's Check-ins",
            width: "180px",
            render: (row) => (
                 <div className="flex items-center gap-1">
                    <span className="text-[#111827] font-bold text-[16px]">{row.checkIns}</span>
                    <span className="text-gray-400 text-[12px] font-medium">check-ins today</span>
                </div>
            )
        },
        {
            key: "actions",
            label: "Actions",
             width: "100px",
            render: () => (
                <div className="flex items-center gap-3">
                     <button className="text-gray-400 hover:text-blue-500"><nav className="w-4 h-4" /> {/* Edit icon placeholder using standard element or lucide? using lucide Edit from props if specific, else standar */}
                        <Edit size={16} strokeWidth={2}/>
                     </button>
                     <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} strokeWidth={2}/></button>
                </div>
            )
        }
    ];
    
     // Import Edit icon locally as component
    const Edit = ({size, strokeWidth}) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
    )

    const qrColumns = [
        {
           key: "selection",
           label: "",
            width: "50px",
           render: () => (
                <div className="flex justify-center w-full">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer" />
                </div>
            )
        },
        {
            key: "qrName",
            label: "QR Name",
            minWidth: "200px",
             grow: 1,
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg} text-white`}>
                        <QrCode className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-bold text-[14px]">{row.qrName}</span>
                        <span className="text-gray-400 text-[11px] font-medium">ID: {row.qrId}</span>
                    </div>
                </div>
            )
        },
        {
            key: "workplace",
            label: "Workplace",
            minWidth: "180px",
             grow: 1,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-[#374151] font-semibold text-[13px]">{row.workplace}</span>
                </div>
            )
        },
        {
            key: "created",
            label: "Created Date",
            width: "150px",
            render: (row) => (
                 <div className="flex flex-col">
                    <span className="text-[#374151] font-medium text-[13px]">{row.created.split('\n')[0]}</span>
                    <span className="text-gray-400 text-[11px] font-medium">{row.created.split('\n')[1]}</span>
                </div>
            )
        },
        {
            key: "scans",
            label: "Scans",
            width: "100px",
            render: (row) => <span className="text-[#111827] font-bold text-[13px]">{row.scans}</span>
        },
        {
            key: "status",
            label: "Status",
            width: "100px",
            render: (row) => (
                <div
                    className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center justify-center ${
                      row.status === "Active" ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-500"
                    }`}
                >
                    {row.status}
                </div>
            )
        },
         {
            key: "actions",
            label: "Actions",
             width: "120px",
            render: () => (
                <div className="flex items-center gap-4">
                     <button className="text-gray-400 hover:text-blue-500"><Eye size={16} strokeWidth={2}/></button>
                     <button className="text-gray-400 hover:text-blue-500"><Download size={16} strokeWidth={2}/></button>
                     <button className="text-gray-400 hover:text-gray-600">
                        {/* Kebab menu placeholder */}
                         <div className="flex flex-col gap-[2px]">
                             <div className="w-1 h-1 bg-current rounded-full"></div>
                             <div className="w-1 h-1 bg-current rounded-full"></div>
                             <div className="w-1 h-1 bg-current rounded-full"></div>
                         </div>
                     </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
             <div className="space-y-6 max-w-full">
                
                {/* Banner */}
                 <DashboardBanner
                    title="Workplace Management"
                    description="Manage and monitor your workplace locations"
                    rightContent={
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setView("generateQR")}
                                className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} /> Generate QR Code
                            </button>
                             <button
                                onClick={() => setView("add")}
                                className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} /> Add Workplace
                            </button>
                        </div>
                    }
                />

                {/* Filter Bar for Workplaces (Custom Row for visual match) */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="relative flex-1 w-full md:max-w-lg">
                         {/* We can use ReusableFilter here but standard input matching other pages is good */}
                          <ReusableFilter
                                filters={[]} // No dropdowns for this specific top bar in the screenshot unless needed
                                searchConfig={{ placeholder: "Search workplaces..." }}
                                data={workplaceData}
                                onFilteredDataChange={handleFilteredWorkplaceChange} 
                                className="w-full"
                                searchClassName="w-full"
                          />
                     </div>
                     <div className="flex items-center gap-3 w-full md:w-auto">
                         <div className="relative min-w-[150px]">
                              {/* Placeholder Dropdown for "All Locations" */}
                              <button className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-inter text-gray-700 hover:bg-gray-50">
                                   <span>All Locations</span>
                                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                              </button>
                         </div>
                         <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-inter font-semibold text-gray-700 hover:bg-gray-50 shadow-sm">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                              Filter
                         </button>
                     </div>
                </div>

                {/* Workplace Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="w-full">
                        <ReusableDataTable
                            columns={workplaceColumns}
                            data={currentWorkplaceData}
                            customStyles={{
                                headCells: {
                                    style: {
                                        "&:first-of-type": {
                                            justifyContent: "center",
                                        },
                                    },
                                },
                            }}
                        />
                         <div className="border-t border-gray-100">
                             <ReusablePagination
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                totalPages={totalPages}
                             />
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pt-6">
                    <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                         <div className="flex items-center gap-4">
                             <h2 className="text-lg font-bold text-[#111827]">All QR Codes</h2>
                             <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                                  {["All", "Active", "Inactive"].map(tab => (
                                      <button 
                                        key={tab}
                                        onClick={() => setQrTab(tab)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${qrTab === tab ? "bg-white text-[#111827] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                      >
                                          {tab}
                                      </button>
                                  ))}
                             </div>
                         </div>
                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                             <Download size={16}/>
                             Export
                         </button>
                    </div>

                     <div className="w-full">
                        <ReusableDataTable
                            columns={qrColumns}
                            data={currentQrData} // In real app, filter logic would apply here based on qrTab
                        />
                         {/* Reuse pagination footer or duplicate static one for now */}
                         <div className="border-t border-gray-100">
                             <ReusablePagination
                                totalItems={totalQrItems}
                                itemsPerPage={qrItemsPerPage}
                                currentPage={qrCurrentPage}
                                onPageChange={setQrCurrentPage}
                                totalPages={totalQrPages}
                             />
                        </div>
                    </div>
                </div>

             </div>
        </div>
    );
};

export default WorkplaceManagement;
