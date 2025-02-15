"use server";
import { JobOpening } from "@/types/types";
import { ExaDrive } from "exadrive-sdk";

const exaDrive = new ExaDrive(
  process.env.EXADRIVE_APP_ID!,
  process.env.EXADRIVE_API_KEY!
);

export async function uploadJSONToExaDrive(
  jsonObject: JobOpening,
): Promise<{ success: boolean; virtualPath : string}> {
  console.log("json Object got in Upload Fxn", jsonObject);
  try {
    const jsonString = JSON.stringify(jsonObject);

    const jsonFile = new Blob([jsonString], { type: "application/json" });

    const file = new File([jsonFile], `data.json`, {
      type: "application/json",
    });
    const virtualDirectoryPath = `/jobOpening${jsonObject._id}`;
    console.log("virtual directory path", virtualDirectoryPath);
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const originalFileName = file.name;
    const mimeType = file.type;

    const uploadResponse = await exaDrive.uploadFileWithBuffer(
      fileBuffer,
      originalFileName,
      mimeType,
      virtualDirectoryPath
    );

    const trx_data = uploadResponse;
    console.log("trxData", trx_data.data);

    return {
      success: trx_data.status == 200,
      virtualPath: trx_data.data.virtualPath,
    };
  } catch (error) {
    console.error("Error uploading Job Opening:", error);
    throw error;
  }
}
