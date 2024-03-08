import fetch from "node-fetch";

export default async function handler(req: any, res: any) {
    const { projectData } = req.body;

    try {
        const response = await fetch(
            "https://vfd2wfkp-5000.uks1.devtunnels.ms/user",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectData),
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}
