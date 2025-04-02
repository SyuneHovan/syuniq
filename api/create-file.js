export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const GITHUB_REPO = "SyuneHovan/syuniq";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const { fileName } = req.body; // Get file name from request

    if (!fileName) {
        return res.status(400).send("Missing fileName parameter");
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`;
    const defaultContent = "<!DOCTYPE html><html><body><h1>New Page</h1></body></html>";

    const commitData = {
        message: `Create ${fileName}`,
        content: Buffer.from(defaultContent).toString("base64")
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(commitData)
        });

        if (!response.ok) {
            throw new Error("GitHub commit failed");
        }

        res.status(201).json({ success: true, message: "File created!", file: fileName });
    } catch (error) {
        console.error("Error creating file:", error);
        res.status(500).send("Error creating file on GitHub.");
    }
}
