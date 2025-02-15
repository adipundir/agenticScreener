"use client";
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useParams } from "next/navigation";
import useJobOpeningsStore from "@/Zustand/JobOpeningsStore";
import { Button } from "@/components/ui/button";
import pdfToText from 'react-pdftotext'
import { toast } from "sonner";
import resumeScreeningAgent from "@/UtilityFunctions/ResumeScreeningAgent";
import useLoadingStore from "@/Zustand/LoadingStore";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

export default function Apply() {
    const params = useParams()
    const jobOpenings = useJobOpeningsStore((state: any) => state.jobOpenings);
    const relevantOpening = jobOpenings.find((job: any) => job._id == `/${params.address}/${params.number}`)

    const [resume, setResume] = useState<File>();
    const [pdfText, setPdfText] = useState("");

    const isLoading = useLoadingStore((state: any) => state.isLoading)
    const setIsLoading = useLoadingStore((state: any) => state.setIsLoading)

    const handleFileUpload = (file: File) => {
        setResume(file);
        console.log(file);
    };

    useEffect(() => {
        console.log("Is submitting", isLoading)
    }, [isLoading])

    useEffect(() => {
        (async () => {
            if (resume) {
                const res = await pdfToText(resume);
                setPdfText(res);
            }
        })();
    }, [resume]);

    const handleSubmit = async () => {
        if (!resume) {
            alert("Please upload a resume first");
            return;
        }

        setIsLoading(true);
        try {
            const result = await resumeScreeningAgent(pdfText, relevantOpening);
            toast(result);
        } catch (error) {
            console.error("Error processing resume:", error);
            toast.error("Error processing resume.");
        } finally {
            setIsLoading(false);
        }
    };

    // if (relevantOpening == null)
    //     return 

    const loadingStates = [
        { text: "Scanning Resume..." },
        { text: "Analyzing Skills & Experience..." },
        { text: "Finalizing Decision..." }
    ];

    return (
        <div className="flex flex-col gap-4 pt-24">
            <div className="w-full max-w-4xl mx-auto min-h-80 border border-dashed bg-background border-neutral-200 dark:border-neutral-800 rounded-lg">
                <FileUpload onChange={handleFileUpload} />
            </div>
            <div className="w-full flex items-center justify-center max-w-4xl mx-auto mt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={!resume || isLoading}
                    className=" py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Processing..." : "Submit Resume for Screening"}
                </Button>
            </div>
            <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={2000} />
            {isLoading && <button
                className="fixed top-2 right-4 text-black dark:text-white z-[12000]"
                onClick={() => setIsLoading(false)}
                disabled={isLoading}
            >
                <IconSquareRoundedX className="h-10 w-10" />
            </button>}
        </div>
    );
}
