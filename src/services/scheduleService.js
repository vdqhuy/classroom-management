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

export const getScheduleByMaGVAndWeek = async (maGV, week) => {
    try {
        const response = await axios.get(`${API_URL}/giangvien/${maGV}?tuan=${week}`);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy lịch giảng dạy", error);
        throw error;
      }
}

export const getScheduleByUserIdAndWeek = async (userId, week) => {
  try {
      const giangvien = await getTeacherByUser(userId)
      console.log(giangvien)
      const response = await axios.get(`${API_URL}/giangvien/${giangvien.maGv}?tuan=${week}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch giảng dạy", error);
      throw error;
    }
}