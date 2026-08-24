import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadFiles = async (
    files,
    expiry,
    maxDownloads,
    onUploadProgress,
) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    formData.append("expiry", expiry);
    formData.append("maxDownloads", maxDownloads);

    const response = await axios.post(
        `${API_URL}/api/files/upload`,
        formData,
        {
            onUploadProgress,
        },
    );

    return response.data;
};

export const getTransferInfo = async (key) => {
    const response = await fetch(
        `${API_URL}/api/files/info/${key}`,
    );

    return response.json();
};

export const downloadSelectedFiles = async (
    key,
    fileIds,
) => {
    return fetch(
        `${API_URL}/api/files/download/${key}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileIds,
            }),
        },
    );
};