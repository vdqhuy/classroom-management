import React, { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers()
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    return (
        <div>
            <h2>Danh sách người dùng</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.ho + " " + user.ten} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
