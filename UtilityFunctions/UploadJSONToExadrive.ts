import axios from "axios";

export async function uploadJSONToExaDrive(jsonObject: any, address: string): Promise<any> {
  try {
    const jsonString = JSON.stringify(jsonObject);

    // Create a Blob object (or File object) with the JSON string
    const jsonFile = new Blob([jsonString], { type: "application/json" });

    // Optional: If you want to name the file (useful for APIs expecting file uploads)
    const fileWithFileName = new File([jsonFile], "data.json", { type: "application/json" });

    const formData = new FormData();
    formData.append("file", fileWithFileName);
    const virtualDirectoryPath = `/userData/walletAddress${address ? "/" + address : ""}`;
    formData.append("virtualDirectoryPath", virtualDirectoryPath);

    const response = await axios.post("/api/uploadToExaDrive", formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
