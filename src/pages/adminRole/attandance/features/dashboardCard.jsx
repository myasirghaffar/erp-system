import { useTranslation } from "react-i18next";
import {
  ActiveEmployeesIcon,
  HoursWorkedIcon,
  CleaningsIcon,
  QuickExportIcon,
} from "../../../../assets/icons/icons";
import DashboardCards from "../../../../components/itechResuable/DashboardCards";

// Dashboard Cards Container Component
const DashboardCardsContainer = () => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('dashboard.activeEmployees'),
      value: "14",
      description: [t('dashboard.activeEmployeesDesc')],
      icon: ActiveEmployeesIcon,
    },
    {
      title: t('dashboard.hoursWorked'),
      value: "286h 40m",
      description: [t('dashboard.hoursWorkedDesc')],
      icon: HoursWorkedIcon,
    },
    {
      title: t('dashboard.cleanings'),
      value: "112",
      description: [t('dashboard.cleaningsDesc')],
      icon: CleaningsIcon,
    },
    {
      title: t('dashboard.quickExport'),
      isExportCard: true,
      icon: QuickExportIcon,
    },
  ];

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
        />
      ))}
    </div>
  );
};

export default DashboardCardsContainer;
