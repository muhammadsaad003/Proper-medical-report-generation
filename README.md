# Proper Medical Report Generation

A React + Vite frontend for a radiology research demo that analyzes an uploaded medical image, retrieves visually similar images, generates a caption/report-style description, and detects the image modality by calling a Gradio backend hosted on Hugging Face Spaces.

> **Important medical disclaimer:** This project is for research and educational demonstration only. It is **not** a medical device, is **not** intended for diagnosis or treatment decisions, and should not be used as a substitute for review by qualified healthcare professionals.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Backend Configuration](#backend-configuration)
- [Available Scripts](#available-scripts)
- [Build and Preview](#build-and-preview)
- [Deployment Notes](#deployment-notes)
- [Privacy and Safety Notes](#privacy-and-safety-notes)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)

## Overview

This application provides a simple browser-based interface for radiology image retrieval and captioning. Users can upload an image, choose how many similar images to retrieve, and submit the image for analysis. The frontend sends the image to a Gradio backend using `@gradio/client`, then renders the returned results.

The current backend Space is configured in [`src/hfClient.js`](src/hfClient.js):

```js
const SPACE_ID = "saad003/radiology-retrieval-captioning";
```

## Features

- Upload a radiology image from the browser.
- Select the number of similar images to retrieve.
- Send the image to a Gradio/Hugging Face backend.
- Display a generated caption for the uploaded image.
- Display the detected imaging modality.
- Display a gallery of retrieved similar images.
- Includes a visible research-only warning in the UI.
- Lightweight frontend built with Vite and React.

## Tech Stack

- **React** — UI library for building the frontend.
- **Vite** — fast development server and build tool.
- **@gradio/client** — JavaScript client for calling the Gradio backend.
- **ESLint** — linting for JavaScript and React code quality.

## Project Structure

```text
Proper-medical-report-generation-main/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx
│   ├── hfClient.js
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

### Key Files

| File | Purpose |
| --- | --- |
| `src/App.jsx` | Main React component. Handles image upload, form state, backend call, and result rendering. |
| `src/hfClient.js` | Connects to the Hugging Face Space through `@gradio/client`. |
| `src/main.jsx` | React entry point that mounts the app. |
| `src/index.css` | Global styling. |
| `src/App.css` | Additional component/template styling. |
| `vite.config.js` | Vite configuration. |
| `eslint.config.js` | ESLint configuration. |

## Prerequisites

Install the following before running the project:

- **Node.js `^20.19.0` or `>=22.12.0`**
- **npm**
- A stable internet connection to call the Hugging Face/Gradio backend

The Node.js version requirement comes from the installed Vite version in this project.

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Proper-medical-report-generation-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Vite will print a local development URL in the terminal, usually similar to:

```text
http://localhost:5173/
```

Open that URL in your browser.

### 4. Use the App

1. Click **Choose File** and select a radiology image.
2. Set the number of similar images to retrieve.
3. Click **Analyze image**.
4. Review the generated caption, detected modality, and similar-image gallery.

## How It Works

The frontend flow is:

1. The user selects an image file in the browser.
2. `App.jsx` stores the image and the selected `k` value in React state.
3. When the user clicks **Analyze image**, `queryBackend(file, k)` is called.
4. `src/hfClient.js` connects to the configured Hugging Face Space.
5. The image and `k` value are sent to the Gradio endpoint.
6. The backend response is expected in this order:

```js
[gallery, caption, modality]
```

7. The frontend displays:
   - similar images from `gallery`
   - generated text from `caption`
   - detected modality from `modality`

## Backend Configuration

The backend Space is currently hard-coded in [`src/hfClient.js`](src/hfClient.js):

```js
const SPACE_ID = "saad003/radiology-retrieval-captioning";
```

To use a different Hugging Face Space, replace the value with your own Space ID:

```js
const SPACE_ID = "your-username/your-space-name";
```

The app expects the Gradio backend to expose a prediction endpoint at `/` and accept two inputs:

| Input | Type | Description |
| --- | --- | --- |
| `image` | File/Image | Uploaded radiology image. |
| `k` | Number | Number of similar images to retrieve. |

The app expects the backend to return:

| Output Position | Name | Description |
| --- | --- | --- |
| `0` | `gallery` | Similar images, usually returned as image URLs or image-caption tuples. |
| `1` | `caption` | Generated caption/report-style text. |
| `2` | `modality` | Detected imaging modality. |

## Available Scripts

Run these commands from the project root.

### Start Development Server

```bash
npm run dev
```

Runs the app locally with Vite hot module replacement.

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Run Linter

```bash
npm run lint
```

Checks the project with ESLint.

## Build and Preview

To test the production version locally:

```bash
npm run build
npm run preview
```

Then open the preview URL printed by Vite.

## Deployment Notes

This is a static frontend application. After running:

```bash
npm run build
```

upload the generated `dist/` folder to a static hosting provider such as:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

Before deploying, verify that:

- The configured Hugging Face Space is public or accessible from the browser.
- The backend endpoint accepts the expected input names: `image` and `k`.
- The backend returns data in the expected order: `gallery`, `caption`, `modality`.
- The application is not presented as a clinically validated diagnostic tool.

## Privacy and Safety Notes

Medical images can contain sensitive patient information. Before uploading any image to the backend:

- Remove or anonymize personally identifiable information.
- Do not upload real patient data unless you have proper authorization.
- Confirm that the backend and hosting environment satisfy your privacy, security, and compliance requirements.
- Treat all generated captions and modality predictions as experimental outputs.
- Always require qualified medical review for clinical interpretation.

## Troubleshooting

### The app shows “Error calling backend. Check console.”

Possible causes:

- The Hugging Face Space is sleeping, unavailable, private, or restarting.
- The backend endpoint path is different from `/`.
- The backend input names do not match `image` and `k`.
- The backend output order is different from `[gallery, caption, modality]`.
- The browser blocked the request because of network or CORS issues.

Open the browser console for detailed errors.

### Similar images do not display

Check whether the backend returns gallery items as image URLs, file objects, or tuples. The current frontend supports simple image values and tuple-like values where:

```js
item[0] // image source
item[1] // caption
```

If your backend returns a different format, update the gallery mapping logic in `src/App.jsx`.

### The development server fails to start

Confirm that your Node.js version is compatible:

```bash
node --version
```

This project uses a Vite version that requires Node.js `^20.19.0` or `>=22.12.0`.

Then reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### The backend returns undefined caption or modality

Check the output order in `src/hfClient.js`:

```js
const [gallery, caption, modality] = result.data;
```

If the backend returns outputs in a different order, adjust this line accordingly.

## Future Improvements

- Move the Hugging Face Space ID into an environment variable.
- Add a loading spinner and better error messages.
- Add image preview before submission.
- Validate file type and file size before upload.
- Add unit tests and component tests.
- Improve the UI with responsive layout and accessibility enhancements.
- Add a results export option for research reports.
- Add backend health-check status before submitting images.

## License

No license file is currently included in this repository. Add a license before publishing or distributing the project so others know how they are allowed to use, modify, and share it.

## Acknowledgements

- Built with React and Vite.
- Uses `@gradio/client` to communicate with a Gradio backend.
- Backend configured for the Hugging Face Space: `saad003/radiology-retrieval-captioning`.
