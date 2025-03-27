import axios from 'axios';

const API_URL = "http://localhost:8080/api/thongbao"

export const getNotificationByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/nguoinhan/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông báo (notificationService)", error);
        throw error;
    }
};

export const sendNotification = (notification) => {
  return axios.post('/api/notifications', notification);
};

export const updateNotificationStatus = async (idTB) => {
    try {
      const response = await axios.put(`${API_URL}/trangthai/capnhat?idTB=${idTB}&trangThai=DADOC`);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response || error.message);
      throw error;
    }
  };
