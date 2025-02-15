"use client"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import JobListingCard from "@/components/JobOpeningCard"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import CreateJobListing from "@/components/CreateJobListing"
import { useEffect, useState } from "react"
import useJobOpeningsStore from "@/Zustand/JobOpeningsStore"

export default function Home() {
    const [addOpeningDialogOpen, setAddOpeningDialogOpen] = useState<boolean>(false)
    const [isLoading, setisLoading] = useState<boolean>(false)
    const jobOpenings = useJobOpeningsStore((state: any) => state.jobOpenings);

    useEffect(() => {
        console.log(jobOpenings)
    }, [jobOpenings])

    return (
        <div className="pt-24 container min-h-[100vh] w-full py-8 flex flex-col gap-8">
            <div className="text-4xl w-full flex justify-between items-center sm:text-5xl md:text-6xl font-bold mb-8 text-black dark:text-white">
                <p className="flex items-center">Job Openings ✨</p>
                {true && <Dialog open={addOpeningDialogOpen} onOpenChange={setAddOpeningDialogOpen}>
                    <DialogTrigger className="flex items-center"><Button disabled={isLoading} className="font-bold">
                        {isLoading ? "Loading..." : <div className="flex items-center justify-center"> <PlusCircle className="mr-2 h-4 w-4" /> New Job Opening</div>}
                    </Button></DialogTrigger>
                    <DialogContent className="overflow-y-scroll px-6 py-8 max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>New Job Opening Details</DialogTitle>
                        </DialogHeader>
                        <CreateJobListing setIsOpen={setAddOpeningDialogOpen}/>
                    </DialogContent>
                </Dialog>}
                {/* {!false && <Button className="font-bold" onClick={() => {}}>Register as Recruiter</Button>} */}
            </div>
            <div className="container w-full px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobOpenings?.length > 0 ? jobOpenings?.map((job : any) => (
                        <JobListingCard key={job.companyName} {...job} />
                    )) :
                        <div className="text-center text-lg col-span-full min-w-full">
                            No Job Listings 😞
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

