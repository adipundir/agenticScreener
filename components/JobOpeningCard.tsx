import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import { JobOpening } from "@/types/types"

export default function JobOpeningCard({
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
        <Card className="h-full">
            <CardContent className="p-6 ">
                <div className="flex items-center mb-4">
                    <Image
                        src={companyLogo || "/placeholder.svg"}
                        alt={`${companyName} logo`}
                        height={50}
                        width={50}
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{jobTitle}</h2>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div
                                            className={`w-3 h-3 rounded-full ${isAccepting == "true"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isAccepting == "true"
                                            ? "Currently Accepting Applications"
                                            : "Not Accepting Applications"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <p className="text-sm text-muted-foreground">{companyName}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {salary}
                    </div>
                </div>
                {employmentType && <Badge variant="secondary">{employmentType}</Badge>}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {postedDate}
                </div>
                <Link href={`/opening/${_id}`}>
                    <Button variant="secondary" size="sm" disabled={isAccepting != "true"}>
                        Apply Now
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

