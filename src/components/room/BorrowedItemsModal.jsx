import React from "react";
import { Modal } from "antd";
// import { setBorrowedSupplyReturn } from "../../services/roomService"

const BorrowedItemsModal = ({
  isVisible,
  vattuBorrowed,
  onClose,
  fetchBorrowHistory,
  currentMaMuon,
}) => {

  // const handleReturn = async (borrowSupplyId) => {
  //   try {
  //     const supplyReturnData = await setBorrowedSupplyReturn(borrowSupplyId)
  //     console.log(supplyReturnData)
  //     if (supplyReturnData) {
  //       alert("Trả vật tư thành công!");
  //       onClose()
  //       fetchBorrowHistory();
  //     }
  //   } catch (error) {
  //     alert("Lỗi khi trả vật tư!");
  //     console.error("Error returning item:", error.response || error.message);
  //   }
  // };
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    return `${day}/${month}/${year} ${hours}:${minutes}`; 
  };
  return (
    <Modal
      title={<div style={{ marginLeft: "36%", fontSize: "24px",color:"#2EA2E4" }}>Danh sách vật tư mượn</div>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className="vattu-modal"
      width={1000}
    >
      <div className="vattu-table-container">
        {vattuBorrowed.length > 0 ? (
          <table className="vattu-table">
            <thead>
              <tr>
                <th>Tên Vật Tư</th>
                <th>Số Lượng</th>
                <th>Mã Phòng</th>
                <th>Thời gian mượn</th>
                <th>Thời gian trả dự tính</th>
                <th>Thời gian trả thực tế</th>
                <th>Trả vật tư</th>
              </tr>
            </thead>
            <tbody>
              {vattuBorrowed.map((item) => (
                <tr key={item.chiaVatTu.vatTu.maVt}>
                  <td>{item.chiaVatTu.vatTu.tenVt}</td>
                  <td>{item.soLuong}</td>
                  <td>
                    {item.phong.tenPhong === null || item.phong.tenPhong === undefined
                      ? "Tự do"
                      : item.phong.tenPhong}
                  </td>
                  <td>{formatDateTime(item.thoiGianMuon)}</td>
                  <td>{formatDateTime(item.thoiGianTraDuTinh)}</td>
                  <td>{formatDateTime(item.thoiGianTraThucTe) || "Chưa trả"}</td>
                  <td>
                    {item.thoiGianTraThucTe ? (
                      <span>Đã trả</span>
                      // <Button type="default" size="small" disabled>
                      //   Đã Trả
                      // </Button>
                    ) : (
                      <span>Chưa trả</span>
                      // <Button
                      //   type="primary"
                      //   danger
                      //   size="small"
                      //   onClick={() => handleReturn(item.maMuonVatTu)}
                      // >
                      //   Trả
                      // </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có vật tư nào.</p>
        )}
      </div>
    </Modal>
  );
};

export default BorrowedItemsModal;