import React, { useEffect, useState } from "react";
import { getTeacherByUser } from "../services/userInfoService";
import "../css/TeacherInfo.css"
// import Header from "../components/Header";

const TeacherInfo = () => {
    const [teacher, setTeacher] = useState(null);
    const [user, setUser] = useState(null);
    const userId  = localStorage.getItem("idNguoiDung") || "";

    useEffect(() => {
        const fetchTeacher = async () => { 
            try {
                const teacherData = await getTeacherByUser(userId); // ID giảng viên
                setTeacher(teacherData);
                setUser(teacherData.nguoiDung);
            } catch (error) {
                console.error("Lỗi lấy thông tin giảng viên", error);
            }
        };
        fetchTeacher();
    }, [userId]);

    return (
        <div className="teacher-info">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        </style>
        {teacher ? (
            <>
                <div className="info-container">
                    <h2 className='header-info-container'>Thông tin chi tiết về chủ tài khoản:</h2>
                    <div className="flex-info-container">
                    <div>
                        <p className='info-style'>Mã giảng viên: <span className='spacing0'>{teacher.maGv}</span></p>
                        <p className='info-style'>Tên: <span className='spacing1'>{user.hoTen}</span></p>
                        <p className='info-style'>Email: <span className='spacing2'>{user.email}</span></p>
                        <p className='info-style'>Liên hệ: <span className='spacing3'>{user.lienHe}</span></p>
                        <p className='info-style'>Giới tính: <span className='spacing4'>{user.gioiTinh}</span></p>
                        <p className='info-style'>Khoa: <span className='spacing2'>{teacher.khoa}</span></p>
                    </div>
                    {user.avatarUrl && (
                        <img 
                            src={`${user.avatarUrl}`} 
                            alt="Avatar" 
                            style={{ 
                                width: '300px', 
                                height: '400px', 
                                objectFit: 'cover', 
                                borderRadius: '10px', 
                                border: '2px solid #ccc' 
                            }}
                        />
                    )}
                    </div>
                </div>
                <br></br>
                <div style={{ position: 'relative', height: '100px' }}>
                    <img 
                        src="https://png.pngtree.com/png-clipart/20240115/original/pngtree-crystal-ball-highly-transparent-spherical-ai-element-three-dimensional-buckle-free-png-image_14115172.png" 
                        className="bouncing-ball2 ball1" 
                        alt="Bouncing Ball 1" 
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <img 
                        src="https://png.pngtree.com/png-clipart/20240610/original/pngtree-magic-sphere-beautiful-glitter-crystal-ball-fantasy-png-image_15298983.png" 
                        className="bouncing-ball1 ball2" 
                        alt="Bouncing Ball 2" 
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                </div>
            </>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default TeacherInfo;
