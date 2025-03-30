import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "antd";
import VattuList from "../room/VattuList";
import "../../css/RoomBooking.css";
import { getBorrowHistoryByUser, getRoom, getVatTuByMaPhong } from "../../services/roomService"
import { updateSchedule } from "../../services/scheduleService";
// getBorrowedSupplyByMuon
// borrowRoomAndSupply

const ScheduleChangeForm = ({ selectedLesson, setSelectedLesson, lesson }) => {
    // console.log(selectedLesson)
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [vattu, setVattu] = useState([]);
    // const [borrowedByUser, setBorrowedByUser] = useState([]);
    const [muon, setMuon] = useState({});
    // const [error, setError] = useState("");
    const [numSeats, setNumSeats] = useState("");
    const idNguoiMuon = localStorage.getItem("idNguoiDung") || "";
    const [isBorrowFormVisible, setIsBorrowFormVisible] = useState(false);
    // const [borrowFormData, setBorrowFormData] = useState({
    //   numSeats: "",
    //   selectedRoom: "",
    //   borrowTime: "",
    //   returnTime: "",
    //   vattu: [],
    // });
    const [roomType, setRoomType] = useState("");
    const [modalWidth, setModalWidth] = useState(550);
    const [formData, setFormData] = useState({
      phong: { maPhong: "" },
      lopHoc: { maLop: "" },
      monHoc: { maMon: "" },
      giangVien: { maGv: "" },
      thuTrongTuan: "",
      tietBatDau: null,
      tietKetThuc: null,
      tuan: null,
      ngayHoc: "",
      muon: { maMuon: "" }
    });
    
    // Cập nhật formData khi selectedLesson thay đổi
    useEffect(() => {
      if (selectedLesson) {
        setFormData({
          phong: { maPhong: selectedRoom || "" },
          lopHoc: { maLop: selectedLesson?.lopHoc?.maLop || "" },
          monHoc: { maMon: selectedLesson?.monHoc?.maMon || "" },
          giangVien: { maGv: selectedLesson?.giangVien?.maGv || "" },
          thuTrongTuan: selectedLesson?.thuTrongTuan || "",
          tietBatDau: selectedLesson?.tietBatDau ?? null,
          tietKetThuc: selectedLesson?.tietKetThuc ?? null,
          tuan: selectedLesson?.tuan ?? null,
          ngayHoc: selectedLesson?.ngayHoc || "",
          muon: { maMuon: selectedLesson?.muon.maMuon || null }
        });
      }
    }, [selectedLesson, selectedRoom]); // Chạy lại khi `selectedLesson` thay đổi

  
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
      // setBorrowFormData((prev) => ({ ...prev, numSeats: newNumSeats }));
      setFormData((prev) => ({ ...prev, numSeats: newNumSeats }));
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
      // setBorrowFormData((prev) => ({ ...prev, [name]: value }));
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "selectedRoom"){
        setSelectedRoom(value)
      };
    };
  
    const showBorrowForm = async () => {
        if (setSelectedLesson)
          console.log(lesson)
          setSelectedLesson(lesson)
        setIsBorrowFormVisible(true);
        setModalWidth(550);
        // const allReturned = await checkIfAllReturned();
        // if (allReturned) {
        //   setIsBorrowFormVisible(true);
        //   setModalWidth(550);
        //   // Giả sử dữ liệu trong form nếu có selectedLesson
        //   if (selectedLesson) {
        //     setBorrowFormData({
        //       numSeats: selectedLesson.sucChua || "", 
        //       selectedRoom: selectedLesson.maPhong || "",
        //       borrowTime: new Date().toISOString().slice(0, 16), // Thời gian hiện tại
        //       returnTime: "", // Có thể đặt mặc định hoặc để trống
        //       vattu: selectedLesson.vattu || [],
        //     });
        //     setNumSeats(selectedLesson.sucChua || "");
        //     setSelectedRoom(selectedLesson.maPhong || "");
        //     setRoomType(selectedLesson.loaiPhong || "");
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
      setFormData({
        phong: { maPhong: selectedLesson?.phong?.maPhong || "" },
        lopHoc: { maLop: selectedLesson?.lopHoc?.maLop || "" },
        monHoc: { maMon: selectedLesson?.monHoc?.maMon || "" },
        giangVien: { maGv: selectedLesson?.giangVien?.maGv || "" },
        thuTrongTuan: selectedLesson?.thuTrongTuan || "",
        tietBatDau: selectedLesson?.tietBatDau ?? null,
        tietKetThuc: selectedLesson?.tietKetThuc ?? null,
        tuan: selectedLesson?.tuan ?? null,
        ngayHoc: selectedLesson?.ngayHoc || "",
        muon: { maMuon: selectedLesson?.muon.maMuon || null }
      });
      setNumSeats(0);
      setMuon({});
      setSelectedRoom("");
      setRoomType("");
      setModalWidth(550);
    };
  
    const handleScheduleUpdate = async () => {
      try {
        const data = await updateSchedule(lesson.maTkb, formData)
        alert('Cập nhật thành công:', data);
        window.location.reload();
      } catch (error) {
        alert('Lỗi cập nhật lịch:', error);
      }
    };

      const getThuTrongTuan = (date) => {
        const ngay = new Date(date);
        const thu = ngay.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7
        const thuMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        return thuMap[thu];
      };

      const getTuanHocISO = (date) => {
        const ngay = new Date(date);
        
        // Lấy thứ của ngày đầu năm (0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy)
        const oneJan = new Date(ngay.getFullYear(), 0, 1);
        const dayOfWeek = oneJan.getDay(); 
    
        // Điều chỉnh để thứ Hai là ngày đầu tuần (ISO 8601)
        const offset = (dayOfWeek <= 4) ? dayOfWeek - 1 : dayOfWeek - 8;
    
        // Tính số ngày trong năm kể từ ngày 4/1 (tuần 1 của ISO 8601)
        const dayOfYear = Math.floor((ngay - oneJan + offset * 86400000) / 86400000) + 1;
    
        // Tính tuần theo ISO 8601
        return Math.ceil(dayOfYear / 7);
    };
    
      const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === "ngayHoc") {
          const thu = getThuTrongTuan(value);
          const tuan = getTuanHocISO(value);
          setFormData({ ...formData, ngayHoc: value, thuTrongTuan: thu, tuan });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      };
  
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
                <div>
                  <label><strong>Phòng đang mượn: </strong> {selectedLesson?.phong?.maPhong}</label>
                </div>
                <br></br>
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
                  value={formData.phong.sucChua}
                  onChange={handleNumSeatsChange}
                />
              </div>
              <div>
                <label style={{ marginRight: "70px" }}>Chọn phòng:</label>
                <select
                  className="selectroom"
                  name="selectedRoom"
                  defaultValue={formData.phong.maPhong}
                  value={selectedRoom}
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
              <div>
                <label style={{ marginRight: "90px" }}>Ngày học:</label>
                <input type="date" name="ngayHoc" value={formData.ngayHoc} onChange={handleDateChange} required />
              </div>
              <label><strong>Thứ trong tuần:</strong> {formData.thuTrongTuan || "Chọn ngày học"}</label>
              <label><strong>Tuần:</strong> {formData.tuan || "Chọn ngày học"}</label>
              <div>
                <label style={{ marginRight: "75px" }}>Tiết bắt đầu:</label>
                <input type="number" name="tietBatDau" value={formData.tietBatDau} onChange={handleDateChange} required />
              </div>
              <div>
                <label style={{ marginRight: "75px" }}>Tiết kết thúc:</label>
                <input type="number" name="tietKetThuc" value={formData.tietKetThuc} onChange={handleDateChange} required />
              </div>
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

export default ScheduleChangeForm;
