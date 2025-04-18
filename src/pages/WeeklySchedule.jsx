import React, { useEffect, useState } from "react";
import { getScheduleByUserIdAndWeek } from "../services/scheduleService";
import { getStudentListByClassId } from "../services/userInfoService";
import '../css/Schedule.css';
import RoomInfoModal from "../components/room/RoomInfoModal";
import ScheduleUpdateForm from "../components/schedule/ScheduleUpdateForm";
import { Button } from "antd";
import ClassInfoModal from "../components/ClassInfoModal";

const getCurrentWeekNumber = () => {
  const today = new Date();
  // Lấy thứ của ngày đầu năm (0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy)
  const oneJan = new Date(today.getFullYear(), 0, 1);
  const dayOfWeek = oneJan.getDay(); 

  // Điều chỉnh để thứ Hai là ngày đầu tuần (ISO 8601)
  const offset = (dayOfWeek <= 4) ? dayOfWeek - 1 : dayOfWeek - 8;

  // Tính số ngày trong năm kể từ ngày 4/1 (tuần 1 của ISO 8601)
  const dayOfYear = Math.floor((today - oneJan + offset * 86400000) / 86400000) + 1;

  // Tính tuần theo ISO 8601
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

const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekNumber());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedClass, setSelectedClass] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [showModalClassInfo, setShowModalClassInfo] = useState(false);


  const userId = localStorage.getItem("idNguoiDung") || "";

  const occupiedCells = new Set();

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
    setSelectedLesson(lesson);
    setSelectedRoom(lesson.phong);
    setIsModalOpen(true);
  };

  const handleClassClick = (classInfo) => {
    console.log("Class Clicked", classInfo);
    handleShowClassInfo();
    setSelectedClass(classInfo);
    fetchStudentList(classInfo.maLop);
  };

  const fetchStudentList = async (classId) => {
    try {
      const studentListData = await getStudentListByClassId(classId);
      setStudentList(studentListData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên", error);
    }
  }

  const handleShowClassInfo = () => {
    setShowModalClassInfo(true);
  }

  const handleCloseClassInfo = () => {
    setShowModalClassInfo(false);
  }

  return (
    <>
        <div className="schedule-header">
          <h2>Tuần {currentWeek} ({getWeekRange(currentWeek)})</h2>
          <div>
            <button style={{marginRight: "10px"}} onClick={goToPreviousWeek}>⬅ Tuần trước</button>
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
                          Môn: {lesson.monHoc.tenMon} ({lesson.monHoc.maMon})
                          <div className="lesson-buttons">
                            <Button onClick={() => handleRoomClick(lesson)}>Phòng</Button>
                            <Button onClick={() => handleClassClick(lesson.lopHoc)}>Lớp học</Button>
                            <ScheduleUpdateForm 
                              selectedLesson={selectedLesson}
                              setSelectedLesson = {setSelectedLesson}
                              lesson = {lesson}
                            />
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

      <RoomInfoModal
        selectedLesson={selectedLesson}
        roomInfo={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ClassInfoModal 
        show = {showModalClassInfo}
        handleClose = {handleCloseClassInfo}
        classInfo = {selectedClass}
        studentList = {studentList}
      />
    </>
  );
};

export default WeeklySchedule;
