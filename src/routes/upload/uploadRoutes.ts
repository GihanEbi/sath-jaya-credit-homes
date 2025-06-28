import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api";

type fileParams = {
  file: FormData | File | Blob;
};

export async function upload_file(
  fileData: FormData | File | Blob,
): Promise<any> {
  try {
    const res = await fetch(`${commonUrl}/upload`, {
      method: "POST",
      headers: {
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: fileData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
