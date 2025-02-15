"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useChat } from "ai/react"
import { Chat } from '@/components/ui/chat'
import { toast } from "sonner"
import getInterviewContext from "@/UtilityFunctions/GetInterviewContext"
import useJobOpeningsStore from '@/Zustand/JobOpeningsStore'
import { JobOpening } from '@/types/types'

const InterviewPage = () => {
    const { address, number, email } = useParams(); // Get the email from URL params
    const decodedEmail = decodeURIComponent(email as string); // Decode the email
    console.log(decodedEmail)
    
    const jobOpenings = useJobOpeningsStore((state: any) => state.jobOpenings);
    const relevantOpening = jobOpenings.find((job: any) => job._id == `/${address}/${number}`)
    console.log("relevant Opening in interview", relevantOpening)

    const [context, setContext] = useState<{ job: any, email: any }>({ job : "", email : decodedEmail })

    async function initializeContext() {
        const { jobWithoutCandidates: job, candidateDetails } = await getInterviewContext(relevantOpening, decodedEmail);
        console.log("job and scores in interview", job, candidateDetails)
        setContext({ ...context, job: relevantOpening })
    }

    useEffect(() => {
        initializeContext()
    }, [address, number, email, relevantOpening])

    useEffect(() => {
        console.log("context in interview", context)
    },[context])

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        stop,
        append
    } = useChat({
        api: "/api/agentic-screener",
        body: context,
        streamProtocol: "text",
        onError: (error: Error) => {
            console.log("Error", error)
            toast.error("There Was a problem Generating a Response")
        },
        initialMessages: [{
            id: "1",
            role: 'assistant',
            content: `Hi, Contratulations for being shortlisted for an interview. could you please Introduce yourself?`,
            parts: []
        }]
    })

    return (
        <div className='w-full min-h-[100vh] max-h-[100vh]'>
            {context? (
                <div className="flex pt-32 pb-16 min-h-[100vh] max-h-[100vh] w-full px-48 text-xl">
                    <Chat
                        className="grow"
                        messages={messages}
                        handleSubmit={handleSubmit}
                        input={input}
                        handleInputChange={handleInputChange}
                        isGenerating={isLoading}
                        stop={stop}
                        append={append}
                        suggestions={[
                            "Which Tech Stack is most populer in India amoung age group 20-25?",
                            "Is this the right time to launch a NextJS course for Indian audience?",
                            "Which city in India should we hire skilled React Native Developers from?"
                        ]}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-6 w-full h-full">
                    <h2 className="text-2xl font-bold mb-4">Your interview is not scheduled yet ❌</h2>
                </div>
            )}
        </div>
    )
}

export default InterviewPage