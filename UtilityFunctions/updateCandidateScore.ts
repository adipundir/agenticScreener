import axios from "axios";
import { uploadJSONToExaDrive } from "./UploadJSONToExadrive";

export async function UpdateCandidateScores (_id : string, email : string, currentScores : {}){
    const { data } = await axios.get(
      `https://agentic-screener.exadrivecdn.com/jobOpening${_id}/data.json`
    );

    console.log("gotten job in update fxn", data);
    
    let updatedRecord = data.candidatesData?.map((candidate: any) => {
      if (candidate.candidateEmail == email) {
        candidate.interviewScores = currentScores;
      }
      return candidate;
    });
    console.log("updated Record", updatedRecord);

    const {success} = await uploadJSONToExaDrive(updatedRecord);

    return success;

}