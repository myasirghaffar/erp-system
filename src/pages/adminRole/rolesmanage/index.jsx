import React, { useMemo } from "react";
import {
    Users,
    User,
    Crown
} from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import { useTranslation } from 'react-i18next';
import { useGetRolesStatisticsQuery } from "../../../services/admin/adminApi";

// Map role IDs to their display configuration
const roleConfig = {
    admin: {
        id: 'admin',
        titleKey: 'roles.superAdmin',
        descriptionKey: 'roles.fullSystemAccess',
        icon: Crown,
        iconColor: 'text-sky-500',
        iconBg: 'bg-sky-50',
        badgeColor: 'bg-sky-100 text-sky-600'
    },
    employee: {
        id: 'employee',
        titleKey: 'roles.employee',
        descriptionKey: 'roles.onlyMobileAccess',
        icon: User,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        badgeColor: 'bg-blue-100 text-blue-600'
    },
    manager: {
        id: 'manager',
        titleKey: 'roles.manager',
        descriptionKey: 'roles.teamManagement',
        icon: Users,
        iconColor: 'text-indigo-500',
        iconBg: 'bg-indigo-50',
        badgeColor: 'bg-green-100 text-green-600'
    }
};

const RolesManage = () => {
    const { t } = useTranslation();
    const { data: rolesData, isLoading, error } = useGetRolesStatisticsQuery();

    // Transform backend data to frontend format
    const roles = useMemo(() => {
        if (!rolesData?.data?.roles) {
            return [];
        }

        return rolesData.data.roles.map(role => {
            const config = roleConfig[role.id];
            if (!config) return null;

            return {
                id: role.id,
                title: t(config.titleKey),
                description: t(config.descriptionKey),
                usersCount: role.usersCount || 0,
                icon: config.icon,
                iconColor: config.iconColor,
                iconBg: config.iconBg,
                badgeColor: config.badgeColor
            };
        }).filter(Boolean);
    }, [rolesData, t]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden space-y-6">
            <DashboardBanner
                title={t('roles.title')}
                description={t('roles.description')}
            />

            {/* Role Types Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-[#111827] text-lg font-bold font-inter mb-6">{t('roles.roleTypes')}</h2>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">{t('common.loading') || 'Loading...'}</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-red-500">{t('common.loadError') || 'Failed to load roles data'}</div>
                    </div>
                ) : roles.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">{t('common.noData') || 'No roles data available'}</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {roles.map((role) => {
                            const IconComponent = role.icon;
                            return (
                                <div key={role.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${role.iconBg}`}>
                                            <IconComponent className={role.iconColor} size={24} />
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
                            );
                        })}
                    </div>
                )}
            </div>

           
        </div>
    );
};

export default RolesManage;
