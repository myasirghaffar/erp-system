import React from "react";
import { Info } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import ReusableInput from "../../../../components/ReusableInput";
import Select from "../../../../components/Form/Select";
import DashboardBanner from "../../../../components/DashboardBanner";

const AddEditEmployee = ({ onBack }) => {
    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title="Add/ Edit Employee"
                description="Create a new employee profile"
                onBack={onBack}
            />

            {/* Form Section */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-[#111827] text-lg font-bold font-inter">Basic Information</h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">Please fill in the employee details below</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            Full Name<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            placeholder="Enter employee's full name"
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            Email Address<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            placeholder="employee@company.com"
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold">
                            Phone Number (optional)
                        </label>
                        <ReusableInput
                            placeholder="+1 (555) 123-4567"
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            Position<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            placeholder="e.g. Software Developer, Marketing Manager"
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold">
                            Select Role (optional)
                        </label>
                        <Select
                            placeholder="Choose a role"
                            className="w-full h-12 bg-white text-gray-700 rounded-xl border border-gray-200"
                            options={[
                                { label: "Admin", value: "admin" },
                                { label: "User", value: "user" },
                                { label: "Contractor", value: "contractor" }
                            ]}
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end items-center gap-4 mt-10">
                    <button
                        onClick={onBack}
                        className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4FC3F7] text-white font-bold text-sm shadow-md shadow-sky-100 hover:bg-[#29B6F6] transition-transform active:scale-95">
                        <LuPlus size={18} />
                        Create Employee
                    </button>
                </div>
            </div>

            {/* Help Alert */}
            <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-4 flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5">
                    <Info size={14} />
                </div>
                <div>
                    <h4 className="text-[#0D47A1] text-sm font-bold font-inter">Need Help?</h4>
                    <p className="text-[#1976D2] text-[13px] font-medium mt-0.5 font-inter">
                        Make sure all required fields are filled correctly. The employee will receive an invitation email to set up their account.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddEditEmployee;
