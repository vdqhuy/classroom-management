import axios from "axios";
import { getTeacherByUser } from "./teacherInfoService"

const API_URL = "http://localhost:8080/api/thoikhoabieu";

// export const getThoiKhoaBieuByMaGV = async (maGV) => {
//     try {
//         const response = await axios.get(`${API_URL}/giangvien/${maGV}`);
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi lấy thời khóa biểu", error);
//         throw error;
//     }
// };

export const getScheduleByUserIdAndWeek = async (userId, week) => {
  try {
      const giangvien = await getTeacherByUser(userId)
      const response = await axios.get(`${API_URL}/giangvien/${giangvien.maGv}?tuan=${week}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch giảng dạy", error);
      throw error;
    }
}

export const getScheduleByUserIdAndWeekDetail = async (userId, thuTrongTuan, tuan) => {
  try {
    const giangvien = await getTeacherByUser(userId)
    const response = await axios.get(`${API_URL}/giangvien/${giangvien.maGv}`, {
      params: { tuan, thuTrongTuan },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch theo tuần", error);
    return [];
  }
};

export const getScheduleByUserIdAndMonth = async (userId, month) => {
  try {
      const giangvien = await getTeacherByUser(userId)
      const response = await axios.get(`${API_URL}/giangvien/${giangvien.maGv}?thang=${month}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch giảng dạy", error);
      throw error;
    }
}