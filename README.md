# RishBOT 🤖

A powerful AI assistant that leverages both local and cloud-based AI models to provide intelligent assistance while prioritizing your data privacy where possible. Built with Next.js and Ollama for local LLM interactions, and OpenAI for advanced screen analysis.

## ✨ Features

### 🎯 Screen Content Recognition
- Capture and analyze screen content using OpenAI's Vision API
- Extract visible text and get general summaries/descriptions
- Identify mathematical equations
- Chat with AI about the screen content

### 🧮 Math & Physics Problem Solver
- Solve complex mathematical equations
- Tackle physics problems
- Get step-by-step solutions
- Support for various problem types

### ✍️ Essay Writer
- Generate well-structured essays
- Multiple essay types (argumentative, descriptive, narrative, expository)
- Customizable tone and length
- Academic and creative writing support
- AI-assisted text modification (local processing)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14
- **UI Components**: Shadcn UI
- **Local AI Model**: Ollama (Gemma 2B)
- **Screen Analysis AI**: OpenAI Vision API (gpt-4o)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Ollama installed and running (for Essay Writer and Problem Solver)
- Gemma 2B model pulled in Ollama (`ollama pull gemma:2b`)
- **OpenAI API Key**: Required for Screen Content Recognition. Obtain one from [OpenAI](https://platform.openai.com/account/api-keys).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishabhsai/RishBOT.git
   cd RishBOT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API Key:
   Create a `.env.local` file in the root of the `RishBOT` directory with the following content:
   ```
   OPENAI_API_KEY='YOUR_API_KEY_HERE'
   ```
   Replace `YOUR_API_KEY_HERE` with your actual OpenAI API Key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔒 Privacy Features

- **Local Processing (Essay Writer, Problem Solver):** Features like the Essay Writer and Problem Solver process all data locally using Ollama, ensuring your information remains on your machine.
- **Cloud Processing (Screen Content Recognition):** Due to the intensive nature of screen image analysis, this feature utilizes OpenAI's cloud-based AI models. Screen image data is sent to OpenAI for processing. We prioritize transparency and user consent for this functionality.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://github.com/ollama/ollama) for providing the local AI model
- [OpenAI](https://openai.com/) for their powerful Vision API
- [Next.js](https://nextjs.org/) for the amazing framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
