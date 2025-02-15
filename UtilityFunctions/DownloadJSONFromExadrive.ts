import { JobOpening, JobOpeningContract } from "@/types/types";
import axios from "axios";

export const DownloadJsonFromExadrive = async (
  jobOpeningsArray: JobOpeningContract[]
): Promise<JobOpening[]> => {
  const openingsData: JobOpening[] = await Promise.all(
    jobOpeningsArray.map(async (jobOpening) => {
      const { data } = await axios.get(
        `https://builder-lattice.exadrivecdn.com/jobOpening/${jobOpening.openingURL}.json`
      );
      return data;
    })
  );
  return openingsData;
};
