import { useTranslation } from "react-i18next";
import { ExportButtonIcon } from "../../assets/icons/icons";

const DashboardCards = ({
  title,
  value,
  icon: Icon,
  description,
  isExportCard = false,
  className = "",
  onExportClick,
  isExporting = false,
}) => {
  const { t } = useTranslation();

  const descLines = Array.isArray(description) ? description : [description];

  if (isExportCard) {
    return (
      <div className={`w-full min-h-[15rem] flex flex-col p-6 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border-gray-200 ${className}`}>
        <div className="size-12 bg-white/20 rounded-lg border-gray-200 flex items-center justify-center mb-6">
          {Icon && <Icon className="w-3.5 h-5" />}
        </div>
        <div className="text-white text-sm font-medium font-poppins leading-5 mb-6">
          {title}
        </div>
        <button 
          onClick={onExportClick}
          disabled={isExporting}
          className="mt-auto w-full h-12 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ExportButtonIcon className="w-4 h-6" />
          <span className="text-blue-700 text-base font-semibold font-poppins">
            {isExporting ? (t('report.exporting') || "Exporting...") : t('common.exportExcel')}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-[15rem] flex flex-col p-6 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 ${className}`}>
      <div className="size-12 bg-[#DCFCE7] rounded-lg border-gray-200 flex items-center justify-center mb-6">
        {Icon && <Icon className="w-6 h-5" />}
      </div>
      <div className="text-black text-sm font-medium font-poppins mb-2">
        {title}
      </div>
      <div className="text-gray-500 text-xs font-normal font-poppins mb-6">
        {descLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="mt-auto text-gray-900 text-4xl font-bold font-poppins">
        {value}
      </div>
    </div>
  );
};

export default DashboardCards;
