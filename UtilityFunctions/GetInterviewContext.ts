import { JobOpening } from "@/types/types";

export default async function getInterviewContext(job : JobOpening, email : string) {
    console.log("the job", job);
    console.log('Email', email)

    const candidateDetails = job.candidatesData?.find(
        //change this to 1st one 
        // (candidate) => candidate.candidateEmail === email && candidate.interviewScheduled === "Yes"
        (candidate : any) => candidate.candidateEmail == email
    );

    // Create a shallow copy of the job object and remove the candidates field
    const { candidatesData, companyLogo, isAccepting, ...jobWithoutCandidates } = job;

    return { jobWithoutCandidates, candidateDetails };
}
