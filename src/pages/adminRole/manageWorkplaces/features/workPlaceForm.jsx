import React, { useState } from "react";
import {
    SelectWorkplaceIcon,
    BlueCheckIcon,
    GenerateQrCodeIcon,
    QrCodePreviewIcon,
    NoQrCodeGeneratedIcon,
    DownloadPngIcon,
    DownloadPdfIcon,
    PrintQrCodeIcon,
    QuickTipIcon,
} from "../../../../assets/icons/icons";
import ReusableInput from "../../../../components/ReusableInput";
import Select from "../../../../components/Form/Select";

const WorkPlaceForm = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        workplaceLocation: "",
        department: "",
        contactNumber: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const workplaceOptions = [
        { label: "New York Office", value: "ny" },
        { label: "London Office", value: "london" },
        { label: "Remote", value: "remote" },
    ];

    const departmentOptions = [
        { label: "Human Resources", value: "hr" },
        { label: "Engineering", value: "eng" },
        { label: "Sales", value: "sales" },
        { label: "Marketing", value: "mkt" },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1120px]">
            {/* Left Section - Form */}
            <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:min-h-[718px] relative">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 bg-indigo-100 rounded-xl border border-gray-200 flex items-center justify-center">
                        <SelectWorkplaceIcon className="text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-gray-900 text-lg font-bold font-inter leading-6">
                            Select Workplace
                        </h2>
                        <p className="text-gray-500 text-xs font-normal font-inter leading-5">
                            Choose a workplace to generate QR code
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Company Name */}
                    <div className="flex flex-col gap-2">
                        <ReusableInput
                            label="Company Name"
                            name="companyName"
                            placeholder="Enter Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                            backgroundColor="bg-gray-50"
                            border="border-gray-200"
                            classes="text-sm text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Workplace Location */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-xs font-semibold font-inter mb-1">
                            Workplace Location
                        </label>
                        <Select
                            name="workplaceLocation"
                            value={formData.workplaceLocation}
                            onChange={handleChange}
                            options={workplaceOptions}
                            placeholder="Select a workplace..."
                            className="w-full h-[3.4rem] md:h-[3.18rem] bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Department */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-xs font-semibold font-inter mb-1">
                            Department
                        </label>
                        <Select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            options={departmentOptions}
                            placeholder="Select Department"
                            className="w-full h-[3.4rem] md:h-[3.18rem] bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col gap-2">
                        <ReusableInput
                            label="Contact Number"
                            name="contactNumber"
                            placeholder="Enter Contact Number"
                            type="tel"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            backgroundColor="bg-gray-50"
                            border="border-gray-200"
                            classes="text-sm text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <ReusableInput
                            label="Email"
                            name="email"
                            placeholder="Enter Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            backgroundColor="bg-gray-50"
                            border="border-gray-200"
                            classes="text-sm text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-12">
                    <button className="w-full h-12 bg-sky-400 hover:bg-sky-500 transition-colors rounded-xl shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-2 text-white">
                        <GenerateQrCodeIcon />
                        <span className="text-sm font-semibold font-inter">
                            Generate QR Code
                        </span>
                    </button>
                </div>
            </div>

            {/* Right Section - Preview */}
            <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:min-h-[718px] relative">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 bg-blue-100 rounded-xl border border-gray-200 flex items-center justify-center">
                        <QrCodePreviewIcon className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-gray-900 text-lg font-bold font-inter leading-6">
                            QR Code Preview
                        </h2>
                        <p className="text-gray-500 text-xs font-normal font-inter leading-5">
                            Preview and download your QR code
                        </p>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="w-full h-72 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-200 flex items-center justify-center mb-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl border border-gray-200 flex items-center justify-center">
                            <NoQrCodeGeneratedIcon className="text-gray-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 text-sm font-medium font-inter leading-6">
                                No QR Code Generated
                            </p>
                            <p className="text-gray-400 text-xs font-normal font-inter leading-5">
                                Select a workplace and click generate
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <div className="w-full h-40 opacity-50 relative pointer-events-none">
                        {/* Disabled state visual container */}
                        <div className="space-y-4">
                            <button className="w-full h-12 bg-blue-600 rounded-xl shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-white">
                                <DownloadPngIcon />
                                <span className="text-sm font-semibold font-inter">Download PNG</span>
                            </button>
                            <button className="w-full h-12 bg-white border border-gray-600 rounded-xl flex items-center justify-center gap-2 text-gray-600">
                                <DownloadPdfIcon />
                                <span className="text-sm font-semibold font-inter">Download PDF</span>
                            </button>
                            <button className="w-full h-12 bg-white border border-gray-600 rounded-xl flex items-center justify-center gap-2 text-gray-600">
                                <PrintQrCodeIcon />
                                <span className="text-sm font-semibold font-inter">Print QR Code</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Tip */}
                <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-4 flex gap-4 absolute bottom-6 left-6 right-6 w-auto">
                    <div className="mt-1">
                        <QuickTipIcon className="text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-blue-900 text-xs font-semibold font-inter leading-5">
                            Quick Tip
                        </h4>
                        <p className="text-blue-800 text-xs font-normal font-inter leading-4 mt-1">
                            Print the QR code on durable material and place it in a visible
                            location at the workplace for easy scanning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkPlaceForm;
