import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import Schedule from "./pages/Schedule";
import TeacherInfo from "./pages/TeacherInfo";
import RoomBooking from "./pages/RoomBooking";
import Notification from "./pages/Notification";
import "./css/modal.css";

const App = () => {
    localStorage.setItem("idNguoiDung", "ND02");
    localStorage.setItem("vaiTro", "GV");
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/giangvien/" element={<Schedule />} />
                    <Route path="/giangvien/thongtin" element={<TeacherInfo />} />
                    <Route path="/giangvien/lichgiangday" element={<Schedule />} />
                    <Route path="/giangvien/datphong" element={<RoomBooking />} />
                    <Route path="/giangvien/thongbao" element={<Notification />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
