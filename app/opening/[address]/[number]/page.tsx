"use client"
import JobOpeningExpanded from '@/components/JobOpeningExpanded';
import useJobOpeningsStore from '@/Zustand/JobOpeningsStore';
import { useParams } from 'next/navigation'

export default function Opening() {
    const params = useParams()
    console.log("Params", params)
    const jobOpenings = useJobOpeningsStore((state: any) => state.jobOpenings);
    const relevantOpening = jobOpenings.find((job:any) => job._id == `/${params.address}/${params.number}`)

    if (relevantOpening == null)
        return 

    return (
        <div className="w-full h-full flex items-center justify-center py-8 pt-20">
            <JobOpeningExpanded {...relevantOpening}/>
        </div>
    )
}

