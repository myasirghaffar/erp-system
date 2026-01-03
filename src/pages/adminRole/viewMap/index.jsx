import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { MapContainer, TileLayer, Marker, Popup, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DashboardBanner from "../../../components/DashboardBanner";
import {
    useGetAllWorkplacesQuery,
    useGetAttendanceLocationsQuery,
} from "../../../services/Api";

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock Data (fallback)
const workplaces = [
    { id: 1, name: "Downtown Office", lat: 51.505, lng: -0.09, type: "Workplace", address: "123 Business St" },
    { id: 2, name: "North Campus", lat: 51.51, lng: -0.1, type: "Workplace", address: "456 Education Ave" },
    { id: 3, name: "Warehouse", lat: 51.49, lng: -0.08, type: "Workplace", address: "789 Logistics Blvd" },
];

const employees = [
    { id: 101, name: "Sarah Johnson", lat: 51.507, lng: -0.095, type: "Employee", status: "Active" },
    { id: 102, name: "Michael Chen", lat: 51.503, lng: -0.085, type: "Employee", status: "On-Site" },
];

const ViewMap = () => {
    const { t } = useTranslation();

    // Fetch workplaces and attendance locations
    const { data: workplacesData, isLoading: isLoadingWorkplaces } = useGetAllWorkplacesQuery({ limit: 100 });
    const { data: locationsData, isLoading: isLoadingLocations } = useGetAttendanceLocationsQuery({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
    });

    // Transform workplaces data
    const transformedWorkplaces = useMemo(() => {
        if (!workplacesData?.data?.workplaces) return workplaces;
        
        return workplacesData.data.workplaces
            .filter(wp => wp.latitude && wp.longitude)
            .map((wp) => ({
                id: wp.id,
                name: wp.name,
                lat: parseFloat(wp.latitude),
                lng: parseFloat(wp.longitude),
                type: "Workplace",
                address: wp.address || "",
            }));
    }, [workplacesData]);

    // Transform employee locations from attendance data
    const transformedEmployees = useMemo(() => {
        if (!locationsData?.data?.locations) return employees;
        
        return locationsData.data.locations
            .filter(loc => loc.latitude && loc.longitude)
            .map((loc) => ({
                id: loc.user_id || loc.id,
                name: loc.user?.full_name || loc.employee_name || "Unknown",
                lat: parseFloat(loc.latitude),
                lng: parseFloat(loc.longitude),
                type: "Employee",
                status: loc.status || "Active",
            }));
    }, [locationsData]);

    // Center map on the first workplace or a default location
    const defaultCenter = useMemo(() => {
        if (transformedWorkplaces.length > 0) {
            return [transformedWorkplaces[0].lat, transformedWorkplaces[0].lng];
        }
        return [51.505, -0.09];
    }, [transformedWorkplaces]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden flex flex-col">
            <DashboardBanner
                title={t('map.title')}
                description={t('map.description')}
            />


            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[500px] md:min-h-[600px] z-0">
                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Workplace Markers */}
                    {transformedWorkplaces.map(place => (
                        <Marker key={`wp-${place.id}`} position={[place.lat, place.lng]}>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-gray-900">{place.name}</h3>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{place.type}</span>
                                    <p className="text-sm text-gray-500 mt-1">{place.address}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Employee Markers */}
                    {transformedEmployees.map(emp => (
                        <Marker key={`emp-${emp.id}`} position={[emp.lat, emp.lng]}>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-gray-900">{emp.name}</h3>
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{emp.type}</span>
                                    <p className="text-sm text-gray-500 mt-1">Status: {emp.status}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Overlay Legend or Controls could go here */}
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-[400] text-sm">
                    <h4 className="font-bold text-gray-700 mb-2">{t('map.legend')}</h4>

                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-gray-600">{t('map.workplaces')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> {/* Leaflet default is blue, usually we'd customize icons */}
                        <span className="text-gray-600">{t('map.employees')}</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewMap;
