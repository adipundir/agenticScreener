import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { JobOpening } from "@/types/types"

export default function JobOpeningExpanded({
    _id,
    recruiterId,
    companyName,
    companyLogo,
    jobTitle,
    location,
    salary,
    postedDate,
    employmentType,
    description,
    requirements,
    isAccepting,
    candidatesData
}: JobOpening) {
    return (
        <div className="max-w-4xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img
                        src={companyLogo || "/placeholder.svg"}
                        alt={`${companyName} logo`}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{jobTitle}</h1>
                        <p className="text-muted-foreground">{companyName}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {salary}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {postedDate}
                    </div>
                    {employmentType && <Badge variant="secondary">{employmentType}</Badge>}
                </div>

                <p className="text-sm text-muted-foreground mb-4">Over {candidatesData.length} applicants</p>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-foreground">About the job</h2>
                    <p className="text-card-foreground">{description}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-foreground">Requirements</h2>
                    <p className="list-disc list-inside text-card-foreground">
                        {requirements}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button disabled={isAccepting != "true"}>
                        <Link href={`/apply/${_id}`}>
                        Apply Now
                        </Link>
                        </Button>
                    {/* <Button variant="outline">Save</Button> */}
                </div>
            </div>
        </div>
    )
}

