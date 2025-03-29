import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getScheduleByUserIdAndMonth } from "../services/scheduleService";
import { Button } from "antd";

const localizer = momentLocalizer(moment);

const CustomHeader = ({ label }) => {
    return (
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          padding: "10px 0",
          background: "linear-gradient(30deg, #b0ed9f, #fdffa4, #cef9ff)",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        {label}
      </div>
    );
};

const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        background: "linear-gradient(to right, #cef9ff, #f4c3eb, #cef9ff)",
        borderRadius: "8px",
        color: "#333",
        padding: "5px",
        border: "none",
        textAlign: "center",
      },
    };
};  
  

const MonthlySchedule = () => {
  const [events, setEvents] = useState([]);
  const userId = localStorage.getItem("idNguoiDung") || "";
  const [currentMonth, setCurrentMonth] = useState(moment().month() + 1);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleData = await getScheduleByUserIdAndMonth(userId, currentMonth);
        const formattedEvents = scheduleData.map((item) => ({
          title: `${item.monHoc.tenMon} - ${item.lopHoc.maLop}`,
          start: new Date(item.ngayHoc),
          end: new Date(item.ngayHoc),
          allDay: true,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Lỗi khi lấy lịch tháng", error);
      }
    };

    fetchSchedule();
  }, [userId, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 12 ? 1 : prev + 1));
  };

  return (
    <div style={{ height: 650 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
        <Button onClick={handlePrevMonth}>&lt; Tháng trước</Button>
        <h3 style={{ margin: "0 20px" }}>Tháng {currentMonth}</h3>
        <Button onClick={handleNextMonth}>Tháng sau &gt;</Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 550 }}
        views={["month"]}
        toolbar={false} // Ẩn toolbar mặc định
        components={{
          month: {
            header: CustomHeader, // Custom hàng header
          },
        }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default MonthlySchedule;
