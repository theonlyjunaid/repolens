import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Replace with your GitHub token stored in an environment variable
});

interface RepositoryInfo {
  name: string;
  description: string | null;
  topics: string[];
  license: { name: string } | null;
}

const generateReadme = async (owner: string, repo: string): Promise<string> => {
  try {
    // Fetch repository metadata
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    console.log("hello",repoData)
    const { name, description, topics, license }: RepositoryInfo = repoData;

    // Fetch file summaries
    const { data: contents } = await octokit.repos.getContent({ owner, repo, path: "" });
    console.log("hello2",contents)
    const files = Array.isArray(contents) ? contents.filter(item => item.type === "file") : [];

    // Start building the README content
    let readmeContent = `# ${name}\n\n`;
    readmeContent += `${description || "No description provided."}\n\n`;

    // Add key features based on topics
    if (topics.length) {
      readmeContent += "## Key Features\n";
      readmeContent += topics.map(topic => `- ${topic}`).join("\n") + "\n\n";
    }

    // Add installation section
    const packageJson = files.find(file => file.name === "package.json");
    if (packageJson) {
      const { data: packageData } = await octokit.repos.getContent({
        owner,
        repo,
        path: packageJson.path,
      });
      const packageJsonContent = JSON.parse(
        Buffer.from(packageData?.content, packageData?.encoding as BufferEncoding).toString()
      );

      if (packageJsonContent.scripts && packageJsonContent.scripts.install) {
        readmeContent += "## Installation\n";
        readmeContent += "Run the following command to install dependencies:\n\n";
        readmeContent += "```bash\nnpm install\n```\n\n";
      }
    }

    // Add license section
    if (license) {
      readmeContent += "## License\n";
      readmeContent += `${license.name}\n\n`;
    }

    // Return the final README content
    return readmeContent;
  } catch (error) {
    console.error("Error generating README:", error);
    throw new Error("Failed to generate README.md file.");
  }
};

// Example Usage
(async () => {
  const owner = "talha-ansarii"; // Replace with repository owner
  const repo = "dtu-research-portal"; // Replace with repository name

  try {
    const readme = await generateReadme(owner, repo);
    console.log(readme);
  } catch (error) {
    console.error(error);
  }
})();
