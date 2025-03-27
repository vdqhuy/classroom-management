import React, { useState, useEffect, useCallback } from 'react';
import "../css/Notification.css";
import { Modal } from 'antd';
import { getNotificationByUser, updateNotificationStatus } from "../services/notificationService"

function Notification() {
  const [thongBaoList, setThongBaoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [selectedThongBaoNhan, setselectedThongBaoNhan] = useState(null);
  const [selectedThongBaoGui, setselectedThongBaoGui] = useState(null);
  const userId = localStorage.getItem("idNguoiDung") || "";
  // const [error, setError] = useState("");
  // const vaiTroUser = localStorage.getItem("vaiTro") || "";

  const fetchNotification =  useCallback(async () => {
    if (userId) {
      try {
        const notification = await getNotificationByUser(userId)
        // console.log(notification)
        setThongBaoList(notification);
      } catch (error) {
        // setError(
        //   "Lỗi khi lấy dữ liệu thông báo: " +
        //     (error.response?.status || error.message)
        // );
        console.error(error.response?.status || error.message)
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  const openModal = (thongBao) => {
    // console.log(thongBao);
    // setselectedThongBaoNhan(thongBao);
    setselectedThongBaoGui(thongBao.thongBaoGui)
    
    setShowModal(true);
    if (thongBao.trangThai === "CHUADOC") {
      updateNotificationStatus(thongBao.id)
        .then(() => {
          setThongBaoList((prevList) =>
            prevList.map((tb) =>
              tb.id === thongBao.id ? { ...tb, trangThai: "DADOC" } : tb
            )
          );
        })
        .catch((error) => {
          alert("Lỗi khi cập nhật trạng thái thông báo!");
          console.error("Error:", error.response || error.message);
        });
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    // setselectedThongBaoNhan(null);
    setselectedThongBaoGui(null);
  };

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
    <div>
      <h1>Thông Báo</h1>
      <div className="container">
        <div className="right-panel">
          <h2>Danh sách thông báo</h2>
          {thongBaoList.length === 0 ? (
            <p>Không có thông báo nào</p>
          ) : (
            <div className="thongbao-container">
            <table className="thongbao-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Ngày gửi</th>
                  <th>Xem</th>
                </tr>
              </thead>
              <tbody>
                {thongBaoList
                 .sort((a, b) => new Date(b.thongBaoGui.thoiGian) - new Date(a.thongBaoGui.thoiGian))
                 .map((thongBao, index) => {
                   const thongBaoGui = thongBao.thongBaoGui
                  //  console.log(thongBaoGui)
                  //  const benGuiText = thongBaoGui.nguoiGui.hoTen;
                  //  const benNhanText = thongBao.nguoiNhan.hoTen;
                  //  const tieuDeText = `${benGuiText} gửi cho ${benNhanText} về vấn đề ${thongBaoGui.tieuDe}`;
                   return (
                        <tr
                            key={index}
                            className={thongBao.trangThai === "CHUADOC" ? "chuadoc" : "dadoc"}
                        >
                        <td>{index + 1}</td>
                        <td>{thongBaoGui.tieuDe}</td>
                        <td>{formatDateTime(thongBaoGui.thoiGian)}</td>
                        <td>
                          <button onClick={() => openModal(thongBao)}>{thongBao.trangThai === "CHUADOC" ? "Chưa xem" : "Đã xem"}</button>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

        <Modal
        title={<div className="modal-header">NỘI DUNG THÔNG BÁO<hr/></div>}
        open={showModal}
        onCancel={closeModal}
        width={800}
        className="modal-content"
        footer={[
          <button key="close" onClick={closeModal} className="modal-footer-button">
            Đóng
          </button>
        ]} 
        >
        {selectedThongBaoGui && (
            <div className="modal-body">
            <div>
            <label>Ngày gửi:</label>
                <span>{formatDateTime(selectedThongBaoGui.thoiGian)}</span>
            </div>
            <div>
            <label>Tiêu đề:</label>
                <span>
                    {selectedThongBaoGui.tieuDe
                    /* {selectedThongBaoGui.nguoiGui.idNguoiDung} gửi cho{" "}
                    {selectedThongBaoNhan.nguoiNhan.hoTen} về vấn đề{" "}
                    {selectedThongBaoNhan.tieuDe} */}
                </span>
            </div>
            <div>
                <label>Nội dung:</label>
                <span>{selectedThongBaoGui.noiDung}</span>
            </div>
            <hr/>
        </div>
        )}
        </Modal>

    </div>
  );
}

export default Notification;





// import React, { useEffect, useState } from "react";
// import { getNotificationsByMaGV, sendNotification } from "../services/notificationService";
// import Header from "../components/Header";

// const NotificationPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [newNotification, setNewNotification] = useState({
//     idNguoiGui: "",
//     vaiTroBenGui: "Giảng viên",
//     idNguoiNhan: "",
//     vaiTroNguoiNhan: "Sinh viên",
//     idLopNhan: "",
//     tieuDe: "",
//     noiDung: "",
//     thoiGian: new Date().toISOString(),
//     thongBaoTrangThai: "chua_doc",
//   });

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const data = await getNotificationsByMaGV("gv001");
//       setNotifications(data);
//     } catch (error) {
//       console.error("Lỗi khi tải thông báo:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
//   };

//   const handleSendNotification = async () => {
//     try {
//       await sendNotification(newNotification);
//       fetchNotifications();
//       alert("Gửi thông báo thành công!");
//     } catch (error) {
//       console.error("Lỗi khi gửi thông báo:", error);
//     }
//   };

//   return (
//     <>
//         <Header />
//         <div>
//         <h2>Danh sách thông báo</h2>
//         <ul>
//             {notifications.map((tb) => (
//             <li key={tb.idTb}>
//                 <strong>{tb.tieuDe}</strong>: {tb.noiDung} ({tb.thoiGian})
//             </li>
//             ))}
//         </ul>

//         <h3>Gửi thông báo</h3>
//         <input type="text" name="tieuDe" placeholder="Tiêu đề" onChange={handleInputChange} />
//         <textarea name="noiDung" placeholder="Nội dung" onChange={handleInputChange} />
//         <button onClick={handleSendNotification}>Gửi</button>
//         </div>
//     </>
//   );
// };

// export default NotificationPage;
