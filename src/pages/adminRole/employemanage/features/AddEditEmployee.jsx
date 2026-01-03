import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, Copy, Check, X } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import ReusableInput from "../../../../components/ReusableInput";
import Select from "../../../../components/Form/Select";
import DashboardBanner from "../../../../components/DashboardBanner";
import Modal from "../../../../components/Modal";
import {
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} from "../../../../services/Api";
import { toast } from "react-toastify";

const AddEditEmployee = ({ onBack, employee = null }) => {
    const { t } = useTranslation();
    const isEditMode = !!employee;

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        position: "",
        role: "employee",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

    // Load employee data if in edit mode
    useEffect(() => {
        if (employee) {
            setFormData({
                full_name: employee.full_name || "",
                email: employee.email || "",
                phone_number: employee.phone_number || "",
                position: employee.position || "",
                role: employee.role || "employee",
            });
        }
    }, [employee]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        if (!phone) return true; // Phone is optional
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= 20;
    };

    const validateForm = () => {
        const newErrors = {};

        // Full name validation
        if (!formData.full_name.trim()) {
            newErrors.full_name = t('employee.fullNameRequired');
        } else if (formData.full_name.trim().length < 2) {
            newErrors.full_name = t('employee.fullNameMinLength');
        } else if (formData.full_name.trim().length > 100) {
            newErrors.full_name = t('employee.fullNameMaxLength');
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = t('employee.emailRequired');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('employee.emailInvalid');
        }

        // Phone validation (optional)
        if (formData.phone_number && !validatePhone(formData.phone_number)) {
            newErrors.phone_number = t('employee.phoneInvalid');
        }

        // Position validation (optional)
        if (formData.position && formData.position.length > 100) {
            newErrors.position = t('employee.positionMaxLength');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error(t('employee.formErrorsMessage'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                phone_number: formData.phone_number.trim() || undefined,
                position: formData.position.trim() || undefined,
                role: formData.role,
            };

            if (isEditMode) {
                await updateEmployee({
                    id: employee.id,
                    data: payload,
                }).unwrap();
                toast.success(t('employee.employeeUpdatedSuccess'));
                onBack();
            } else {
                const response = await createEmployee({ data: payload }).unwrap();
                // Check if temporary password is in the response
                // Response structure: { success, message, data: { user, temporaryPassword } }
                const tempPassword = response?.data?.temporaryPassword || response?.temporaryPassword;
                if (tempPassword) {
                    setTemporaryPassword(tempPassword);
                    setShowPasswordModal(true);
                    toast.success(t('employee.employeeCreatedSuccess'));
                } else {
                    toast.success(t('employee.employeeCreatedSuccess'));
                    onBack();
                }
            }
        } catch (error) {
            // Handle validation errors from backend
            if (error?.data?.errors) {
                const backendErrors = {};
                error.data.errors.forEach((err) => {
                    const field = err.path || err.param;
                    backendErrors[field] = err.msg || err.message;
                });
                setErrors(backendErrors);
                toast.error(t('employee.validationErrorsMessage'));
            } else {
                toast.error(error?.data?.message || t('employee.saveEmployeeError'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleOptions = [
        { label: t('employee.roleEmployee'), value: "employee" },
        { label: t('employee.roleManager'), value: "manager" },
        { label: t('employee.roleAdmin'), value: "admin" },
    ];

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(temporaryPassword);
        setCopied(true);
        toast.success(t('messages.copySuccess') || 'Password copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setTemporaryPassword("");
        setCopied(false);
        onBack();
    };

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title={isEditMode ? t('employee.editEmployeeTitle') : t('employee.addEmployeeTitle')}
                description={t('employee.manageEmployeeInfo')}
                onBack={onBack}
            />

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-[#111827] text-lg font-bold font-inter">{t('employee.basicInfoTitle')}</h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">{t('employee.basicInfoDesc')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            {t('employee.fullNameLabel')}<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder={t('employee.fullNamePlaceholder')}
                            classes={`h-12 rounded-xl border-gray-200 focus:ring-sky-500/20 ${errors.full_name ? 'border-red-500' : ''}`}
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-xs font-medium mt-1">{errors.full_name}</p>
                        )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            {t('employee.emailAddressLabel')}<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('employee.emailPlaceholder')}
                            classes={`h-12 rounded-xl border-gray-200 focus:ring-sky-500/20 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold">
                            {t('employee.phoneNumberLabel')}
                        </label>
                        <ReusableInput
                            name="phone_number"
                            type="tel"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder={t('employee.phonePlaceholder')}
                            classes={`h-12 rounded-xl border-gray-200 focus:ring-sky-500/20 ${errors.phone_number ? 'border-red-500' : ''}`}
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-xs font-medium mt-1">{errors.phone_number}</p>
                        )}
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            {t('employee.positionLabel')}<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder={t('employee.positionPlaceholder')}
                            classes={`h-12 rounded-xl border-gray-200 focus:ring-sky-500/20 ${errors.position ? 'border-red-500' : ''}`}
                        />
                        {errors.position && (
                            <p className="text-red-500 text-xs font-medium mt-1">{errors.position}</p>
                        )}
                    </div>

                    {/* Role Dropdown */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold">
                            {t('employee.roleLabel')}
                        </label>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={(e) => handleSelectChange("role", e.target.value)}
                            placeholder={t('employee.chooseRolePlaceholder')}
                            className={`w-full h-12 bg-white text-gray-700 rounded-xl border border-gray-200 ${errors.role ? 'border-red-500' : ''}`}
                            options={roleOptions}
                        />
                        {errors.role && (
                            <p className="text-red-500 text-xs font-medium mt-1">{errors.role}</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end items-center gap-4 mt-10">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {t('employee.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isCreating || isUpdating}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4FC3F7] text-white font-bold text-sm shadow-md shadow-sky-100 hover:bg-[#29B6F6] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LuPlus size={18} />
                        {isSubmitting || isCreating || isUpdating
                            ? t('employee.saving')
                            : isEditMode
                            ? t('employee.updateEmployee')
                            : t('employee.createEmployee')}
                    </button>
                </div>
            </form>

            {/* Help Alert */}
            <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-4 flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5">
                    <Info size={14} />
                </div>
                <div>
                    <h4 className="text-[#0D47A1] text-sm font-bold font-inter">{t('employee.needHelpTitle')}</h4>
                    <p className="text-[#1976D2] text-[13px] font-medium mt-0.5 font-inter">
                        {t('employee.needHelpDesc')}
                    </p>
                </div>
            </div>

            {/* Temporary Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={handleClosePasswordModal}
                size="medium"
                title={t('employee.employeeCreatedTitle')}
            >
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm font-medium">
                            {t('employee.temporaryPasswordDesc')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-700 text-sm font-semibold block">
                            {t('employee.temporaryPasswordLabel')}
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={temporaryPassword}
                                    readOnly
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-lg text-lg font-mono font-bold text-gray-800 focus:outline-none focus:border-sky-500"
                                />
                                <button
                                    onClick={handleCopyPassword}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={t('employee.copyPasswordTooltip')}
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-xs font-medium flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                                {t('employee.passwordImportant')}
                            </span>
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleClosePasswordModal}
                            className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-600 transition-colors"
                        >
                            {t('employee.close')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddEditEmployee;
