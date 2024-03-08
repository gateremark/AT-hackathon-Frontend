"use client";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { FaFileArrowDown } from "react-icons/fa6";
import supabase from "@/lib/SupabaseClient";
import { UploadData } from "@/app/api/supabase/route";
import axios from "axios";

export default function Home() {
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [sendDetails, setSendDetails] = useState(false);
    const [formData, setFormData] = useState({
        goal1: "",
        phone: "",
    });
    const { goal1, phone } = formData;
    const uploadFile = async (file: File) => {
        const time: Number = new Date().valueOf();
        const imgKey: string = `insights/${time}-${file.name}`;
        const { data, error } = await supabase.storage
            .from("picsa")
            .upload(imgKey, file, {
                cacheControl: "3600",
                upsert: false,
            });
        console.log("Data: ", data);
        console.log("Error: ", error);

        const fileUrl = supabase.storage.from("picsa").getPublicUrl(imgKey)
            .data.publicUrl;
        console.log("FileUrl: ", fileUrl);
        setFileUrl(fileUrl);

        if (error) {
            throw error;
        }
        return data;
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "application/csv": [".csv", ".json", ".xls", ".xlsx"],
        },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];

            try {
                setUploading(true);
                const data = await uploadFile(file);

                toast.success("File uploaded successfully!");
            } catch (error) {
                console.log(error);
                toast.error("Failed to upload file!");
            } finally {
                setUploading(false);
            }
        },
    });
    const noData = () => {
        toast.error("Please add a file!");
    };
    const onSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const projectData: UploadData = {
            goal1: goal1,
            phone: phone,
            url: fileUrl as string,
        };

        console.log("projectData: ", projectData);

        const response = await axios.post("/api/supabase", projectData);
        try {
            setSendDetails(true);

            const response2 = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectData),
            });
            const data = await response2.json();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            console.log("Finished processing request");
            setSendDetails(false);
        }

        console.log("Response: ", response);
        if (response.status === 200) {
            toast.success("Details submitted successfully!");
            setFormData({
                goal1: "",
                phone: "",
            });
        } else {
            toast.error("Error submitting form!");
        }
    };
    return (
        <main className="flex max-w-[1200px] mx-auto flex-col items-center py-2 h-screen">
            <Toaster richColors />
            <div className="flex flex-col gap-4 pt-10 justify-center items-center">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="goal1"
                        className="bg-gradient-to-r dark:from-[#00c6ff] dark:to-[#0072ff] from-[#0072ff] to-[#00c6ff]  bg-clip-text text-transparent"
                    >
                        Goal
                    </label>
                    <textarea
                        name="goal1"
                        id="goal1"
                        value={goal1}
                        required
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                goal1: e.target.value,
                            })
                        }
                        className="p-2 border border-gray-300 rounded shadow-xl focus:outline-none focus:ring-2 focus:ring-[#287bc2] dark:focus:ring-slate-300 transition-all duration-100 ease-in-out md:w-96 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="phone"
                        className="bg-gradient-to-r dark:from-[#00c6ff] dark:to-[#0072ff] from-[#0072ff] to-[#00c6ff]  bg-clip-text text-transparent"
                    >
                        Phone Number *
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={phone}
                        required
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                phone: e.target.value,
                            })
                        }
                        className="p-2 border border-gray-300 rounded shadow-xl focus:outline-none focus:ring-2 focus:ring-[#287bc2] dark:focus:ring-slate-300 transition-all duration-100 ease-in-out md:w-96 w-full"
                    />
                </div>
                <div
                    {...getRootProps({
                        className:
                            "cursor-pointer p-4 border-dashed border-2 border-gray-300 rounded-xl text-center hover:border-gray-500 transition duration-300 ease-in-out relative",
                    })}
                >
                    <input {...getInputProps()} className=" w-full h-full" />
                    {uploading ? (
                        <>
                            <div className="flex justify-center items-center flex-col">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="text-gray-500 text-sm mt-2">
                                    Uploading Report...
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {" "}
                            <FaFileArrowDown className=" dark:text-[#020817] text-[#020817] absolute left-[47%] text-3xl top-4" />
                            <>
                                <p className="text-gray-500 text-sm mt-8">
                                    Drag &apos;n&apos; drop your CSV report
                                    here, or click to select (Max size: 5MB)
                                </p>
                            </>
                        </>
                    )}
                </div>

                {fileUrl && !sendDetails ? (
                    <button type="submit" onClick={onSubmit} className=" w-fit">
                        <p className=" text-2xl bg-gradient-to-r dark:from-[#00c6ff] dark:to-[#0072ff] from-[#0072ff] to-[#00c6ff]  bg-clip-text text-transparent font-semibold">
                            Submit
                        </p>
                    </button>
                ) : (
                    <button
                        type="submit"
                        onClick={noData}
                        title="Add File"
                        className=" w-fit"
                    >
                        <p className=" cursor-not-allowed text-2xl font-semibold text-gray-500">
                            Submit
                        </p>
                    </button>
                )}
                {sendDetails && (
                    <div className="flex justify-center items-center flex-col gap-1">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-gray-500 text-sm mt-2">
                            Submitting Details...
                        </p>
                    </div>
                )}
            </div>
            {/* <div>
                {data &&
                    data.map((row: any[], i: number) => (
                        <div key={i}>
                            {row.map((item: any, j: number) => (
                                <span key={j}>{item}</span>
                            ))}
                        </div>
                    ))}
            </div> */}
        </main>
    );
}
