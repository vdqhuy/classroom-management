import React from 'react';
import { Modal, Button, Table } from 'antd';

const ClassInfoModal = ({ show, handleClose, classInfo, studentList }) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên Sinh Viên',
            dataIndex: ['nguoiDung', 'hoTen'],
            key: 'hoTen',
        },
        {
            title: 'Mã Sinh Viên',
            dataIndex: 'maSv',
            key: 'maSv',
        },
        {
            title: 'Email',
            dataIndex: ['nguoiDung', 'email'],
            key: 'email',
        },
    ];

    return (
        <Modal
            open={show}
            onCancel={handleClose}
            footer={[
                <Button key="close" onClick={handleClose}>
                    Đóng
                </Button>,
            ]}
            title={
                <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Thông tin lớp</div>
            }
            centered
            width={700}
        >
            <div className='modal-body'>
                <div>
                    <label>Tên Lớp: </label>
                    <span>{classInfo?.tenLop}</span>
                </div>
                <div>
                    <label>Mã Lớp: </label>
                    <span>{classInfo?.maLop}</span>
                </div>
                <div>
                    <label>Số Lượng Sinh Viên: </label>
                    <span>{classInfo.siSo}</span>
                </div>
                <label>Danh Sách Sinh Viên:</label>
            </div>
            <Table
                columns={columns}
                dataSource={studentList}
                rowKey="maSv"
                pagination={false}
                bordered
            />
        </Modal>
    );
};

export default ClassInfoModal;
