import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getTeacherById = async (teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/giangvien/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin giảng viên", error);
        throw error;
    }
};

export const getTeacherByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/giangvien/nguoidung/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin giảng viên", error);
        throw error;
    }
}

export const getStudentListByClassId = async (classId) => {
    try {
        const response = await axios.get(`${API_URL}/sinhvien/lop/${classId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sinh viên", error);
        throw error;
    }
}
