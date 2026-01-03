import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, MapPin, Building2, Check } from "lucide-react";
import ReusableInput from "../../../../components/ReusableInput";
import DashboardBanner from "../../../../components/DashboardBanner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    useCreateWorkplaceMutation,
    useUpdateWorkplaceMutation,
    useGetWorkplaceByIdQuery,
} from "../../../../services/Api";
import { toast } from "react-toastify";

// Fix for default Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
}

const AddWorkplace = ({ onBack, workplaceId = null }) => {
    const { t } = useTranslation();
    const isEditMode = !!workplaceId;

    // Fetch workplace data if editing
    const { data: workplaceData } = useGetWorkplaceByIdQuery(workplaceId, {
        skip: !isEditMode,
    });

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        geofence_radius: 100,
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);

    const [createWorkplace, { isLoading: isCreating }] = useCreateWorkplaceMutation();
    const [updateWorkplace, { isLoading: isUpdating }] = useUpdateWorkplaceMutation();

    // Load workplace data if in edit mode
    useEffect(() => {
        if (workplaceData?.data) {
            const wp = workplaceData.data;
            const lat = parseFloat(wp.latitude) || 51.505;
            const lng = parseFloat(wp.longitude) || -0.09;
            
            setFormData({
                name: wp.name || "",
                address: wp.address || "",
                latitude: wp.latitude?.toString() || "",
                longitude: wp.longitude?.toString() || "",
                geofence_radius: wp.geofence_radius || 100,
                description: wp.description || "",
            });
            
            setMapCenter([lat, lng]);
            setMarkerPosition([lat, lng]);
        }
    }, [workplaceData]);

    // Validation functions
    const validateLatitude = (lat) => {
        const num = parseFloat(lat);
        return !isNaN(num) && num >= -90 && num <= 90;
    };

    const validateLongitude = (lng) => {
        const num = parseFloat(lng);
        return !isNaN(num) && num >= -180 && num <= 180;
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = t('workplace.validation.nameRequired') || "Workplace name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t('workplace.validation.nameMin') || "Name must be at least 2 characters";
        } else if (formData.name.trim().length > 100) {
            newErrors.name = t('workplace.validation.nameMax') || "Name must be less than 100 characters";
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = t('workplace.validation.addressRequired') || "Address is required";
        } else if (formData.address.trim().length < 5) {
            newErrors.address = t('workplace.validation.addressMin') || "Address must be at least 5 characters";
        }

        // Latitude validation
        if (!formData.latitude) {
            newErrors.latitude = t('workplace.validation.latitudeRequired') || "Latitude is required";
        } else if (!validateLatitude(formData.latitude)) {
            newErrors.latitude = t('workplace.validation.latitudeInvalid') || "Latitude must be between -90 and 90";
        }

        // Longitude validation
        if (!formData.longitude) {
            newErrors.longitude = t('workplace.validation.longitudeRequired') || "Longitude is required";
        } else if (!validateLongitude(formData.longitude)) {
            newErrors.longitude = t('workplace.validation.longitudeInvalid') || "Longitude must be between -180 and 180";
        }

        // Geofence radius validation
        const radius = parseInt(formData.geofence_radius);
        if (isNaN(radius) || radius < 10 || radius > 1000) {
            newErrors.geofence_radius = t('workplace.validation.radiusInvalid') || "Radius must be between 10 and 1000 meters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Function to reverse geocode coordinates to address
    const reverseGeocode = async (lat, lng) => {
        try {
            setIsFetchingAddress(true);
            // Note: Nominatim API allows browser requests but recommends rate limiting (max 1 request per second)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }
            
            const data = await response.json();
            
            // Extract address from response
            if (data && data.address) {
                const addressParts = [];
                
                // Build address from most specific to general
                if (data.address.road) addressParts.push(data.address.road);
                if (data.address.house_number) addressParts.push(data.address.house_number);
                if (data.address.neighbourhood) addressParts.push(data.address.neighbourhood);
                if (data.address.suburb) addressParts.push(data.address.suburb);
                if (data.address.city || data.address.town || data.address.village) {
                    addressParts.push(data.address.city || data.address.town || data.address.village);
                }
                if (data.address.state) addressParts.push(data.address.state);
                if (data.address.postcode) addressParts.push(data.address.postcode);
                if (data.address.country) addressParts.push(data.address.country);
                
                return addressParts.join(', ');
            }
            
            // Fallback to display_name if address object is not structured
            return data.display_name || '';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        } finally {
            setIsFetchingAddress(false);
        }
    };

    const handleMapClick = async (latlng) => {
        const lat = latlng.lat.toFixed(6);
        const lng = latlng.lng.toFixed(6);
        
        // Update coordinates immediately
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
        }));
        setMarkerPosition([latlng.lat, latlng.lng]);
        
        // Clear coordinate errors
        if (errors.latitude || errors.longitude) {
            setErrors((prev) => ({
                ...prev,
                latitude: "",
                longitude: "",
            }));
        }
        
        // Fetch address from coordinates
        const address = await reverseGeocode(latlng.lat, latlng.lng);
        if (address) {
            setFormData((prev) => ({
                ...prev,
                address: address,
            }));
            // Clear address error if it exists
            if (errors.address) {
                setErrors((prev) => ({
                    ...prev,
                    address: "",
                }));
            }
        } else {
            toast.warning(t('workplace.addressFetchFailed') || "Could not fetch address. Please enter it manually.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('workplace.validation.formErrors') || "Please fix the form errors");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                geofence_radius: parseInt(formData.geofence_radius),
                description: formData.description.trim() || undefined,
            };

            if (isEditMode) {
                await updateWorkplace({
                    id: workplaceId,
                    data: payload,
                }).unwrap();
                toast.success(t('workplace.updateSuccess') || "Workplace updated successfully");
            } else {
                await createWorkplace({ data: payload }).unwrap();
                toast.success(t('workplace.createSuccess') || "Workplace created successfully");
            }

            onBack();
        } catch (error) {
            if (error?.data?.errors) {
                const backendErrors = {};
                error.data.errors.forEach((err) => {
                    const field = err.path || err.param;
                    backendErrors[field] = err.msg || err.message;
                });
                setErrors(backendErrors);
                toast.error(t('workplace.validation.backendErrors') || "Please fix the validation errors");
            } else {
                toast.error(error?.data?.message || t('workplace.saveError') || "Failed to save workplace");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title={isEditMode ? (t('workplace.editTitle') || "Edit Workplace") : (t('workplace.addNewTitle') || "Add New Workplace")}
                description={t('workplace.addNewDesc') || "Create a new workplace location"}
                onBack={onBack}
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Form Section */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="mb-8">
                        <h2 className="text-[#111827] text-lg font-bold font-inter">{t('workplace.infoTitle') || "Workplace Information"}</h2>
                        <p className="text-gray-400 text-sm font-medium mt-1">{t('workplace.infoDesc') || "Enter workplace details"}</p>
                    </div>

                    <div className="space-y-6 flex-grow">
                        {/* Workplace Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('workplace.name') || "Workplace Name"}<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('workplace.namePlaceholder') || "e.g., Headquarters, Branch Office"}
                                iconLeft={<Building2 size={18} className="text-gray-400" />}
                                classes={`h-12 rounded-xl border-gray-200 focus:ring-sky-500/20 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('workplace.address') || "Address"}<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder={t('map.searchPlaceholder') || "Enter address"}
                                iconLeft={<MapPin size={18} className="text-gray-400" />}
                                classes={`h-12 rounded-xl border-gray-200 focus:ring-sky-500/20 ${errors.address ? 'border-red-500' : ''}`}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.address}</p>
                            )}
                            {isFetchingAddress ? (
                                <p className="text-[#22B3E8] text-xs font-medium">Fetching address...</p>
                            ) : (
                                <p className="text-gray-400 text-xs font-medium">{t('workplace.addressDesc') || "Click on the map to set location"}</p>
                            )}
                        </div>

                        {/* Geofence Radius */}
                        <div className="space-y-3">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('workplace.radius') || "Geofence Radius"}<span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center p-1 rounded-full bg-gray-100">
                                    <div className="w-2 h-2 rounded-full bg-gray-500 border border-gray-400"></div>
                                </div>
                                <input
                                    type="number"
                                    name="geofence_radius"
                                    value={formData.geofence_radius}
                                    onChange={handleChange}
                                    min="10"
                                    max="1000"
                                    className={`w-full h-12 pl-10 pr-16 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-[#111827] font-medium ${errors.geofence_radius ? 'border-red-500' : ''}`}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">{t('common.meters') || "meters"}</span>
                            </div>
                            {errors.geofence_radius && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.geofence_radius}</p>
                            )}

                            {/* Slider */}
                            <div className="px-1">
                                <input
                                    type="range"
                                    min="10"
                                    max="1000"
                                    value={formData.geofence_radius}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, geofence_radius: parseInt(e.target.value) }));
                                        if (errors.geofence_radius) {
                                            setErrors((prev) => ({ ...prev, geofence_radius: "" }));
                                        }
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#22B3E8]"
                                />
                                <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                                    <span>10m</span>
                                    <span className="text-[#22B3E8]">{formData.geofence_radius}m</span>
                                    <span>1000m</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Alert */}
                        <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-4 flex items-start gap-3">
                            <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5 shrink-0">
                                <Info size={14} />
                            </div>
                            <div>
                                <h4 className="text-[#0D47A1] text-sm font-bold font-inter">{t('workplace.aboutGeofence') || "About Geofence"}</h4>
                                <p className="text-[#1976D2] text-[13px] font-medium mt-0.5 font-inter leading-relaxed">
                                    {t('workplace.aboutGeofenceDesc') || "Geofence defines the area where employees can check in. Click on the map to set the location."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {t('common.cancel') || "Cancel"}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isCreating || isUpdating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#22B3E8] text-white font-bold text-sm shadow-md shadow-sky-100 hover:bg-[#1fa0d1] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check size={18} />
                            {isSubmitting || isCreating || isUpdating
                                ? (t('common.saving') || "Saving...")
                                : isEditMode
                                ? (t('common.update') || "Update")
                                : (t('workplace.save') || "Save Workplace")}
                        </button>
                    </div>
                </div>

                {/* Right Column: Map Preview */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="mb-6">
                        <h2 className="text-[#111827] text-lg font-bold font-inter">{t('workplace.mapPreview') || "Map Preview"}</h2>
                        <p className="text-gray-400 text-sm font-medium mt-1">{t('workplace.mapPreviewDesc') || "Click on the map to set location"}</p>
                    </div>

                    {/* Map Container */}
                    <div className="flex-grow w-full bg-gray-100 rounded-xl relative overflow-hidden min-h-[400px]">
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapClickHandler onMapClick={handleMapClick} />
                            {markerPosition && (
                                <Marker position={markerPosition}>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>

                    {/* Lat/Lng Display */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('map.latitude') || "Latitude"}</span>
                            <input
                                type="text"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="0.000000"
                                className={`w-full text-[#111827] font-bold text-sm bg-transparent border-none focus:outline-none ${errors.latitude ? 'text-red-500' : ''}`}
                            />
                            {errors.latitude && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.latitude}</p>
                            )}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('map.longitude') || "Longitude"}</span>
                            <input
                                type="text"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="0.000000"
                                className={`w-full text-[#111827] font-bold text-sm bg-transparent border-none focus:outline-none ${errors.longitude ? 'text-red-500' : ''}`}
                            />
                            {errors.longitude && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.longitude}</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddWorkplace;
