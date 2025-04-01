import axios from "axios";

const API_URL = "http://localhost:8080/api/firebase";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return { success: true, message: response.data };
    } catch (error) {
        throw new Error(error.response?.data || error.message);
    }
};