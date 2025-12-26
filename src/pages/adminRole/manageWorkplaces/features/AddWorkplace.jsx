import React, { useState } from "react";
import { Info, MapPin, Building2, Check } from "lucide-react";
import ReusableInput from "../../../../components/ReusableInput";
import DashboardBanner from "../../../../components/DashboardBanner";

const AddWorkplace = ({ onBack }) => {
    const [radius, setRadius] = useState(100);

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title="Add New Workplace"
                description="Configure workplace location and geofence settings for attendance tracking"
                onBack={onBack}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Form Section */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="mb-8">
                        <h2 className="text-[#111827] text-lg font-bold font-inter">Workplace Information</h2>
                        <p className="text-gray-400 text-sm font-medium mt-1">Enter the details for the new workplace location</p>
                    </div>

                    <div className="space-y-6 flex-grow">
                        {/* Workplace Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                Workplace Name<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                placeholder="e.g., Headquarters, Branch Office"
                                iconLeft={<Building2 size={18} className="text-gray-400" />}
                                classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                Address<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                placeholder="Search for address..."
                                iconLeft={<MapPin size={18} className="text-gray-400" />}
                                classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                            />
                            <p className="text-gray-400 text-xs font-medium">Start typing to search and select from suggestions</p>
                        </div>

                        {/* Geofence Radius */}
                        <div className="space-y-3">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                Geofence Radius<span className="text-red-500">*</span>
                            </label>
                            
                            {/* Radius Input with meters addon */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center p-1 rounded-full bg-gray-100">
                                   <div className="w-2 h-2 rounded-full bg-gray-500 border border-gray-400"></div> {/* Simplified icon representation */}
                                </div>
                                <input 
                                    type="number" 
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    className="w-full h-12 pl-10 pr-16 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-[#111827] font-medium"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">meters</span>
                            </div>

                            {/* Slider */}
                             <div className="px-1">
                                <input
                                    type="range"
                                    min="10"
                                    max="5000"
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#22B3E8]"
                                />
                                <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                                    <span>10m</span>
                                    <span className="text-[#22B3E8]">100m</span>
                                    <span>5000m</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Alert */}
                        <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-4 flex items-start gap-3">
                            <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5 shrink-0">
                                <Info size={14} />
                            </div>
                            <div>
                                <h4 className="text-[#0D47A1] text-sm font-bold font-inter">About Geofence</h4>
                                <p className="text-[#1976D2] text-[13px] font-medium mt-0.5 font-inter leading-relaxed">
                                    The geofence radius determines the area around the workplace where employees can check in. Recommended range: 50-200 meters.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                         <button
                            onClick={onBack}
                            className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#22B3E8] text-white font-bold text-sm shadow-md shadow-sky-100 hover:bg-[#1fa0d1] transition-transform active:scale-95">
                            <Check size={18} />
                            Save Workplace
                        </button>
                    </div>
                </div>

                {/* Right Column: Map Preview */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="mb-6">
                        <h2 className="text-[#111827] text-lg font-bold font-inter">Map Preview</h2>
                         <p className="text-gray-400 text-sm font-medium mt-1">Visual representation of workplace location and geofence area</p>
                    </div>

                    {/* Map Container Placeholder */}
                     <div className="flex-grow w-full bg-gray-100 rounded-xl relative overflow-hidden min-h-[400px]">
                         {/* Placeholder for Leaflet Map - In a real app, integrate Leaflet/Google Maps here */}
                        <div className="absolute inset-0 bg-[#E5E7EB] flex items-center justify-center">
                             <div className="text-center text-gray-400">
                                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                <span className="text-sm font-medium">Map Preview</span>
                             </div>
                        </div>

                        {/* Map Controls Simulation */}
                        <div className="absolute top-4 left-4 bg-white rounded-md shadow-md flex flex-col">
                            <button className="w-8 h-8 flex items-center justify-center text-gray-600 border-b border-gray-100 font-bold hover:bg-gray-50">+</button>
                            <button className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50">-</button>
                        </div>
                        
                         {/* Legend */}
                         <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-100 space-y-2">
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                 <span className="text-xs font-semibold text-gray-700">Workplace Location</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-blue-200 border border-blue-400"></div>
                                 <span className="text-xs font-semibold text-gray-700">Geofence Area</span>
                             </div>
                         </div>
                         
                         {/* Copyright */}
                        <div className="absolute bottom-0 right-0 bg-white/80 px-2 py-0.5 text-[10px] text-gray-500">
                             Leaflet | © OpenStreetMap contributors
                        </div>
                     </div>

                    {/* Lat/Lng Display */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Latitude</span>
                             <span className="text-[#111827] font-bold text-sm">37.7749</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Longitude</span>
                             <span className="text-[#111827] font-bold text-sm">-122.4194</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWorkplace;
