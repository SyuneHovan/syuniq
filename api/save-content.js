export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const GITHUB_REPO = "SyuneHovan/syuniq";
    const FILE_PATH = "content.html";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const { content } = req.body;

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

    try {
        const fileRes = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const fileData = await fileRes.json();
        const sha = fileData.sha; 

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

        if (!response.ok) throw new Error("GitHub commit failed");

        res.status(200).send("Content saved successfully!");
    } catch (error) {
        res.status(500).send(error);
    }
}
