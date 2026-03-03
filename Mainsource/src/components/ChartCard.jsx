import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { Capitalise } from "../hooks/useCapitalise";

const CompanyAttendanceCard = ({ 
  company, 
  openAbsentEmployeePopup, 
  openContinuousEmployeePopup 
}) => {
const absentees = company.absentees || [];

  const continuousCount = absentees.filter(
    emp => emp.continuous_days > 1
  ).length;

  const continuousAbsentees = absentees.filter(
    emp => emp.continuous_days > 1
  );

  const chartData = [
    {
      name: "Present",
      value: company.present_employees || 0,
      type: "present"
    },
    {
      name: "Absent",
      value: company.absent_employees || 0,
      type: "absent"
    },
    {
      name: "Continuous",
      value: continuousCount,
      type: "continuous"
    },
  ];

  const handleBarClick = (data) => {
    if (data.name === "Absent") {
      openAbsentEmployeePopup(
        `${company.company_name} - Absent Employees`,
       absentees || []
      );
    } else if (data.name === "Continuous") {
      // Filter only continuous absentees (continuous_days > 1)
      const continuousAbsentees = (company.absentees || []).filter(
        emp => emp.continuous_days > 1
      );
      openContinuousEmployeePopup(
        `${company.company_name} - Continuous Absentees (${continuousAbsentees.length})`,
        continuousAbsentees
      );
    }
   
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm hover:shadow-md transition p-3">
      {/* HEADER */}
      <div className="border-b pb-2 mb-2 flex justify-between items-center">
        <p
          className="text-sm font-semibold text-green-700 truncate"
          title={company.company_name}
        >
          {Capitalise(company.company_name)}
        </p>
        <p className="text-[11px] text-gray-500">
          
          <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
            {" "}{company.total_employees}
          </span>
        </p>
      </div>

      {/* BAR CHART */}
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              onClick={handleBarClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.name === "Present"
                      ? "#4ade80"  // Green
                      : entry.name === "Absent"
                      ? "#f87171"  // Red
                      : "#fb923c"  // Orange for Continuous
                  }
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fill: "#374151",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex justify-between text-[10px] mt-2 pt-1 border-t">
        <div 
          className="flex items-center gap-1 cursor-default"
          title="Present employees"
        >
          {/* <div className="w-2 h-2 rounded-sm bg-green-500"></div> */}
          {/* <span className="text-green-700">Present: {company.present_employees || 0}</span> */}
        </div>
        <div 
          className="flex items-center gap-1 cursor-pointer hover:bg-red-50 px-1 rounded"
          onClick={() => handleBarClick({ name: "Absent" })}
          title="Click to view absent employees"
        >
          {/* <div className="w-2 h-2 rounded-sm bg-red-500"></div> */}
          {/* <span className="text-red-700">Absent: {company.absent_employees || 0}</span> */}
        </div>
        <div 
          className="flex items-center gap-1 cursor-pointer hover:bg-orange-50 px-1 rounded"
          onClick={() => handleBarClick({ name: "Continuous" })}
          title="Click to view continuous absentees"
        >
          {/* <div className="w-2 h-2 rounded-sm bg-orange-500"></div> */}
          {/* <span className="text-orange-700">Continuous: {continuousCount}</span> */}
        </div>
      </div>
    </div>
  );
};

export default CompanyAttendanceCard;