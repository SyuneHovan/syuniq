export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const GITHUB_REPO = "SyuneHovan/syuniq";
    const { file } = req.query; // Get FILE_PATH from query parameter
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const { content } = req.body;

    // console.log("Received content:", content); // Log the content to verify
    if (!file) {
        return res.status(400).send("Missing file parameter");
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${file}`;

    try {
        const fileRes = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (!fileRes.ok) {
            throw new Error("Failed to fetch file from GitHub");
        }

        const fileData = await fileRes.json();

        // Ensure the fileData contains sha
        if (!fileData.sha) {
            throw new Error("No sha found in GitHub response");
        }

        console.log("File data from GitHub:", fileData); // Log the file data

        const sha = fileData.sha; // This is the SHA of the file you want to update

        const commitData = {
            message: "Update content via Vercel",
            content: Buffer.from(content).toString("base64"),
            sha
        };

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

        res.status(200).send("Content saved successfully!");
    } catch (error) {
        console.error("Error during GitHub API request:", error);
        res.status(500).send("An error occurred while saving the content.");
    }
}
