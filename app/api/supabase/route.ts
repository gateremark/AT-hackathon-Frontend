import supabase from "@/lib/SupabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export type UploadData = {
    id?: string;
    goal1?: string;
    goal2?: string;
    goal3?: string;
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
                goal1: data.goal1,
                goal2: data.goal2,
                goal3: data.goal3,
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
