"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import useJobOpeningsStore from "@/Zustand/JobOpeningsStore"
import { uploadJSONToExaDrive } from "@/UtilityFunctions/UploadJSONToExadrive"
import { useAccount } from "wagmi"
import { Dispatch, SetStateAction } from "react"
import { useContractInteraction } from "@/hooks/useContractInteractions"
import { getFormattedDate } from "@/UtilityFunctions/GetFormattedDate"

const formSchema = z.object({
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    companyLogo: z.string().url({ message: "Please enter a valid URL for the company logo." }),
    jobTitle: z.string().min(5, { message: "Job title must be at least 5 characters." }),
    location: z.string().min(2, { message: "Location must be at least 2 characters." }),
    salary: z.string().min(1, { message: "Please enter a salary range." }),
    isRemote: z.boolean(),
    employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance", ""]),
    description: z.string().min(50, { message: "Description must be at least 50 characters." }),
    requirements: z.string().min(10, { message: "Please enter at least one requirement." }),
})

interface CreateJobListingProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateJobListing({ setIsOpen }: CreateJobListingProps) {

    const {address, addJobOpening} = useContractInteraction()
    const myPostingsCount = useJobOpeningsStore((state: any) => state.myPostingsCount);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            companyLogo: "",
            jobTitle: "",
            location: "",
            salary: "",
            isRemote: false,
            employmentType: "",
            description: "",
            requirements: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const newData = {
            ...values,
            _id: `/${address}/${myPostingsCount + 1}`,
            recruiterId: address as string,
            postedDate: JSON.stringify(getFormattedDate()),
            isAccepting: "true",
            candidatesData: []
        }
        const { success, virtualPath } = await uploadJSONToExaDrive(newData)
        if(success){
            toast.success("Please sign Transaction to complete Upload")
            setIsOpen(false)
            addJobOpening(virtualPath)
        } 
        console.log("success path", success, virtualPath)
    }

    return (
        <div className="my-4 overflow-y-scroll h-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Acme Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="companyLogo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Logo URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/logo.png" {...field} />
                                </FormControl>
                                <FormDescription>Enter the URL of your company logo</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Senior Frontend Developer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York, NY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employment Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employment type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                <FormControl>
                                    <Input placeholder="$80,000 - $120,000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isRemote"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Remote Position</FormLabel>
                                    <FormDescription>Check this if the position is fully remote</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the job role and responsibilities..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Requirements</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="List the job requirements, one per line..." className="resize-none" {...field} />
                                </FormControl>
                                <FormDescription>Enter each requirement on a new line</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Job Listing</Button>
                </form>
            </Form>
        </div>
    )
}

