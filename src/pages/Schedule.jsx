import React, { useState } from "react";
import { Select } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import WeeklySchedule from "./WeeklySchedule";
import DailySchedule from "./DailySchedule";
import MonthlySchedule from "./MonthlySchedule";
import "../css/Schedule.css";

const Schedule = () => {
  const [view, setView] = useState("weekly");

  const handleViewChange = (value) => {
    setView(value);
  };

  return (
    <div className="schedule-container" style={{ marginTop: "100px" }}>
      <div className="schedule-header" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
        <CalendarOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
        <Select defaultValue="weekly" style={{ width: 150 }} onChange={handleViewChange}>
          <Select.Option value="daily">Lịch ngày</Select.Option>
          <Select.Option value="weekly">Lịch tuần</Select.Option>
          <Select.Option value="monthly">Lịch tháng</Select.Option>
        </Select>
      </div>
      <div className="schedule-content">
        {view === "daily" && <DailySchedule />}
        {view === "weekly" && <WeeklySchedule />}
        {view === "monthly" && <MonthlySchedule />}
      </div>
    </div>
  );
};

export default Schedule;
