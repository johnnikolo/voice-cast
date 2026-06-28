# Voice Cast

An AI-powered podcast generator built with React, TypeScript, and the ElevenLabs API. Enter a topic, pick two voices, and get a fully voiced two-host podcast episode in seconds.

<img width="1090" height="518" alt="image" src="https://github.com/user-attachments/assets/7e9450b2-b684-4198-935e-4fa888359a08" />

## What it does

1. **Write** — You enter a topic (e.g. *"The future of voice AI"*). Groq's Llama 3 model generates a natural, 6–8 turn conversation between two podcast hosts.
2. **Voice** — Each line of the script is synthesized using a distinct ElevenLabs voice of your choosing, selected from your account's full voice library.
3. **Play** — The episode plays back sequentially with a live transcript that highlights the active speaker as the audio runs.

## Tech stack

- **React + TypeScript** (Vite)
- **ElevenLabs API** — text-to-speech synthesis and voice library
- **Groq API** — script generation via `llama-3.1-8b-instant` (free tier)

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/johnnikolo/voice-cast.git
cd voice-cast
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up API keys

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

```env
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key_here
VITE_GROQ_API_KEY=your_groq_key_here
```

- **ElevenLabs key** — [elevenlabs.io](https://elevenlabs.io) → Profile → API Keys
- **Groq key** — [console.groq.com](https://console.groq.com) → API Keys (free, no credit card)

### 4. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Usage

1. Type a topic into the input field and press **Enter** or click **Generate Episode**
2. Pick a voice for **Host A** and **Host B** from the dropdowns — click **▶ Preview** to audition a voice before generating
3. Watch the transcript appear and follow along as each line is highlighted during playback
4. Use **Pause / Resume** to control playback, or **Reset** to start over

## Notes

- The free ElevenLabs tier includes **10,000 characters/month**. A typical generated episode uses ~800–1,200 characters.
- Groq's free tier has generous rate limits and requires no payment method.
- API keys are stored locally in `.env` and are never committed to the repository.
