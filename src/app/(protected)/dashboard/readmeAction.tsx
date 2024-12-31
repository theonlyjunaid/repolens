"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// List of file patterns to exclude
const EXCLUDED_FILES = [
  ".gitignore",
  "README.md",
  'node_modules',
];


export const generateReadme = async (projectId: string) => {
  const stream = createStreamableValue();

  // Fetch summaries from the database
  const result = await db.sourceCodeEmbedding.findMany({
    where: {
      projectId,
    },
    select: {
      fileName: true,
      sourceCode: true,
      summary: true,
    },
    take: 20, // Adjust as needed
  });

  // Filter out generic files
  const filteredResult = result.filter(doc =>
    !EXCLUDED_FILES.some(pattern => doc.fileName.includes(pattern))
  )

  if (result.length === 0) {
    throw new Error("No relevant project files found for README generation.");
  }

  // Build context from summaries
  let context = "";
  for (const doc of filteredResult) {
    context += `### File: ${doc.fileName}\n`;
    context += `**Source Code:**\n\`\`\`\n${doc.sourceCode}\n\`\`\`\n\n`;
    context += `**Summary:** ${doc.summary}\n\n`;
  }
  // Call Gemini API to generate README
  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-pro"),
      prompt: `

      select only file names of the files which give context of the project so that thier content can be used to generate a readme file
      consume the imformation from the selected files
      now generate a readme file for the project using the information consumed

      ## geberate readme file based on your abilities and the information consumed from the selected files
      readme file may contain the following sections:
      - Project Name
      - Project Overview 
      - Project Deployment (with a placeholder for the deployment URL)
      - Table of Contents (with links to each section)
      - Project Features 
      - Project Tech Stack (with brief descriptions of each technology)
      - Project Requirements
      - Visual image to represent the project (with a placeholder for the image URL)
      - Project Installation & Setup
      - Project Contribution Guidelines
      - Project License
      - Project Contact Information
      - Project conclusion

      ## You cab also add any other relevant sections and information to the readme file to make it more informative and useful

      ### START CONTEXT BLOCK
      ${context}
      ### END OF CONTEXT BLOCK
      
      Do not include any additional information section in the readme file
      Include relavent emojis to make the readme file more attractive
    
      return the content in MARKDOWN (.md) format which can be used to preview the readme file using react-markdown or any other markdown renderer
      DO NOT USE \'\'*\'\' 
      DO NOT USE "*"


      Example file format:
      ---
# Deepfake Detector App 🔎

## Project Overview

This project implements a Streamlit application that detects deepfakes in images and videos.  Users can upload their media, choose a detection model, and receive a prediction along with a probability score.  The app provides a user-friendly interface for interacting with sophisticated deepfake detection models.

## Project Deployment (with a placeholder for the deployment URL)

[Deployment URL - Placeholder] 🚀

## Table of Contents

- [Project Name](#project-name)
- [Project Overview](#project-overview)
- [Project Deployment](#project-deployment-with-a-placeholder-for-the-deployment-url)
- [Table of Contents](#table-of-contents)
- [Project Features](#project-features)
- [Project Tech Stack](#project-tech-stack)
- [Project Requirements](#project-requirements)
- [Visual Image](#visual-image)
- [Project Installation & Setup](#project-installation--setup)
- [Project Contribution Guidelines](#project-contribution-guidelines)
- [Project License](#project-license)
- [Project Contact Information](#project-contact-information)
- [Project Conclusion](#project-conclusion)


## Project Features

- **Image and Video Deepfake Detection:** Analyze both image and video files for deepfake manipulation.
- **Model Selection:** Choose from different pre-trained deepfake detection models (EfficientNet variants).
- **Dataset Selection:** Specify the dataset the model was trained on (DFDC or FF++).
- **Threshold Adjustment:** Control the sensitivity of the detection by setting a probability threshold.
- **Interactive Interface:** User-friendly Streamlit interface for easy file uploads and interaction.
- **Clear Results:**  Displays "real" or "fake" prediction with associated probability, color-coded for clarity.

## Project Tech Stack

- **Streamlit:**  Framework for building interactive web apps for machine learning.
- **Pillow (PIL):** Image processing library for handling image uploads and manipulation.
- **PyTorch:** Deep learning framework for model loading and inference.
- **BlazeFace:**  Face detection model for extracting faces from images and videos.
- **EfficientNet (variants):**  Convolutional neural network architectures used for deepfake detection.
- **Xception:** Another CNN architecture option for deepfake detection.
- **NumPy:** Numerical computing library for array manipulation.
- **OpenCV (cv2):**  Computer vision library used for video processing.
- **SciPy:** Scientific computing library for mathematical functions.
- **Albumentations:**  Library for image augmentation (used during model training).
- **Pandas:** Data manipulation library for handling datasets.
- **Flask (for API):**  Web framework for creating a backend API (if applicable).


## Project Requirements

The project dependencies are listed in \`requirements.txt\`.  You can install them using:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Visual Image

[Image URL Placeholder] 🖼️

## Project Installation & Setup

1. Clone the repository.
2. Install the required packages from \`requirements.txt\`.
3. Run the Streamlit app using \`streamlit run Output.py\`.

## Project Contribution Guidelines

[Contribution Guidelines Placeholder] 🤝

## Project License

[License Placeholder] 📜

## Project Contact Information

[Contact Information Placeholder] 📧

## Project Conclusion

This Deepfake Detector App offers a practical solution for identifying potential deepfakes in images and videos.  By leveraging powerful deep learning models and a user-friendly interface, it empowers users to assess the authenticity of digital media.  Future improvements could include adding more models, supporting different media formats, and integrating explainability features. 
      `,
    });
    

    // Stream the AI-generated README.md content
    for await (const delta of textStream) {
      stream?.update(delta);
    }
  
    stream.done();
  })();
  
  return {
    output: stream.value,
    fileReferences: filteredResult,
  };
};
