import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "antd";
import VattuList from "../room/VattuList";
import "../../css/RoomBooking.css";
import { getBorrowHistoryByUser, getBorrowedSupplyByMuon, getRoom, getVatTuByMaPhong, borrowRoomAndSupply } from "../../services/roomService"

const ScheduleChangeRequestForm = (roomInfo) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [vattu, setVattu] = useState([]);
    const [borrowedByUser, setBorrowedByUser] = useState([]);
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
          const borrowHistory = await getBorrowHistoryByUser(idNguoiMuon)
          setBorrowedByUser(borrowHistory);
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
    const checkIfAllReturned = async () => {
      fetchData();
      const hasOutstandingRooms = borrowedByUser.some(
        (item) => !item.thoiGianTraThucTe
      );
      let hasOutstandingItems = false;
      for (const borrow of borrowedByUser) {
        if (!borrow.thoiGianTraThucTe) {
          try {
            const items = await await getBorrowedSupplyByMuon(borrow.maMuon)
            if (items.some((item) => !item.thoiGianTraThucTe)) {
              hasOutstandingItems = true;
              break;
            }
          } catch (error) {
            console.error(
              "Lỗi khi kiểm tra vật tư mượn:",
              error.response || error.message
            );
            alert("Lỗi khi kiểm tra vật tư mượn!");
            return false;
          }
        }
      }
      return !(hasOutstandingRooms || hasOutstandingItems);
    };
  
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
        const allReturned = await checkIfAllReturned();
        if (allReturned) {
          setIsBorrowFormVisible(true);
          // Giả sử dữ liệu trong form nếu có roomInfo
          if (roomInfo) {
            setBorrowFormData({
              numSeats: roomInfo.sucChua || "", 
              selectedRoom: roomInfo.maPhong || "",
              borrowTime: new Date().toISOString().slice(0, 16), // Thời gian hiện tại
              returnTime: "", // Có thể đặt mặc định hoặc để trống
              vattu: roomInfo.vattu || [],
            });
            setNumSeats(roomInfo.sucChua || "");
            setSelectedRoom(roomInfo.maPhong || "");
            setRoomType(roomInfo.loaiPhong || "");
          }
      
          setModalWidth(550);
        } else {
          alert(
            "Bạn phải trả hết tất cả các phòng và vật tư đã mượn trước khi mượn phòng mới!"
          );
        }
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
  
    const handleBorrowFormSubmit = async () => {
      if (
        !borrowFormData.selectedRoom ||
        !borrowFormData.borrowTime ||
        !borrowFormData.returnTime ||
        !borrowFormData.numSeats
      ) {
        alert("Vui lòng nhập đầy đủ thông tin trước khi mượn phòng!");
        return;
      }
      if (!borrowFormData.selectedRoom || !borrowFormData.borrowTime || !borrowFormData.returnTime || !borrowFormData.numSeats) {
        alert("Vui lòng nhập đầy đủ thông tin trước khi mượn phòng!");
        return;
    }
      let updatedMuon = { ...muon }; 
      try {
        const vattuData = await getVatTuByMaPhong(borrowFormData.selectedRoom)
        const newMuon = {};
        vattuData.forEach((item) => {
          if (item.soLuong > 0) {
            newMuon[item.idVt] = item.soLuong;
          }
        });
        console.log("Dữ liệu newMuon sau khi xử lý:", newMuon);
        updatedMuon = { ...updatedMuon, ...newMuon }; 
        setMuon(updatedMuon);
      } catch (error) {
        alert("Lỗi khi lấy vật tư: " + (error.response?.data || error.message));
        return;
      }
    
  
      const selectedVattu = Object.entries(updatedMuon)
        .filter(([_, quantity]) => quantity && parseInt(quantity) > 0)
        .map(([idVt, quantity]) => ({ idVt, soLuong: parseInt(quantity) }));
    
      const idNguoiMuon = localStorage.getItem("idNguoiDung") || "";
      // const vaiTroNguoiMuon = localStorage.getItem("vaiTro") || "GiangVien";
      const maMuon = `M${Date.now()}`;
    
      const muonPayload = {
        maMuon,
        phong: { maPhong: borrowFormData.selectedRoom },
        nguoiMuon: { idNguoiDung: idNguoiMuon },
        thoiGianMuon: borrowFormData.borrowTime,
        thoiGianTraDuTinh: borrowFormData.returnTime,
        thoiGianTraThucTe: null,
        traTatCaVatTu: false
      };
    
      try {
        await borrowRoomAndSupply(muonPayload, selectedVattu, maMuon, borrowFormData);
        alert("Mượn phòng và vật tư thành công! Mã mượn: " + maMuon);
        setMuon({});
        hideBorrowForm();
        await fetchMuon();
      } catch (error) {
        alert("Lỗi khi mượn: " + (error.response?.data || error.message));
      }
      window.location.reload();
    };

    useEffect(() => {
        if (isBorrowFormVisible && roomInfo) {
          setBorrowFormData({
            numSeats: roomInfo.sucChua || "",
            selectedRoom: roomInfo.maPhong || "",
            borrowTime: new Date().toISOString().slice(0, 16),
            returnTime: "",
            vattu: roomInfo.vattu || [],
          });
          setNumSeats(roomInfo.sucChua || "");
          setSelectedRoom(roomInfo.maPhong || "");
          setRoomType(roomInfo.loaiPhong || "");
        }
      }, [isBorrowFormVisible, roomInfo]);
      
  
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
              Yêu cầu thay đổi lịch dạy
            </div>
          }
          open={isBorrowFormVisible}
          onCancel={hideBorrowForm}
          onOk={handleBorrowFormSubmit}
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
              <div>
                <label style={{ marginRight: "42px" }}>Thời gian mượn:</label>
                <input
                  type="datetime-local"
                  name="borrowTime"
                  value={borrowFormData.borrowTime}
                  onChange={handleBorrowFormChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label style={{ marginRight: "11px" }}>Thời gian trả dự tính:</label>
                <input
                  type="datetime-local"
                  name="returnTime"
                  value={borrowFormData.returnTime}
                  onChange={handleBorrowFormChange}
                  min={borrowFormData.borrowTime}
                />
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

export default ScheduleChangeRequestForm;
