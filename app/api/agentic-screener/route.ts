import getInterviewContext from "@/UtilityFunctions/GetInterviewContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { RejectionEmail } from "@/components/ScreeningRejectionEmail";
import { UpdateCandidateScores } from "@/UtilityFunctions/updateCandidateScore";
import { HiredEmail } from "@/components/HiredEmail";
import extractJsonContent from "@/UtilityFunctions/extractJSON";

export async function POST(request: NextRequest) {
  const reqObject = await request.json();

  let { messages, ...otherEntries } = reqObject;
  let { job, email } = otherEntries;
  console.log("job and email in api route first line", job, email);

  const { candidateDetails } = await getInterviewContext(job, email);
  console.log("candidate Details", candidateDetails);

  console.log(messages);
  // Create context array
  console.log("context in api route", job, candidateDetails);
  const stages = {
    1: "Ongoing Interview",
    2: "Interview Concluded",
  };

  let currentStage = 1;
  let currentScores = candidateDetails.interviewScores;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Validate the input user profile
  if (!job || !candidateDetails) {
    return NextResponse.json(
      { message: "Invalid Inputs Provided" },
      { status: 500 }
    );
  }

  //Scoring Agent

  try {

    // Define the prompt

    const prompt = `
    You are a scoring agent helping an interviewer of  ${
      job.companyName
    } company who is interviewing a shortlisted candidate for a ${
      job.jobTitle
    } role to score the candidate on certain parameters.
    
    analyse the chat between the candidate and the recruiter and try to score the candidate on these parameters.
    younare not required to fill all entries in one go.

     {
          knowledge: number; // Score for domain knowledge (0-100)
          truthfulness: number; // AI-evaluated honesty based on responses (0-100)
          communication: number; // Clarity, coherence, and articulation (0-100)
          confidence: number; // Confidence level in responses (0-100)
          problemSolving: number; // Ability to tackle situational/technical problems (0-100)
          jobFit: number; // Alignment with job requirements (0-100)
          adaptability: number; // How well they handle dynamic questions (0-100)
          culturalFit: number; // Alignment with company values & team dynamics (0-100)
      }

    current scores : ${JSON.stringify(candidateDetails.interviewScores)}

    **JUST REPLY WITH THE JSON OBJECT CONSISISTING THE SCORES JUST LIKE WHAT IS PROVIDED ABOVE **

    Communication history with the Candidate ${JSON.stringify(messages)}
    `;

    // Generate content using the model
    const response = await model.generateContent(prompt);
    const finalResponse = response.response.text();

    console.log("Interview Scores in  stage 1 ", finalResponse);

    currentScores = extractJsonContent(finalResponse);
    await UpdateCandidateScores(job._id, email, currentScores);
    console.log("scores updates in API Route");

    console.log("current Scores", currentScores);


    //@typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error Generating AI Response:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }

  console.log("current messages lenght", messages.length);
  //change here to 12

  if (messages.length >= 4) {
    console.log("length greater than 8");
    currentStage = 2;
  }

  console.log("current stage", currentStage);

  //questioning agent ✨❌

  if (currentStage == 1) {
    try {

      // Define the prompt

      const prompt = `
        You are an interviewer for a ${
          job.companyName
        } and are interviewing a shortlisted candidate for a ${
        job.jobTitle
      } role.
        you can ask questions related to the resume, job description, situational questions, follow up questions from the previous response etc from the candidate.
        your goal is to analyse the previous chats with the candidate and determine the next question to be asked.
        you can change the topic if you find the candidate is unable to answer a question
        Questions need to be in natuaral language and to the point and **NON REPETITIVE**
        MAKE SURE TO CONCLUDE THE INTERVIEW AS QUICK AS POSSIBLE AND DON;T GET STUCK ON A SINGLE TOPIC
    
        JUST REPLY WITH THE NEXT QUESTION TO BE ASKED,
    
        Communication history with the Candidate ${JSON.stringify(messages)}
        Candidate's Resume : ${JSON.stringify(candidateDetails.candidateResume)}
        `;

      // Generate content using the model
      const response = await model.generateContent(prompt);
      const finalResponse = response.response.text();

      console.log("Next Question in Api Route Stage 1", finalResponse);

      // Ensure the response is valid
      if (!finalResponse) {
        throw new Error("No response from the generative AI model.");
      }

      // Send the result as a response
      return new Response(finalResponse.trim());
      //@typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error Generating AI Response:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }

  //Interview Concluded 🔥🥰

  if (currentStage == 2) {
    const resend = new Resend(process.env.SCREENING_AGENT_RESEND_API_KEY);

    try {
      // Define the prompt

      const prompt = `
        You are an interviewer for a ${
          job.companyName
        } and are interviewing a shortlisted candidate for a ${
        job.jobTitle
      } role.
        The Interview has now concluded and some scores are generaated based on the chat of the interviewer and the candidate:
    
        After analysing the below data - JUST REPLY WITH Hired or Not Hired only ,
    
        Communication history with the Candidate ${JSON.stringify(messages)}
        Candidate's Resume : ${JSON.stringify(candidateDetails.candidateResume)}
        Interview Scores : ${JSON.stringify(currentScores)}
        `;

      // Generate content using the model
      const response = await model.generateContent(prompt);
      const finalResponse = response.response.text();

      console.log("Agent's verdict to hire or not?", finalResponse);

      if (finalResponse.includes("Hired")){
        try {
          const emailHtml = await HiredEmail({
            firstName: "Candidate",
            companyName: job.companyName,
          });
          const { data, error } = await resend.emails.send({
            from: "Agentic Screener <onboarding@resend.dev>",
            to: [candidateDetails.candidateEmail],
            subject: `You're In! Our Recruiter Will Contact You Soon - ${job.companyName}`,
            react: emailHtml,
          });
          console.log("data", data);
          if (error) console.log("error", error);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      }
      else {

        try {
          const emailHtml = await RejectionEmail({
            firstName: "Candidate",
            companyName: job.companyName,
          });
          const { data, error } = await resend.emails.send({
            from: "Agentic Screener <onboarding@resend.dev>",
            to: [candidateDetails.candidateEmail],
            subject: "Thank You for Applying – Update on Your Application",
            react: emailHtml,
          });
          console.log("data", data);
          if (error) console.log("error", error);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      }

        if (!finalResponse) {
          // Ensure the response is valid
          throw new Error("No response from the generative AI model.");
        }

      //@typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error Generating AI Response:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }

    try {
      // Define the prompt

      const prompt = `
        You are an interviewer for a ${
          job.companyName
        } and are interviewing a shortlisted candidate for a ${
        job.jobTitle
      } role.
        
        The interview has now been done. Please thank the candidate for his time and ask to check email for the response witthin 24 hours.
        Communication history with the Candidate ${JSON.stringify(messages)}
        `;

      // Generate content using the model
      const response = await model.generateContent(prompt);
      const finalResponse = response.response.text();

      console.log("Interview Concluded and stage 2", finalResponse);


      // Ensure the response is valid
      if (!finalResponse) {
        throw new Error("No response from the generative AI model.");
      }

      // Send the result as a response
      return new Response(finalResponse.trim());
      //@typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error Generating AI Response:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }
}
