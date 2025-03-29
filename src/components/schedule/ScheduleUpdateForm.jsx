import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "antd";
import VattuList from "../room/VattuList";
import "../../css/RoomBooking.css";
import { getBorrowHistoryByUser, getRoom, getVatTuByMaPhong } from "../../services/roomService"
// getBorrowedSupplyByMuon
// borrowRoomAndSupply

const ScheduleChangeRequestForm = (lesson) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [vattu, setVattu] = useState([]);
    // const [borrowedByUser, setBorrowedByUser] = useState([]);
    const [muon, setMuon] = useState({});
    // const [error, setError] = useState("");
    const [numSeats, setNumSeats] = useState("");
    const idNguoiMuon = localStorage.getItem("idNguoiDung") || "";
    const [isBorrowFormVisible, setIsBorrowFormVisible] = useState(false);
    const [borrowFormData, setBorrowFormData] = useState({
      numSeats: "",
      selectedRoom: "",
      borrowTime: "",
      returnTime: "",
      vattu: [],
    });
    const [roomType, setRoomType] = useState("");
    const [modalWidth, setModalWidth] = useState(550);
    const [formData, setFormData] = useState({
      phong: "",
      lopHoc: "", // Giá trị mặc định
      monHoc: "", // Giá trị mặc định
      giangVien: "", // Giá trị mặc định
      thuTrongTuan: "",
      tietBatDau: "",
      tietKetThuc: "",
      tuan: "",
      ngayHoc: "",
    });
  
    const fetchVattu = useCallback(async () => {
      if (selectedRoom) {
        try {
          const vatTuData = await getVatTuByMaPhong(selectedRoom)
          setVattu(vatTuData);
          // console.log(vattu);
          if (vatTuData.length > 0) {
            setModalWidth(1050);
          }
        } catch (error) {
          // setError(
          //   "Lỗi khi lấy dữ liệu vật tư: " +
          //     (error.response?.status || error.message)
          // );
          console.error("Lỗi khi lấy dữ liệu vật tư", error)
        }
      } else {
        setVattu([]);
        setModalWidth(550);
      }
    }, [selectedRoom]);
  
    const fetchMuon = useCallback(async () => {
      if (idNguoiMuon) {
        try {
          await getBorrowHistoryByUser(idNguoiMuon)
          // setBorrowedByUser(borrowHistory);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu mượn", error)
        }
      }
    }, [idNguoiMuon]);
  
    const fetchData = useCallback(async () => {
      await fetchVattu();
      await fetchMuon();
    }, [fetchVattu, fetchMuon]);
  
    useEffect(() => {
      fetchData();
    }, [selectedRoom, fetchData]);
    // const checkIfAllReturned = async () => {
    //   fetchData();
    //   const hasOutstandingRooms = borrowedByUser.some(
    //     (item) => !item.thoiGianTraThucTe
    //   );
    //   let hasOutstandingItems = false;
    //   for (const borrow of borrowedByUser) {
    //     if (!borrow.thoiGianTraThucTe) {
    //       try {
    //         const items = await await getBorrowedSupplyByMuon(borrow.maMuon)
    //         if (items.some((item) => !item.thoiGianTraThucTe)) {
    //           hasOutstandingItems = true;
    //           break;
    //         }
    //       } catch (error) {
    //         console.error(
    //           "Lỗi khi kiểm tra vật tư mượn:",
    //           error.response || error.message
    //         );
    //         alert("Lỗi khi kiểm tra vật tư mượn!");
    //         return false;
    //       }
    //     }
    //   }
    //   return !(hasOutstandingRooms || hasOutstandingItems);
    // };
  
    const fetchRooms = async (seats, type) => {
      try {
        const roomData = await getRoom(seats, type)
        if (roomData.length > 0)
          setRooms(roomData);
        else
          setRooms([])
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng", error)
        // setError(
        //   "Lỗi khi lấy dữ liệu phòng: " +
        //     (error.response?.status || error.message)
        // );
      }
    };
  
    const handleNumSeatsChange = (e) => {
      const newNumSeats = e.target.value;
      setNumSeats(newNumSeats);
      setBorrowFormData((prev) => ({ ...prev, numSeats: newNumSeats }));
      if (newNumSeats && roomType) fetchRooms(newNumSeats, roomType);
    };
  
    const handleRoomTypeChange = async (type) => {
      await fetchVattu();
      setRoomType(type);
      setSelectedRoom("");
      if (numSeats) fetchRooms(numSeats, type);
    };
  
    const handleBorrowFormChange = (e) => {
      const { name, value } = e.target;
      setBorrowFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "selectedRoom"){
        setSelectedRoom(value)
      };
    };
  
    const showBorrowForm = async () => {
        setIsBorrowFormVisible(true);
        setModalWidth(550);
        console.log(lesson)
        // const allReturned = await checkIfAllReturned();
        // if (allReturned) {
        //   setIsBorrowFormVisible(true);
        //   setModalWidth(550);
        //   // Giả sử dữ liệu trong form nếu có lesson
        //   if (lesson) {
        //     setBorrowFormData({
        //       numSeats: lesson.sucChua || "", 
        //       selectedRoom: lesson.maPhong || "",
        //       borrowTime: new Date().toISOString().slice(0, 16), // Thời gian hiện tại
        //       returnTime: "", // Có thể đặt mặc định hoặc để trống
        //       vattu: lesson.vattu || [],
        //     });
        //     setNumSeats(lesson.sucChua || "");
        //     setSelectedRoom(lesson.maPhong || "");
        //     setRoomType(lesson.loaiPhong || "");
        //   }
        // } else {
        //   alert(
        //     "Bạn phải trả hết tất cả các phòng và vật tư đã mượn trước khi mượn phòng mới!"
        //   );
        // }
      };
      
  
    const hideBorrowForm = () => {
      console.log("hideBorrowForm called");
      setIsBorrowFormVisible(false);
      setBorrowFormData({
        numSeats: 0,
        selectedRoom: "",
        borrowTime: "",
        returnTime: "",
        vattu: [],
      });
      setNumSeats(0);
      setMuon({});
      setSelectedRoom("");
      setRoomType("");
      setModalWidth(550);
    };
  
    const handleScheduleUpdate = async () => {
      try {
          // Tạo object chứa dữ liệu cần gửi
          const updatedLesson = {
              maTkb: lesson.maTkb,  // Giữ nguyên mã thời khóa biểu
              phong: { maPhong: formData.phong }, // Chỉ gửi mã phòng
              ngayHoc: formData.ngayHoc, 
              tietBatDau: formData.tietBatDau, 
              tietKetThuc: formData.tietKetThuc
          };

          console.log("Dữ liệu gửi lên:", updatedLesson);

          // Gửi request đến API (đổi URL phù hợp với backend)
          const response = await fetch("https://your-api.com/update-schedule", {
              method: "PUT", // Hoặc "POST" nếu cần tạo mới
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedLesson),
          });

          if (!response.ok) {
              throw new Error("Cập nhật thất bại!");
          }

          // Nếu thành công, hiển thị thông báo & đóng modal
          alert("Cập nhật thành công!");
          hideBorrowForm();
      } catch (error) {
          console.error("Lỗi khi cập nhật:", error);
          alert("Có lỗi xảy ra! Vui lòng thử lại.");
      }
    };

    useEffect(() => {
        if (isBorrowFormVisible && lesson) {
          setBorrowFormData({
            numSeats: lesson.sucChua || "",
            selectedRoom: lesson.maPhong || "",
            borrowTime: new Date().toISOString().slice(0, 16),
            returnTime: "",
            vattu: lesson.vattu || [],
          });
          setNumSeats(lesson.sucChua || "");
          setSelectedRoom(lesson.maPhong || "");
          setRoomType(lesson.loaiPhong || "");
        }
      }, [isBorrowFormVisible, lesson]);
      
      const getThuTrongTuan = (date) => {
        const ngay = new Date(date);
        const thu = ngay.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7
        return thu === 0 ? "CN" : `Thứ ${thu + 1}`;
      };
    
      const getTuanHoc = (date) => {
        const ngay = new Date(date);
        const oneJan = new Date(ngay.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((ngay - oneJan) / 86400000) + 1;
        return Math.ceil(dayOfYear / 7);
      };      
    
      const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === "ngayHoc") {
          const thu = getThuTrongTuan(value);
          const tuan = getTuanHoc(value);
          setFormData({ ...formData, ngayHoc: value, thuTrongTuan: thu, tuan });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      };

      useEffect(() => {
        if (lesson) {
            setFormData({
                phong: lesson.phong?.maPhong || "", // Mã phòng
                lopHoc: lesson.lopHoc?.tenLop || "", // Tên lớp
                monHoc: lesson.monHoc?.tenMon || "", // Tên môn học
                giangVien: lesson.giangVien?.nguoiDung?.hoTen || "", // Tên giảng viên
                thuTrongTuan: lesson.thuTrongTuan || "",
                tietBatDau: lesson.tietBatDau || "",
                tietKetThuc: lesson.tietKetThuc || "",
                tuan: lesson.tuan || "",
                ngayHoc: lesson.ngayHoc || "",
            });
        }
      }, [lesson]);
  
    return (
      <>
        <Button
          onClick={showBorrowForm}
        >
          Đổi lịch
        </Button>
        <Modal
          title={
            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              Thay đổi lịch dạy
            </div>
          }
          open={isBorrowFormVisible}
          onCancel={hideBorrowForm}
          onOk={handleScheduleUpdate}
          width={modalWidth}
          styles={{ body: { display: "flex" } }}
          closable={true}
          maskClosable={true}
        >
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <form>
              <div>
                <label>
                  <input
                    type="radio"
                    name="roomType"
                    value="HOC"
                    checked={roomType === "HOC"}
                    onChange={() => handleRoomTypeChange("HOC")}
                  />
                  Phòng Học
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    name="roomType"
                    value="THUCHANH"
                    checked={roomType === "THUCHANH"}
                    onChange={() => handleRoomTypeChange("THUCHANH")}
                  />
                  Phòng Thực Hành
                </label>
              </div>
              <div>
                <label style={{ marginRight: "60px" }}>Số lượng chỗ:</label>
                <input
                  type="number"
                  name="numSeats"
                  min="1"
                  value={borrowFormData.numSeats}
                  onChange={handleNumSeatsChange}
                />
              </div>
              <div>
                <label style={{ marginRight: "70px" }}>Chọn phòng:</label>
                <select
                  className="selectroom"
                  name="selectedRoom"
                  value={borrowFormData.selectedRoom}
                  onChange={handleBorrowFormChange}
                  disabled={!roomType || !numSeats}
                >
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map((room) => (
                    <option key={room.maPhong} value={room.maPhong}>
                      {room.maPhong} (Sức chứa: {room.sucChua})
                    </option>
                  ))}
                </select>
              </div>
              <label>
                Ngày học:
                <input type="date" name="ngayHoc" value={formData.ngayHoc} onChange={handleDateChange} required />
              </label>
              <p><strong>Thứ trong tuần:</strong> {formData.thuTrongTuan || "Chọn ngày học"}</p>
              <p><strong>Tuần:</strong> {formData.tuan || "Chọn ngày học"}</p>
              <label>
                Tiết bắt đầu:
                <input type="number" name="tietBatDau" value={formData.tietBatDau} onChange={handleDateChange} required />
              </label>
              <label>
                Tiết kết thúc:
                <input type="number" name="tietKetThuc" value={formData.tietKetThuc} onChange={handleDateChange} required />
              </label>
            </form>
          </div>
          {selectedRoom && vattu.length > 0 && (
            <div style={{ flex: 1 }}>
              <VattuList vattu={vattu} setMuon={setMuon} Muon={muon} />
            </div>
          )}
        </Modal>
      </>
    );
  };

export default ScheduleChangeRequestForm;
