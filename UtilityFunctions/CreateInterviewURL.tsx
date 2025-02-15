export const createInterviewURL = (jobID : string, email : string) => {
    return `http://agentic-screener.vercel.app/interview${jobID}/${encodeURIComponent(email)}`;
};