# Katha - AI Script Generator

Katha is a powerful AI-driven script generation and editing tool developed for hackathons. It leverages the Groq LLM API to generate high-quality screenplays, character cards, and ambience/sound design suggestions based on simple user prompts.

## ✨ Features

- **AI Script Generation**: Generate full scripts with customizable parameters (Genre, Time Period, Dialogue Style, Content Type).
- **Interactive Editor**: Import existing scripts and apply AI-driven edits to refine the content.
- **Character Cards**: Automatically extracts and describes main characters from your script.
- **Ambience & Sound Design**: Generates contextual sound design suggestions for your scenes.
- **Premium UI**: A warm, aesthetic design inspired by traditional storytelling, built with React and Vite.

## 🎨 Design Palette

- **Background**: `#F1E9D2` (Antique White)
- **Primary Components**: `#D6BFA6` (Sandstone)
- **Accents**: `#9C7B5C` (Earth Brown)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Groq API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ProfBoring/Katha_ai.git
   cd Katha_ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API key:
   The API key is currently hardcoded for the demo in `src/services/groqService.js`. For production, use environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Groq SDK](https://groq.com/)
- [React Router](https://reactrouter.com/)

## 📜 License

Distributed under the MIT License.
