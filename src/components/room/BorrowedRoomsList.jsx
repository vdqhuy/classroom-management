import React, { useState, useEffect, useCallback } from "react";
import { getBorrowHistoryByUser, setRoomReturn, getBorrowedSupplyByMuon, getBorrowIncidentByMaMuon, setBorrowIncident } from "../../services/roomService"
import { Button, Modal, Form, Input, message } from "antd";
import BorrowedItemsModal from "./BorrowedItemsModal";

const { TextArea } = Input;

const BorrowedRoomsList = () => {
  const [borrowedByUser, setBorrowedByUser] = useState([]);
  // const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal cho vật tư mượn
  const [vattuBorrowed, setVattuBorrowed] = useState([]);
  const [currentMaMuon, setCurrentMaMuon] = useState(null);
  const [isSuCoModalVisible, setIsSuCoModalVisible] = useState(false); // Modal cho sự cố
  const [suCoList, setSuCoList] = useState([]); // Danh sách sự cố
  const [hasSuCo, setHasSuCo] = useState(false); // Cờ kiểm tra có sự cố hay không
  const [form] = Form.useForm(); // Form để nhập thông tin sự cố mới
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file ảnh được chọn
  const idNguoiMuon = localStorage.getItem("idNguoiDung") || "";

  const fetchBorrowHistory = useCallback(async () => {
    if (idNguoiMuon) {
      try {
        const borrowHistory = await getBorrowHistoryByUser(idNguoiMuon)
        setBorrowedByUser(borrowHistory);
      } catch (error) {
        // setError(
        //   "Lỗi khi lấy dữ liệu mượn: " +
        //     (error.response?.status || error.message)
        // );
      }
    }
  }, [idNguoiMuon]);

  useEffect(() => {
    fetchBorrowHistory();
  }, [fetchBorrowHistory]);

  const handleRoomReturn = async (maMuon) => {
    try {
      const roomReturnStatus = await setRoomReturn(maMuon)
      console.log(roomReturnStatus)
      alert(`Trả phòng ${roomReturnStatus.phong.maPhong} thành công!`);
      fetchBorrowHistory();
    } catch (error) {
      alert("Lỗi khi trả phòng!");
      console.error("Error returning room:", error.response || error.message);
    }
  };

  const fetchBorrowedSupply = async (maMuon) => {
    try {
      const borrowedSupplyData = await getBorrowedSupplyByMuon(maMuon)
      setVattuBorrowed(borrowedSupplyData);
      setCurrentMaMuon(maMuon);
      setIsModalVisible(true);
    } catch (error) {
      console.error(
        "Lỗi khi lấy dữ liệu vật tư mượn:",
        error.response || error.message
      );
    }
  };

  // Hàm lấy danh sách sự cố mượn theo mã mượn
  const fetchBorrowIncident = async (maMuon) => {
    try {
      const borrowIncidentData = await getBorrowIncidentByMaMuon(maMuon)
      setSuCoList(borrowIncidentData);
      setHasSuCo(borrowIncidentData.length > 0); // Kiểm tra có sự cố hay không
      setCurrentMaMuon(maMuon);
      setIsSuCoModalVisible(true);
    } catch (error) {
      console.error(
        "Lỗi khi lấy dữ liệu sự cố mượn:",
        error.response || error.message
      );
      message.error("Không thể lấy dữ liệu sự cố!");
    }
  };

  // Hàm xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      form.setFieldsValue({ minhChung: file.name }); // Hiển thị tên file trong form
    }
  };

  // Hàm ghi sự cố mượn mới
  const handleAddSuCo = async (values) => {
    const suCoData = {
      maMuon: currentMaMuon,
      benNhan: "ql001", // Mặc định bên nhận là "ql001"
      benGui: idNguoiMuon, // Người gửi là người dùng hiện tại
      vaiTroBenGui: "GV", // Mặc định vai trò bên gửi là "GV"
      tieuDe: values.tieuDe,
      noiDung: values.noiDung,
      thoiGian: new Date().toISOString(), // Thời gian hiện tại
      minhChung: selectedFile ? selectedFile.name : null, // Lưu tên file ảnh
    };

    const addIncidentStatus = setBorrowIncident(suCoData)
    if (addIncidentStatus) {
      message.success("Thêm sự cố thành công!");
      setIsSuCoModalVisible(false);
      setSelectedFile(null); // Reset file sau khi gửi
      fetchBorrowIncident(currentMaMuon); // Làm mới danh sách sự cố
    } else {
      message.error("Thêm sự cố thất bại!");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setVattuBorrowed([]);
  };

  const handleCloseSuCoModal = () => {
    setIsSuCoModalVisible(false);
    setSuCoList([]);
    setHasSuCo(false);
    setSelectedFile(null); // Reset file khi đóng modal
    form.resetFields(); // Reset form khi đóng modal
  };

  const sortedBorrowedByUser = [...borrowedByUser].sort((a, b) => {
    return b.maMuon.localeCompare(a.maMuon);
  });

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <>
      {
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2>Lịch sử mượn phòng:</h2>
          </div>
          <table className="muon-table">
            <thead>
              <tr>
                <th>Mã Mượn</th>
                <th>Mã Phòng</th>
                <th>Thời Gian Mượn</th>
                <th>Thời Gian Trả Dự Tính</th>
                <th>Thời Gian Trả Thực Tế</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedBorrowedByUser.map((item) => (
                <tr key={item.maMuon}>
                  <td>{item.maMuon}</td>
                  <td>{item.phong.maPhong}</td>
                  <td>{formatDateTime(item.thoiGianMuon)}</td>
                  <td>{formatDateTime(item.thoiGianTraDuTinh)}</td>
                  <td>
                    {item.thoiGianTraThucTe
                      ? formatDateTime(item.thoiGianTraThucTe)
                      : "Chưa trả"}
                  </td>
                  <td>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => fetchBorrowedSupply(item.maMuon)}
                    >
                      Xem vật tư mượn
                    </Button>
                    {!item.thoiGianTraThucTe ? (
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => handleRoomReturn(item.maMuon)}
                      >
                        Trả
                      </Button>
                    ) : (
                      <Button type="default" danger size="small" disabled>
                        Đã Trả
                      </Button>
                    )}
                    <Button
                      type="default"
                      size="small"
                      onClick={() => fetchBorrowIncident(item.maMuon)}
                      style={{ marginLeft: "5px" }}
                    >
                      Sự cố
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      }

      {/* Modal cho vật tư mượn */}
      <BorrowedItemsModal
        isVisible={isModalVisible}
        vattuBorrowed={vattuBorrowed}
        onClose={handleCloseModal}
        fetchBorrowHistory={fetchBorrowHistory}
        currentMaMuon={currentMaMuon}
      />

      {/* Modal cho sự cố mượn */}
      <Modal
        title={hasSuCo ? "Danh sách sự cố mượn" : "Báo cáo sự cố mượn"}
        visible={isSuCoModalVisible}
        onCancel={handleCloseSuCoModal}
        footer={hasSuCo ? [<Button key="close" onClick={handleCloseSuCoModal}>Đóng</Button>] : null}
      >
        {hasSuCo ? (
          <div>
            {suCoList.map((suCo) => (
              <div
                key={suCo.idSucoMuon}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <p><strong>Tiêu đề:</strong> {suCo.tieuDe}</p>
                <p><strong>Nội dung:</strong> {suCo.noiDung}</p>
                <p><strong>Thời gian:</strong> {formatDateTime(suCo.thoiGian)}</p>
                <p><strong>Minh chứng:</strong> {suCo.minhChung || "Không có"}</p>
                <p><strong>Bên gửi:</strong> {suCo.benGui.hoTen} ({suCo.benGui.vaiTro.tenVaiTro})</p>
                <p><strong>Bên nhận:</strong> {suCo.benNhan.hoTen} (Admin)</p>
                <p><strong>Tổng thiệt hại:</strong> {suCo.tongThietHai}</p>
              </div>
            ))}
          </div>
        ) : (
          <Form
            form={form}
            onFinish={handleAddSuCo}
            layout="vertical"
          >
            <Form.Item
              label="Tiêu đề"
              name="tieuDe"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nội dung"
              name="noiDung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Minh chứng (chọn ảnh từ thiết bị)"
              name="minhChung"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p>Đã chọn: {selectedFile.name}</p>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi sự cố
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default BorrowedRoomsList;