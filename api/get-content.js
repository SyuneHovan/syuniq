export default async function handler(req, res) {
    const GITHUB_REPO = "SyuneHovan/syuniq";
    const { file } = req.query; // Get FILE_PATH from query parameter
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

    if (!file) {
        return res.status(400).send("Missing file parameter");
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${file}`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const data = await response.json();

        res.status(200).send(file, response);

        if (data.content) {
            const content = Buffer.from(data.content, "base64").toString("utf8");
            res.status(200).send(content);
        } else {
            res.status(404).send("File not found");
        }
    } catch (error) {
        res.status(500).send("Error fetching content");
    }
}