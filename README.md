# Local AI Assistant

A powerful local AI assistant that helps with screen content recognition, math and physics problem solving, and essay writing.

## Features

### Screen Content Recognition
- Capture and analyze screen content
- Extract text using OCR
- Find specific text on screen
- Detect mathematical equations

### Math and Physics Problem Solver
- Solve mathematical equations
- Handle physics problems
- Support for various problem types
- Step-by-step solutions

### Essay Writer
- Generate essays on any topic
- Multiple essay types (analytical, persuasive, descriptive, narrative)
- Adjustable tone (formal, casual, academic)
- Customizable length

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/local-ai-assistant.git
cd local-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Install Tesseract OCR:
- macOS: `brew install tesseract`
- Linux: `sudo apt-get install tesseract-ocr`
- Windows: Download and install from GitHub

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Screen Analysis
1. Click on the "Screen Analysis" tab
2. Use the buttons to capture screen content, extract text, find specific text, or detect equations
3. View the results in the analysis panel

### Math & Physics Problem Solver
1. Click on the "Math & Physics" tab
2. Select the problem type (Mathematics or Physics)
3. Enter your problem in the text area
4. Click "Solve Problem" to get the solution

### Essay Writer
1. Click on the "Essay Writer" tab
2. Enter your essay topic
3. Select the essay type, tone, and length
4. Click "Generate Essay" to create your essay

## Development

### Project Structure
```
local-ai-assistant/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
│       └── utils.ts
├── public/
├── package.json
└── README.md
```

### Adding New Features
1. Create new components in `src/components/`
2. Add new API routes in `src/app/api/`
3. Update the UI in `src/app/page.tsx`
4. Test thoroughly

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Next.js
- Shadcn UI
- Tesseract OCR
- Ollama
