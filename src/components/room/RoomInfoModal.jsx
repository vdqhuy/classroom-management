import React, { useState } from "react";
import "../../css/Schedule.css"; // CSS tùy chỉnh cho modal
import { Modal } from "antd";
import { getBorrowedSupplyByMuon } from "../../services/roomService"; // Import hàm lấy dữ liệu vật tư mượn
import BorrowedItemsModal from "./BorrowedItemsModal"; // Import modal cho vật tư mượn

const RoomInfoModal = ({ isOpen, onClose, roomInfo, selectedLesson }) => {
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal cho vật tư mượn
    const [borrowedSupplyList, setBorrowedSupplyList] = useState([]); // Danh sách vật tư mượn

    if (!isOpen) return null;

    const getRoomType = (roomType) => {
        switch (roomType) {
            case "HOC":
            return "Học";
            case "THUCHANH":
            return "Thực hành";
            default:
            return roomType;
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "TRONG":
            return "Trống";
            case "DANGSUDUNG":
            return "Đang sử dụng";
            case "BAOTRI":
            return "Bảo trì";
            default:
            return status;  // Trường hợp trạng thái khác
        }
    };

    const fetchBorrowedSupply = async (maMuon) => {
        try {
          const borrowedSupplyData = await getBorrowedSupplyByMuon(maMuon)
          setBorrowedSupplyList(borrowedSupplyData); // Cập nhật danh sách vật tư mượn
          console.log(borrowedSupplyData)
          setIsModalVisible(true); // Mở modal cho vật tư mượn
        } catch (error) {
          console.error(
            "Lỗi khi lấy dữ liệu vật tư mượn:",
            error.response || error.message
          );
        }
    };

    return (
      <>
      <Modal
      title={
      <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
      Thông tin phòng
      </div>
      }
      visible={isOpen}
      onCancel={onClose}
      footer={null} // Remove the default footer provided by antd
      width={600}
      centered // Ensures the modal is vertically centered
      >
      <div className="modal-body">
      <div>
      <label>Mã phòng:</label>
      <span>{roomInfo.maPhong}</span>
      </div>
      <div>
      <label>Loại phòng:</label>
      <span>{getRoomType(roomInfo.loaiPhong)}</span>
      </div>
      <div>
      <label>Trạng thái:</label>
      <span>{getStatusText(roomInfo.trangThai)}</span>
      </div>
      <div>
      <label>Sức chứa:</label>
      <span>{roomInfo.sucChua}</span>
      </div>
      </div>
      <div className="modal-footer">
      <button
      className="modal-footer-button"
      onClick={onClose}
      style={{
      backgroundColor: '#ea6354',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'darkred'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#ea6354'}
      >
      Đóng
      </button>
      <button
      className="modal-footer-button"
      onClick={() => fetchBorrowedSupply(selectedLesson.muon.maMuon)}
      style={{
      color: 'white',
      cursor: 'pointer',
      marginLeft: '10px',
      transition: 'background-color 0.3s',
      }}
      >
      Xem vật tư
      </button>
      </div>
      </Modal>

        {/* Modal cho vật tư mượn */}
        <BorrowedItemsModal
            isVisible={isModalVisible}
            vattuBorrowed={borrowedSupplyList}
            onClose={() => setIsModalVisible(false)}
        />
    </>
    );
};

export default RoomInfoModal;