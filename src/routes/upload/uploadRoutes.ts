import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api";

type fileParams = {
  file: File;
};

export async function upload_file(fileData: fileParams) {
  try {
    const formData = new FormData();
    formData.append("file", fileData.file);

    const res = await fetch(`${commonUrl}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
