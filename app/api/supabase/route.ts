import supabase from "@/lib/SupabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export type UploadData = {
    id?: string;
    goal?: string;

    phone: string;
    url: string;
};

export const POST = async (req: NextRequest, res: NextResponse) => {
    const data: UploadData = await req.json();
    const id = uuidv4();
    // const projectUrl = `${id}`;

    const { data: projectData, error: projectError } = await supabase
        .from("Insights")
        .insert([
            {
                id: id,
                goal: data.goal,
                phone: data.phone,
                url: data.url,
            },
        ]);
    // console.log("ProjectData: ", projectData);
    // console.log("ProjectError: ", projectError);
    if (projectError) {
        return NextResponse.json({ error: projectError });
    }

    return NextResponse.json({ data: projectData });
};
