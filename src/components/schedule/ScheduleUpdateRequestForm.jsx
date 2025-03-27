import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import '../../css/Schedule.css';

const ScheduleChangeRequestForm = ({ isOpen, onClose, roomInfo }) => {
    // Initialize state and ensure default values are handled properly
    const [formData, setFormData] = useState({
        roomType: '',
        numSeats: '',
        selectedRoom: '',
        borrowTime: '',
        returnTime: '',
    });

    // Populate formData with roomInfo when available
    useEffect(() => {
        console.log(roomInfo)
        if (roomInfo) {
            setFormData({
                roomType: roomInfo.loaiPhong || '',
                numSeats: roomInfo.sucChua || '',
                selectedRoom: roomInfo.maPhong || '',
                borrowTime: '',
                returnTime: '',
            });
        }
    }, [roomInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    return (
        <>
            <Modal
                title={
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                        Yêu cầu thay đổi lịch dạy
                    </div>
                }
                open={isOpen} // Corrected prop for Modal
                onCancel={onClose}
                footer={[
                    <div className="modal-footer" key="footer">
                        <button className="modal-footer-button" onClick={onClose}>
                            Hủy
                        </button>
                        <button
                            className="modal-footer-button"
                            onClick={() => {
                                // Submit form logic
                                console.log('Submitted form data:', formData);
                                onClose();
                            }}
                        >
                            Gửi yêu cầu
                        </button>
                    </div>
                ]}
                width={600}
            >
                <div className="modal-body">
                    <div>
                        <label>Loại phòng:</label>
                        <label>
                            <input
                                type="radio"
                                name="roomType"
                                value="HOC" // Value for classroom
                                checked={formData.roomType === 'HOC'}
                                onChange={handleInputChange}
                            />
                            Phòng học
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            <input
                                type="radio"
                                name="roomType"
                                value="THUCHANH" // Correct value for practice room
                                checked={formData.roomType === 'THUCHANH'}
                                onChange={handleInputChange}
                            />
                            Phòng thực hành
                        </label>
                    </div>

                    <div>
                        <label>Số lượng chỗ:</label>
                        <input
                            type="number"
                            name="numSeats"
                            value={formData.numSeats}
                            onChange={handleInputChange}
                            placeholder="Nhập số chỗ"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label>Chọn phòng:</label>
                        <select
                            name="selectedRoom"
                            value={formData.selectedRoom}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">-- Chọn phòng --</option>
                            <option value="Room 101">Room 101</option>
                            <option value="Room 202">Room 202</option>
                            <option value="Room 303">Room 303</option>
                        </select>
                    </div>

                    <div>
                        <label>Thời gian mượn:</label>
                        <input
                            type="datetime-local"
                            name="borrowTime"
                            value={formData.borrowTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Thời gian trả dự tính:</label>
                        <input
                            type="datetime-local"
                            name="returnTime"
                            value={formData.returnTime}
                            onChange={handleInputChange}
                            min={formData.borrowTime}
                            required
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ScheduleChangeRequestForm;
