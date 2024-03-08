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
    // const [fileUrl, setFileUrl] = useState<string | null>(null);

    const uploadFile = async (file: File) => {
      const time: Number = new Date().valueOf();
      const imgKey: string = `insights/${file.name}-${time}`;
        const { data, error } = await supabase.storage
            .from("picsa")
            .upload(imgKey, file, {
                cacheControl: "3600",
                upsert: false,
            });
        console.log("Data: ", data);
        console.log("Error: ", error);

        const fileUrl = supabase.storage
            .from("picsa")
            .getPublicUrl(`insights/${file.name}`).data.publicUrl;
        console.log("FileUrl: ", fileUrl);
        // setFileUrl(fileUrl);
        if (error) {
            throw error;
        }
        // return data;
        const projectData: UploadData = {
            id: Date.now().toString(),
            goal1: "goal1",
            goal2: "goal2",
            goal3: "goal3",
            phone: "+254768",
            url: fileUrl,
        };

        console.log("projectData: ", projectData);

        const response = await axios.post("/api/supabase", projectData);
        console.log("Response: ", response);
        if (response.status === 200) {
            toast.success("Form submitted successfully!");
        } else {
            toast.error("Error submitting form!");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "application/csv": [".csv", ".json", ".xls", ".xlsx"],
        },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File too large. Max size is 5MB.");
                // alert("File too large. Max size is 10MB.");
                return;
            }
            try {
                setUploading(true);
                const data = await uploadFile(file);
                // if (!data?.file_key || !data?.file_name) {
                //     toast.error("Failed to upload file!");
                //     // alert("Failed to upload file!");
                //     return;
                // }
                console.log("data:", data);
                toast.success("File uploaded successfully!");
            } catch (error) {
                console.log(error);
                toast.error("Failed to upload file!");
            } finally {
                setUploading(false);
            }
        },
    });
    return (
        <main className="flex max-w-[1200px] mx-auto flex-col items-center py-2 h-screen">
            <Toaster richColors />
            <div
                {...getRootProps({
                    className:
                        "cursor-pointer p-4 border-dashed border-2 border-gray-300 rounded-xl text-center hover:border-gray-500 transition duration-300 ease-in-out",
                })}
            >
                <input {...getInputProps()} className=" w-[500px] h-full" />
                {uploading ? (
                    <>
                        <div className="flex justify-center items-center flex-col">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="text-gray-500 text-sm mt-2">
                                Uploading...
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {" "}
                        <FaFileArrowDown className=" dark:text-[#020817] text-[#020817] absolute left-[47%] text-3xl top-4" />
                        <>
                            <p className="text-gray-500 text-sm mt-8">
                                Drag &apos;n&apos; drop your CSV report here, or
                                click to select (Max size: 5MB)
                            </p>
                        </>
                    </>
                )}
            </div>
        </main>
    );
}
