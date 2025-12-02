Starting project

                    ┌──────────────────────────┐
                    │        Frontend (React)  │
                    │   - Board + List Views   │
                    │   - Mic Button           │
                    │   - Preview Modal        │
                    └───────────┬──────────────┘
                                │
                                ▼
                    ┌──────────────────────────┐
                    │  API Gateway / Backend   │
                    │  Node.js + Express       │
                    │                          │
                    │ Routes:                  │
                    │   /tasks (CRUD)          │
                    │   /voice/transcribe      │
                    │   /voice/parse           │
                    └───────────┬──────────────┘
                                │ ( Microservices )
               ┌────────────────┴──────────────────┐
               ▼                                   ▼
   ┌───────────────────────┐             ┌───────────────────────┐
   │ Speech-to-Text API    │             │ NLP Parsing Layer      │
   │ (Deepgram / Google)   │             │ (OpenAI / Gemini)      │
   └───────────────────────┘             └───────────────────────┘
                                │
                                ▼
                   ┌──────────────────────────┐
                   │  Database Layer          │
                   │  PostgreSQL / MongoDB    │
                   │  Tasks (title, priority) │
                   └──────────────────────────┘


Microservice logic goes like this:
Client → Gateway → Service → Gateway → Client
