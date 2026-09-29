import api from "./api";

/** Uploads one photo or video; onProgress receives 0–100. */
export async function uploadMedia(file, onProgress) {
    const form = new FormData();
    form.append("file", file);

    const response = await api.post("/media/uploads", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
            if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
        },
    });

    return response.data;
}
