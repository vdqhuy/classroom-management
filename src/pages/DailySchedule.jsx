import React, { useEffect, useState } from "react";
import { Select, Button, DatePicker } from "antd";
import { getScheduleByUserIdAndWeekDetail } from "../services/scheduleService";
import RoomInfoModal from "../components/room/RoomInfoModal";
import ScheduleUpdateForm from "../components/schedule/ScheduleUpdateForm";
import "../css/Schedule.css";
import moment from "moment";

const days = [
  { label: "Thứ 2", value: "MON" },
  { label: "Thứ 3", value: "TUE" },
  { label: "Thứ 4", value: "WED" },
  { label: "Thứ 5", value: "THU" },
  { label: "Thứ 6", value: "FRI" },
  { label: "Thứ 7", value: "SAT" },
  { label: "Chủ Nhật", value: "SUN" },
];

const getCurrentWeekNumber = () => {
  return moment().isoWeek();
};

const getCurrentWeekday = () => {
  return moment().format("ddd").toUpperCase();
};

const DailySchedule = () => {
  const [selectedDay, setSelectedDay] = useState(getCurrentWeekday());
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekNumber());
  const [schedule, setSchedule] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const userId = localStorage.getItem("idNguoiDung") || "";

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleData = await getScheduleByUserIdAndWeekDetail(userId, selectedDay, selectedWeek);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Lỗi khi lấy lịch theo tuần", error);
      }
    };

    fetchSchedule();
  }, [userId, selectedDay, selectedWeek]);

  const handleRoomClick = (lesson) => {
    setSelectedLesson(lesson);
    setSelectedRoom(lesson.phong);
    setIsModalOpen(true);
  };

  const handleWeekChange = (date) => {
    if (date) {
      setSelectedWeek(moment(date).isoWeek());
    }
  };

  return (
    <>
      <div className="schedule-header">
        <Select
          value={selectedDay}
          onChange={(value) => setSelectedDay(value)}
          style={{ width: 150 }}
        >
          {days.map((day) => (
            <Select.Option key={day.value} value={day.value}>
              {day.label}
            </Select.Option>
          ))}
        </Select>

        <DatePicker
          picker="week"
          onChange={handleWeekChange}
          format="Wo [tuần] YYYY"
          defaultValue={moment()}
          style={{ marginLeft: 10 }}
        />
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th className="headtable">Tiết</th>
            <th className="headtable">Thông tin</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 14 }, (_, i) => i + 1).map((period) => {
            const lesson = schedule.find(
              (item) => period >= item.tietBatDau && period <= item.tietKetThuc
            );

            // Kiểm tra nếu đây là tiết bắt đầu của lesson
            const isStartPeriod = lesson && period === lesson.tietBatDau;

            return (
              <tr key={period}>
                <td>{`Tiết ${period}`}</td>
                {isStartPeriod ? (
                  <td
                    className={lesson ? "schedule-cell" : ""}
                    rowSpan={lesson.tietKetThuc - lesson.tietBatDau + 1}
                  >
                    <div>
                      <b>Lớp: {lesson.lopHoc.maLop}</b> <br />
                      Phòng: {lesson.phong.maPhong} <br />
                      Mã môn: {lesson.monHoc.tenMon} ({lesson.monHoc.maMon})
                      <div className="lesson-buttons">
                        <Button onClick={() => handleRoomClick(lesson)}>Thông tin phòng</Button>
                        <ScheduleUpdateForm 
                          selectedLesson={selectedLesson}
                          setSelectedLesson = {setSelectedLesson}
                          lesson = {lesson}
                        />
                      </div>
                    </div>
                  </td>
                ) : lesson ? null : (
                  <td>Không có lịch</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <RoomInfoModal
        selectedLesson={selectedLesson}
        roomInfo={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DailySchedule;