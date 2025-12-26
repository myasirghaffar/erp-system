import React, { useState, useEffect } from "react";
import { Plus, Download, Eye, Building2, QrCode } from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableDataTable from "../../../components/ReusableDataTable";
import ReusablePagination from "../../../components/ReusablePagination";
import ReusableFilter from "../../../components/ReusableFilter";
import WorkPlaceQrForm from "../manageWorkplaces/features/workPlaceQrForm";
import QrCodeDetail from "../manageWorkplaces/features/QrCodeDetail";

const itemsPerPage = 6;

// Mock Data for QR Codes (copied from WorkplaceManagement)
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

const ManageQrCode = () => {
    const [view, setView] = useState("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [qrTab, setQrTab] = useState("All");
    const [filteredQRs, setFilteredQRs] = useState(qrData);
    const [selectedQr, setSelectedQr] = useState(null);

    // Filter QR Data based on tab
    useEffect(() => {
        if (qrTab === "All") {
            setFilteredQRs(qrData);
        } else {
            setFilteredQRs(qrData.filter(item => item.status === qrTab));
        }
        setCurrentPage(1);
    }, [qrTab]);

    const handleViewQr = (row) => {
        const detailedData = {
            id: row.qrId.replace("QR-", ""),
            created: row.created.replace('\n', ' '),
            status: row.status,
            companyName: "TechCorp Industries",
            location: row.workplace,
            department: "Engineering",
            capacity: "50 Employees",
            contact: "+1 (555) 123-4567",
            email: "info@techcorp.com",
            qrValue: JSON.stringify(row)
        };
        setSelectedQr(detailedData);
        setView("qrDetail");
    };

    if (view === "generateQR") {
        return (
             <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <WorkPlaceQrForm onBack={() => setView("list")} />
             </div>
        );
    }

    if (view === "qrDetail") {
        return (
             <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <QrCodeDetail 
                    data={selectedQr} 
                    onBack={() => setView("list")}
                    onEdit={() => console.log("Edit QR", selectedQr)}
                />
             </div>
        );
    }

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQrData = filteredQRs.slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredQRs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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
             render: (row) => (
                 <div className="flex items-center gap-4">
                      <button onClick={() => handleViewQr(row)} className="text-gray-400 hover:text-blue-500"><Eye size={16} strokeWidth={2}/></button>
                      <button className="text-gray-400 hover:text-blue-500"><Download size={16} strokeWidth={2}/></button>
                 </div>
             )
         }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
             <div className="space-y-6 max-w-full">
                 <DashboardBanner
                    title="Manage QR Code"
                    description="View, Create and Manage your QR codes"
                    rightContent={
                        <button
                            onClick={() => setView("generateQR")}
                            className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={16} /> Generate QR Code
                        </button>
                    }
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pt-6">
                    <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                         <div className="flex items-center gap-4">
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
                         <div className="relative w-full md:w-64">
                             <ReusableFilter
                                filters={[]}
                                searchConfig={{ placeholder: "Search QR codes..." }}
                                data={qrData}
                                onFilteredDataChange={setFilteredQRs} 
                                className="w-full"
                             />
                         </div>
                    </div>

                     <div className="w-full">
                        <ReusableDataTable
                            columns={qrColumns}
                            data={currentQrData}
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
             </div>
        </div>
    );
};

export default ManageQrCode;
