import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActiveEmployeesIcon,
  HoursWorkedIcon,
  CleaningsIcon,
  QuickExportIcon,
} from "../../../../assets/icons/icons";
import DashboardCards from "../../../../components/itechResuable/DashboardCards";
import {
  useGetDashboardRealtimeQuery,
  useGetAnalyticsSummaryQuery,
} from "../../../../services/Api";

// Dashboard Cards Container Component
const DashboardCardsContainer = () => {
  const { t } = useTranslation();

  // Fetch dashboard data - same as /admin/dashboard screen
  const { data: realtimeData, isLoading: isLoadingRealtime } = useGetDashboardRealtimeQuery();
  const { data: summaryData, isLoading: isLoadingSummary } = useGetAnalyticsSummaryQuery();

  // Calculate values from API data - same logic as /admin/dashboard screen
  const cards = useMemo(() => {
    // Active Employees Today - currently clocked in (present status)
    // From realtime API: summary.present gives currently clocked in employees
    const activeEmployees = realtimeData?.data?.summary?.present || summaryData?.data?.employees?.active || 0;
    
    // Hours Worked This Month - from analytics summary
    // Calculate total hours from summary data (same as dashboard screen)
    const totalHours = summaryData?.data?.attendance?.total_clock_ins || 0;
    const hoursWorked = `${Math.floor(totalHours / 8)}h ${(totalHours % 8) * 60}m` || "0h 0m";
    
    // Cleanings This Month - use attendance records count (total clock-ins this month)
    // From analytics summary: attendance.total_clock_ins
    const cleanings = summaryData?.data?.attendance?.total_clock_ins || realtimeData?.data?.summary?.total || 0;

    return [
      {
        title: t('dashboard.activeEmployees'),
        value: activeEmployees.toString(),
        description: [t('dashboard.activeEmployeesDesc')],
        icon: ActiveEmployeesIcon,
        isLoading: isLoadingSummary || isLoadingRealtime,
      },
      {
        title: t('dashboard.hoursWorked'),
        value: hoursWorked,
        description: [t('dashboard.hoursWorkedDesc')],
        icon: HoursWorkedIcon,
        isLoading: isLoadingSummary,
      },
      {
        title: t('dashboard.cleanings'),
        value: cleanings.toString(),
        description: [t('dashboard.cleaningsDesc')],
        icon: CleaningsIcon,
        isLoading: isLoadingSummary || isLoadingRealtime,
      },
      {
        title: t('dashboard.quickExport'),
        isExportCard: true,
        icon: QuickExportIcon,
      },
    ];
  }, [summaryData, realtimeData, isLoadingSummary, isLoadingRealtime, t]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
      {cards.map((card, index) => (
        <DashboardCards
          key={index}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          isExportCard={card.isExportCard}
          isLoading={card.isLoading}
        />
      ))}
    </div>
  );
};

export default DashboardCardsContainer;
