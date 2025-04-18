import React, { useState, useEffect, useCallback } from "react";
import { getBorrowHistoryByUser, setRoomReturn, getBorrowedSupplyByMuon, getBorrowIncidentByMaMuon, setBorrowIncident } from "../../services/roomService"
import { Button, Modal, Form, Input, message, Radio } from "antd";
import BorrowedItemsModal from "./BorrowedItemsModal";
import { uploadImage } from "../../services/firebaseStorageService"; // Import hàm tải ảnh lên Firebase

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

  const fetchBorrowedSupplyForIncident = async (maMuon) => {
    try {
      const borrowedSupplyData = await getBorrowedSupplyByMuon(maMuon)
      setVattuBorrowed(borrowedSupplyData);
      setCurrentMaMuon(maMuon);
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

  // Hàm xử lý khi người dùng chọn file ảnh và upload lên Firebase
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadResult = await uploadImage(file);
        if (uploadResult.success) {
          setSelectedFile(file);
          form.setFieldsValue({ minhChung: uploadResult.message }); // Hiển thị URL file trong form
          message.success("Tải ảnh lên thành công!");
        }
      } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error.message);
        message.error("Tải ảnh lên thất bại!");
      }
    }
  };

  // Hàm ghi sự cố mượn mới
  const handleAddSuCo = async (values) => {
    // Tìm vật tư được chọn dựa trên giá trị trong trường "selectedVattu"
    const selectedItem = vattuBorrowed.find(
      (item) => item.chiaVatTu.vatTu.tenVt === values.selectedVattu
    );
  
    let tongThietHai = 0;
    if (selectedItem) {
      const soLuongNhap = Number(values.soLuongNhap);
      const giaVatTu = selectedItem.chiaVatTu.vatTu.giaVatTu;
      tongThietHai = soLuongNhap * giaVatTu;
    }
  
    const suCoData = {
      muon: { maMuon: currentMaMuon },
      benNhan: { idNguoiDung: "ND01" }, // Mặc định bên nhận là "ql001"
      benGui: { idNguoiDung: idNguoiMuon }, // Người gửi là người dùng hiện tại
      tieuDe: values.tieuDe,
      noiDung: values.noiDung,
      thoiGian: new Date().toISOString(), // Thời gian hiện tại
      minhChung: selectedFile ? selectedFile.name : null, // Lưu tên file ảnh
      tongThietHai: tongThietHai, // Tổng thiệt hại tính từ số lượng nhập * giá vật tư
    };
  
    // Tiếp tục xử lý upload ảnh và gửi dữ liệu sự cố...
    const uploadResult = await uploadImage(selectedFile); // Tải ảnh lên Firebase
    if (uploadResult.success) {
      suCoData.minhChung = uploadResult.message.replace("File uploaded successfully: ", "");
      const addIncidentStatus = await setBorrowIncident(suCoData); // Gửi dữ liệu sự cố
      if (addIncidentStatus) {
        message.success("Thêm sự cố thành công!");
        setIsSuCoModalVisible(false);
        setSelectedFile(null); // Reset file sau khi gửi
        fetchBorrowIncident(currentMaMuon); // Làm mới danh sách sự cố
      } else {
        message.error("Thêm sự cố thất bại!");
      }
    } else {
      message.error("Tải ảnh lên thất bại!");
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

  // const sortedBorrowedByUser = [...borrowedByUser].sort((a, b) => {
  //   return b.maMuon.localeCompare(a.maMuon);
  // });

  const sortedBorrowedByUser = [...borrowedByUser].sort((a, b) => 
    b.maMuon.localeCompare(a.maMuon)
  );
  
  const pastBorrowings = sortedBorrowedByUser.filter(item => item.thoiGianTraThucTe);
  const upcomingBorrowings = sortedBorrowedByUser.filter(item => !item.thoiGianTraThucTe);

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
          {/* Lịch trình mượn trong tương lai */}
          <div style={{ marginBottom: "20px" }}>
            <h2>Lịch trình mượn trong tương lai</h2>
            <table className="muon-table">
              <thead>
                <tr>
                  <th>Mã Mượn</th>
                  <th>Mã Phòng</th>
                  <th>Thời Gian Mượn</th>
                  <th>Thời Gian Trả Dự Tính</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBorrowings.map((item) => (
                  <tr key={item.maMuon}>
                    <td>{item.maMuon}</td>
                    <td>{item.phong.maPhong}</td>
                    <td>{formatDateTime(item.thoiGianMuon)}</td>
                    <td>{formatDateTime(item.thoiGianTraDuTinh)}</td>
                    <td>
                      <Button type="primary" size="small" onClick={() => fetchBorrowedSupply(item.maMuon)}>
                        Xem vật tư mượn
                      </Button>
                      <Button type="primary" danger size="small" onClick={() => handleRoomReturn(item.maMuon)}>
                        Trả
                      </Button>
                      <Button type="default" size="small" onClick={() => fetchBorrowIncident(item.maMuon)} style={{ marginLeft: "5px" }}>
                        Sự cố
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lịch sử mượn */}
          <div>
            <h2>Lịch sử mượn</h2>
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
                {pastBorrowings.map((item) => (
                  <tr key={item.maMuon}>
                    <td>{item.maMuon}</td>
                    <td>{item.phong.maPhong}</td>
                    <td>{formatDateTime(item.thoiGianMuon)}</td>
                    <td>{formatDateTime(item.thoiGianTraDuTinh)}</td>
                    <td>{formatDateTime(item.thoiGianTraThucTe)}</td>
                    <td>
                      <Button type="primary" size="small" onClick={() => fetchBorrowedSupply(item.maMuon)}>
                        Xem vật tư mượn
                      </Button>
                      <Button type="default" danger size="small" disabled>
                        Đã Trả
                      </Button>
                      <Button type="default" size="small" onClick={() => fetchBorrowIncident(item.maMuon)} style={{ marginLeft: "5px" }}>
                        Sự cố
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        open={isSuCoModalVisible}
        onCancel={handleCloseSuCoModal}
        footer={null}
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
                <p><strong>Minh chứng:</strong></p>
                {suCo.minhChung ? (
                  <img
                    src={suCo.minhChung}
                    alt="Minh chứng"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                ) : (
                  "Không có"
                )}
                <p><strong>Bên gửi:</strong> {suCo.benGui.hoTen} ({suCo.benGui.vaiTro.tenVaiTro})</p>
                <p><strong>Bên nhận:</strong> {suCo.benNhan.hoTen} (Admin)</p>
                <p><strong>Tổng thiệt hại:</strong> {suCo.tongThietHai}</p>
              </div>
            ))}
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setSelectedFile(null);
                setHasSuCo(false); // Chuyển sang trạng thái hiển thị form
                fetchBorrowedSupplyForIncident(currentMaMuon);
              }}
            >
              Báo cáo thêm sự cố
            </Button>
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

            {/* Tùy chọn loại sự cố */}
            <Form.Item
              label="Sự cố gì?"
              name="loaiSuCo"
              rules={[{ required: true, message: "Vui lòng chọn loại sự cố!" }]}
            >
              <Radio.Group>
                <Radio value="CHUNG">Sự cố chung</Radio>
                <Radio value="VATTU">Sự cố vật tư</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Hiển thị danh sách vật tư nếu chọn Sự cố vật tư */}
            <Form.Item shouldUpdate>
              {() =>
                form.getFieldValue("loaiSuCo") === "VATTU" && (
                  <>
                    <Form.Item
                      label="Danh sách vật tư"
                      name="selectedVattu"
                      rules={[{ required: true, message: "Vui lòng chọn vật tư!" }]}
                    >
                      <Radio.Group>
                        {vattuBorrowed.map((item, index) => (
                          <Radio key={index} value={item.chiaVatTu.vatTu.tenVt}>
                            {item.chiaVatTu.vatTu.tenVt} - Số lượng: {item.chiaVatTu.soLuong} - Giá: {item.chiaVatTu.vatTu.giaVatTu} - Tổng giá trị:{" "}
                            {item.chiaVatTu.soLuong * item.chiaVatTu.vatTu.giaVatTu}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      label="Nhập số lượng"
                      name="soLuongNhap"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng!" },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            const selectedItem = vattuBorrowed.find(
                              (item) => item.chiaVatTu.vatTu.tenVt === getFieldValue("selectedVattu")
                            );
                            if (selectedItem && value > selectedItem.chiaVatTu.soLuong) {
                              return Promise.reject(
                                new Error(`Số lượng không vượt quá ${selectedItem.chiaVatTu.soLuong}`)
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Nhập số lượng"
                        onChange={(e) => {
                          const soLuongNhap = Number(e.target.value);
                          const selectedVattu = form.getFieldValue("selectedVattu");
                          if (selectedVattu) {
                            const selectedItem = vattuBorrowed.find(
                              (item) => item.chiaVatTu.vatTu.tenVt === selectedVattu
                            );
                            if (selectedItem) {
                              form.setFieldsValue({
                                tongGiaTri: soLuongNhap * selectedItem.chiaVatTu.vatTu.giaVatTu,
                              });
                            }
                          }
                        }}
                      />
                    </Form.Item>
                  </>
                )
              }
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
              {selectedFile && <p>Đã chọn: {selectedFile.name}</p>}
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