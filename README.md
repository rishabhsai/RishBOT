# RishBOT: Your Local AI Assistant 🤖

A powerful, privacy-focused AI assistant that runs entirely on your local machine. Built with Next.js and Ollama, RishBOT provides intelligent assistance while keeping your data private.

## ✨ Features

### 🎯 Screen Content Recognition
- Capture and analyze screen content
- Extract text using OCR
- Find specific text
- Detect mathematical equations

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

## 🛠️ Tech Stack

- **Frontend**: Next.js 14
- **UI Components**: Shadcn UI
- **AI Model**: Ollama (Gemma 2B)
- **OCR**: Tesseract.js
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Ollama installed and running
- Gemma 2B model pulled in Ollama

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

3. Pull the Gemma model:
   ```bash
   ollama pull gemma:2b
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔒 Privacy Features

- 100% local processing
- No data sent to external servers
- All computations happen on your machine
- No API keys or external dependencies required

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://github.com/ollama/ollama) for providing the local AI model
- [Next.js](https://nextjs.org/) for the amazing framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR capabilities
