import { useMemo } from "react";
import {
  ActiveEmployeesIcon,
  HoursWorkedIcon,
  CleaningsIcon,
  QuickExportIcon,
} from "../../../../assets/icons/icons";
import DashboardCards from "../../../../components/itechResuable/DashboardCards";
import { useTranslation } from "react-i18next";
import {
  useGetAnalyticsSummaryQuery,
  useGetDashboardRealtimeQuery,
} from "../../../../services/Api";

// Dashboard Cards Container Component
const DashboardCardsContainer = () => {
  const { t } = useTranslation();

  // Fetch dashboard data
  const { data: realtimeData, isLoading: isLoadingRealtime } = useGetDashboardRealtimeQuery();
  const { data: summaryData, isLoading: isLoadingSummary } = useGetAnalyticsSummaryQuery();

  // Calculate values from API data
  const cards = useMemo(() => {
    const activeEmployees = summaryData?.data?.employees?.active || realtimeData?.data?.totalEmployees || 0;
    
    // Calculate total hours from summary or realtime data
    const totalHours = summaryData?.data?.attendance?.total_clock_ins || 0;
    const hoursWorked = `${Math.floor(totalHours / 8)}h ${(totalHours % 8) * 60}m` || "0h 0m";
    
    // Use attendance records count or pending leaves as "cleanings" metric
    const cleanings = summaryData?.data?.attendance?.total_clock_ins || realtimeData?.data?.totalCheckIns || 0;

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
