import React from "react";
import "../../css/Schedule.css"; // CSS tùy chỉnh cho modal
import { Modal } from "antd";

const RoomInfoModal = ({ isOpen, onClose, roomInfo }) => {
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
            <button className="modal-footer-button" onClick={onClose}>
              Đóng
            </button>
          </div>
        </Modal>
      </>
    );
};

export default RoomInfoModal;