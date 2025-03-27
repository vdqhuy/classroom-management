import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getBorrowHistoryByUser = async (idnd) => {
    try {
        const response = await axios.get(`${API_URL}/muon/nguoidung/${idnd}`);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu mượn", error);
        throw error;
      }
}

export const setRoomReturn = async (maMuon) => {
    try {
        const response = await axios.put(`${API_URL}/muon/traphong/${maMuon}`);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi trả phòng", error);
        throw error;
      }
}

export const setBorrowedSupplyReturn = async (maMuonVatTu) => {
  try {
      const response = await axios.put(`${API_URL}/muonvattu/tra/${maMuonVatTu}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi trả vật tư", error);
      throw error;
    }
}

export const getBorrowedSupplyByMuon = async (maMuon) => {
    try {
        const response = await axios.get(`${API_URL}/muonvattu/${maMuon}`);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vật tư mượn", error);
        throw error;
      }
}

export const getBorrowIncidentByMaMuon = async (maMuon) => {
    try {
        const response = await axios.get(`${API_URL}/sucomuon/muon/${maMuon}`);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vật tư mượn", error);
        throw error;
      }
}

export const setBorrowIncident = async (incidentData) => {
    try {
        const response = await axios.post(`${API_URL}/sucomuon`, incidentData);
        return response.data;
      } catch (error) {
        console.error("Không thể thêm sự cố", error);
        throw error;
      }
}

export const getRoom = async (seats, type) => {
  try {
      const response = await axios.get(`${API_URL}/phong/search`,
        { params: { minSeats: seats, type: type } }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vật tư mượn", error);
      throw error;
    }
}

export const getVatTuByMaPhong = async (maPhong) => {
  try {
    const response = await axios.get(`${API_URL}/chiavattu/vattu?maphong=${maPhong}`);
    console.log(response.data)
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi lấy vật tư:", error.response?.data || error.message);
    throw error; // Ném lỗi ra để xử lý ở component
  }
};

export const borrowRoomAndSupply = async (muonPayload, selectedVattu, maMuon, borrowFormData) => {
  try {
    await axios.post(`${API_URL}/muon`, muonPayload)

    // Gửi yêu cầu mượn vật tư
    for (const vattu of selectedVattu) {
      const vatTuPayload = {
        muon: { maMuon },
        phong: { maPhong: borrowFormData.selectedRoom },
        chiaVatTu: { idVt: vattu.idVt },
        soLuong: vattu.soLuong,
        thoiGianMuon: borrowFormData.borrowTime,
        thoiGianTraDuTinh: borrowFormData.returnTime,
        thoiGianTraThucTe: null,
      };
      await axios.post(`${API_URL}/muonvattu/muon`, vatTuPayload);
    }

    return { success: true, maMuon };
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};