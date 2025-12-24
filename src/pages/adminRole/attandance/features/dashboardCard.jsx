import {
  ActiveEmployeesIcon,
  HoursWorkedIcon,
  CleaningsIcon,
  QuickExportIcon,
} from "../../../../assets/icons/icons";
import DashboardCards from "../../../../components/itechResuable/DashboardCards";

// Dashboard Cards Container Component
const DashboardCardsContainer = () => {
  const cards = [
    {
      title: "Active Employees Today",
      value: "14",
      description: ["Employees currently clocked in", "at any workplace."],
      icon: ActiveEmployeesIcon,
    },
    {
      title: "Hours Worked This Month",
      value: "286h 40m",
      description: ["Total hours recorded this", "calendar month."],
      icon: HoursWorkedIcon,
    },
    {
      title: "Cleanings This Month",
      value: "112",
      description: ["Number of completed cleaning", "visits this month."],
      icon: CleaningsIcon,
    },
    {
      title: "Quick Export to Excel",
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
