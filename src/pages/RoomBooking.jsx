import React from "react";
import RoomBorrowForm from "../components/room/RoomBorrowForm";
import BorrowedRoomsList from "../components/room/BorrowedRoomsList";
import "../css/RoomBooking.css";

const RoomBooking = () => {
  return (
    <div>
      <div style={{ height: "80px" }}></div>
      <RoomBorrowForm />
      <BorrowedRoomsList />
    </div>
  );
};

export default RoomBooking;