import React, { useState } from "react";
import {
    Shield,
    Users,
    User,
    Crown,
    FileText,
    Edit,
    Trash2,
    BarChart2,
    Settings,
    Check,
    Lock
} from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import { useTranslation } from 'react-i18next';

const RolesManage = () => {
    const { t } = useTranslation();

    // Mock Data for Roles
    const roles = [
        {
            id: 'super_admin',
            title: t('roles.superAdmin'),
            description: t('roles.fullSystemAccess'),
            usersCount: 2,
            icon: Crown,
            iconColor: 'text-sky-500',
            iconBg: 'bg-sky-50',
            badgeColor: 'bg-sky-100 text-sky-600'
        },
        {
            id: 'employee',
            title: t('roles.employee'),
            description: t('roles.onlyMobileAccess'),
            usersCount: 5,
            icon: User,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50',
            badgeColor: 'bg-blue-100 text-blue-600'
        },
        {
            id: 'manager',
            title: t('roles.manager'),
            description: t('roles.teamManagement'),
            usersCount: 12,
            icon: Users,
            iconColor: 'text-indigo-500',
            iconBg: 'bg-indigo-50',
            badgeColor: 'bg-green-100 text-green-600' // Using green as per screenshot roughly
        }
    ];

    // Mock Data for Permissions
    const initialPermissions = [
        { id: 1, name: t('roles.userManagement'), icon: Users, rolePermissions: { super_admin: true, employee: false, manager: false } },
        { id: 2, name: t('roles.contentCreation'), icon: FileText, rolePermissions: { super_admin: true, employee: true, manager: true } },
        { id: 3, name: t('roles.contentEditing'), icon: Edit, rolePermissions: { super_admin: true, employee: true, manager: false } },
        { id: 4, name: t('roles.contentDeletion'), icon: Trash2, rolePermissions: { super_admin: true, employee: false, manager: false } },
        { id: 5, name: t('roles.analyticsAccess'), icon: BarChart2, rolePermissions: { super_admin: true, employee: false, manager: false } },
        { id: 6, name: t('roles.systemSettings'), icon: Settings, rolePermissions: { super_admin: true, employee: false, manager: false } },
    ];

    const [permissions, setPermissions] = useState(initialPermissions);
    const [globalToggle, setGlobalToggle] = useState(false);

    const handlePermissionChange = (permId, roleId) => {
        setPermissions(prev => prev.map(perm => {
            if (perm.id === permId) {
                return {
                    ...perm,
                    rolePermissions: {
                        ...perm.rolePermissions,
                        [roleId]: !perm.rolePermissions[roleId]
                    }
                };
            }
            return perm;
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden space-y-6">
            <DashboardBanner
                title={t('roles.title')}
                description={t('roles.description')}
            />

            {/* Role Types Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-[#111827] text-lg font-bold font-inter mb-6">{t('roles.roleTypes')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <div key={role.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${role.iconBg}`}>
                                    <role.icon className={role.iconColor} size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[#111827] text-sm font-bold font-inter">{role.title}</h3>
                                    <p className="text-gray-400 text-xs font-medium mt-0.5">{role.description}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${role.badgeColor}`}>
                                {t('roles.usersCount', { count: role.usersCount })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permissions Matrix Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-[#111827] text-lg font-bold font-inter">{t('roles.permissionsMatrix')}</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm font-medium">{t('roles.globalAccessToggle')}</span>
                        <button
                            onClick={() => setGlobalToggle(!globalToggle)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${globalToggle ? 'bg-sky-500' : 'bg-gray-200'}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${globalToggle ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 text-gray-500 text-sm font-bold font-inter w-1/3">{t('roles.permissions')}</th>
                                <th className="text-center py-4 px-4 text-[#111827] text-sm font-bold font-inter">{t('roles.superAdmin')}</th>
                                <th className="text-center py-4 px-4 text-[#111827] text-sm font-bold font-inter">{t('roles.employee')}</th>
                                <th className="text-center py-4 px-4 text-[#111827] text-sm font-bold font-inter">{t('roles.manager')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm) => (
                                <tr key={perm.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                <perm.icon className="text-gray-500" size={16} />
                                            </div>
                                            <span className="text-[#374151] text-sm font-bold font-inter">{perm.name}</span>
                                        </div>
                                    </td>
                                    {roles.map(role => (
                                        <td key={role.id} className="py-4 px-4 text-center">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={perm.rolePermissions[role.id]}
                                                    onChange={() => handlePermissionChange(perm.id, role.id)}
                                                />
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RolesManage;
