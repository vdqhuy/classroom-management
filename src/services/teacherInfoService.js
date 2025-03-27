import axios from "axios";

const API_URL = "http://localhost:8080/api/giangvien";

export const getTeacherById = async (teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin giảng viên", error);
        throw error;
    }
};

export const getTeacherByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/nguoidung/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin giảng viên", error);
        throw error;
    }
}
