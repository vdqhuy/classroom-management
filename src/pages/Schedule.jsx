import React, { useEffect, useState } from "react";
import { getScheduleByUserIdAndWeek } from "../services/scheduleService";
import '../css/Schedule.css';
import RoomInfoModal from "../components/room/RoomInfoModal";
import ScheduleUpdateRequestForm from "../components/schedule/ScheduleUpdateRequestForm"

const getCurrentWeekNumber = () => {
  const today = new Date();
  const oneJan = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today - oneJan) / 86400000) + 1;
  return Math.ceil(dayOfYear / 7);
};

const getWeekRange = (weekNumber) => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
  const daysOffset = (weekNumber - 1) * 7 - 2;
  const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const formatDate = (date) =>
    `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekNumber());
  const [selectedRoom, setSelectedRoom] = useState(null); // State cho phòng học được chọn
  const [isRoomInfoModalOpen, setisRoomInfoModalOpen] = useState(false); // State cho trạng thái modal
  const [isScheduleUpdateRequestFormOpen, setisScheduleUpdateRequestFormOpen] = useState(false);

  const userId = localStorage.getItem("idNguoiDung") || "";

  const occupiedCells = new Set(); // Lưu trữ các ô bị chiếm

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleData = await getScheduleByUserIdAndWeek(userId, currentWeek);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Lỗi khi lấy lịch giảng dạy", error);
      }
    };

    fetchSchedule();
  }, [userId, currentWeek]);

  const goToPreviousWeek = () => setCurrentWeek((prev) => prev - 1);
  const goToNextWeek = () => setCurrentWeek((prev) => prev + 1);

  const periods = Array.from({ length: 14 }, (_, i) => `Tiết ${i + 1}`);
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
  const day = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const handleRoomClick = (lesson) => {
    setSelectedRoom(lesson.phong);  // Lưu thông tin phòng vào state
    setisRoomInfoModalOpen(true);  // Mở modal
  };

  const handleRescheduleClick = (lesson) => {
    setSelectedRoom(lesson.phong);
    setisScheduleUpdateRequestFormOpen(true);
  };

  return (
    <>
      <div className="table-container">
        <div style={{ height: '65px' }}></div>
        <div className="schedule-header">
          <h2>Tuần {currentWeek} ({getWeekRange(currentWeek)})</h2>
          <div>
            <button onClick={goToPreviousWeek}>⬅ Tuần trước</button>
            <button onClick={goToNextWeek}>Tuần sau ➡</button>
          </div>
        </div>

        <table className="schedule-table">
          <thead>
            <tr>
              <th className="headtable">Tiết</th>
              {days.map((day) => (
                <th key={day} className="headtable">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, index) => (
              <tr key={index}>
                <td>{period}</td>
                {day.map((dayOfWeek) => {
                  if (occupiedCells.has(`${dayOfWeek}-${index + 1}`)) {
                    return null;
                  }

                  const lesson = schedule.find(
                    (item) => item.thuTrongTuan.toLowerCase() === dayOfWeek.toLowerCase() && item.tietBatDau === index + 1
                  );

                  if (lesson) {
                    for (let i = lesson.tietBatDau + 1; i <= lesson.tietKetThuc; i++) {
                      occupiedCells.add(`${dayOfWeek}-${i}`);
                    }
                  }

                  return (
                    <td key={dayOfWeek} 
                        rowSpan={lesson ? lesson.tietKetThuc - lesson.tietBatDau + 1 : 1} 
                        className={lesson ? "schedule-cell" : ""}>
                      {lesson && (
                        <div>
                          <b>Lớp: {lesson.lopHoc.maLop}</b> <br />
                          Phòng: {lesson.phong.maPhong} <br />
                          Mã môn: {lesson.monHoc.maMon}
                          <div className="lesson-buttons">
                            <button onClick={() => handleRoomClick(lesson)}>Thông tin phòng</button>
                            <button onClick={() => handleRescheduleClick(lesson)}>Đổi Lịch</button>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal cho thông tin phòng */}
      <RoomInfoModal
        roomInfo={selectedRoom}
        isOpen={isRoomInfoModalOpen}  // Trạng thái mở/đóng của modal
        onClose={() => setisRoomInfoModalOpen(false)}  // Đóng modal
      />

      {/* Modal form yêu cầu thay đổi lịch dạy */}
      <ScheduleUpdateRequestForm
        roomInfo={selectedRoom}
        isOpen={isScheduleUpdateRequestFormOpen}  // Trạng thái mở/đóng của modal
        onClose={() => setisScheduleUpdateRequestFormOpen(false)}  // Đóng modal
      />
    </>
  );
};

export default Schedule;
