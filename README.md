# Voice-Enabled Task Tracker  
### SDE Assignment Submission

This repository contains a full-stack task management application inspired by **Linear**, featuring a unique **voice input capability** that uses AI to intelligently parse natural speech and extract structured task details.

The application is built upon a **Microservices Architecture**, fronted by a unified **API Gateway**, demonstrating a scalable and modular backend design.


| Component                   | Technology                  | Version | Notes                                                                    |
|-----------------------------|------------------------------|---------|---------------------------------------------------------------------------|
| Frontend                    | React (Vite)                 | Latest  | Built with functional components and hooks.                               |
| Styling                     | Tailwind CSS                 | Latest  | For utility-first, responsive design.                                     |
| State Management            | React Context API            | N/A     | Used for simple global task state.                                        |
| Backend Framework           | Node.js (Express)            | Latest  | Used for all services and API Gateway.                                    |
| Database                    | MongoDB Atlas                | N/A     | Cloud-hosted NoSQL database.                                              |
| Speech-to-Text (STT)        | Deepgram                     | N/A     | Used in the Speech Microservice for transcription.                        |
| Intelligent Parsing (NLP)   | Gemini API                   | N/A     | Used in the NLP Microservice for extracting structured data.              |
| Architecture                | API Gateway + Microservices  | N/A     | Separates core functionality (Task, Speech, NLP) into distinct services.  |

# Project Structure

The project follows the mandatory structure with segregated frontend and backend directories:

| Directory / File                     | Description                                      |
|--------------------------------------|--------------------------------------------------|
| `/client`                            | Frontend (React)                                 |
| `/client/src/components`             | UI components                                    |
| ├── `KanbanBoard.jsx`                | Kanban board view                                |
| ├── `ListView.jsx`                   | List-based task view                             |
| ├── `TaskModal.jsx`                  | Manual task create/edit modal                    |
| └── `VoiceModal.jsx`                 | Speech input + parsing review modal              |
| `/client/src/context/TaskContext.jsx`| Global task state context                        |
| `.env.example`                       | Example environment variables                     |
| `/backend`                           | Backend (Node.js / Express)                      |
| `/backend/api-gateway`               | API Gateway (Port 8000)                          |
| `/backend/api-gateway/src`           | Routes, controllers, config                      |
| `/backend/services`                  | Microservices directory                          |
| `/backend/services/task-service`     | Task Service (Port 3000)                         |
| `/backend/services/task-service/src` | Models, controllers, routes                      |
| `/backend/services/speech-service`   | Speech Service (Port 3001)                       |
| `/backend/services/speech-service/src`| Deepgram client, controllers, routes             |
| `/backend/services/nlp-service`      | NLP Service (Port 3002)                          |
| `/backend/services/nlp-service/src`  | Gemini client, controllers, routes               |
| `README.md`                          | Project documentation                             |


## Project Setup

### 1. Prerequisites
- **Node.js:** Version 18+ (LTS recommended)  
- **MongoDB Atlas:** A cloud instance is required.  
- **API Keys:** Keys for Deepgram (Speech-to-Text) and Gemini (NLP Parsing).  

### 2. Environment Configuration
Create a `.env` file in each of the following directories (`api-gateway`, `task-service`, `speech-service`, `nlp-service`) based on the provided `.env.example` templates.

| Location                          | Variable              | Purpose                     | Example Value                        |
|----------------------------------|----------------------|-----------------------------|--------------------------------------|
| backend/api-gateway               | PORT                 | API Gateway Port            | 8000                                 |
|                                  | TASK_SERVICE_URL     | Task Service Route          | http://localhost:3000                |
|                                  | SPEECH_SERVICE_URL   | Speech Service Route        | http://localhost:3001                |
|                                  | NLP_SERVICE_URL      | NLP Service Route           | http://localhost:3002                |
| backend/services/task-service     | DB_URL               | MongoDB Connection String   | mongodb+srv://...                    |
|                                  | PORT                 | Task Service Port           | 3000                                 |
| backend/services/speech-service   | DEEPGRAM_API_KEY     | Deepgram API Key            | c2801ed7513462cfda0db35193662f9437f56a58 |
|                                  | PORT                 | Speech Service Port         | 3001                                 |
| backend/services/nlp-service      | GEMINI_API_KEY       | Gemini API Key              | AIzaSy...                             |
|                                  | PORT                 | NLP Service Port            | 3002                                 |
| client                            | VITE_API_BASE_URL    | Frontend base API URL       | http://localhost:8000                |

## 3. Installation and Running Locally

To run the application, you must start all four backend services and the frontend client.

### Step A: Backend Services Installation

In the terminal, run the following commands sequentially:

| Step | Service / Directory                    | Command           |
|------|---------------------------------------|-----------------|
| 1    | Task Service (`backend/services/task-service`)    | `npm install`   |
| 2    | Speech Service (`backend/services/speech-service`) | `npm install`   |
| 3    | NLP Service (`backend/services/nlp-service`)      | `npm install`   |
| 4    | API Gateway (`backend/api-gateway`)               | `npm install`   |

### Step B: Run Backend Services

Open four separate terminal windows and navigate to each backend directory to start the services:

| Terminal | Directory                     | Command         | URL                  |
|----------|-------------------------------|----------------|--------------------|
| 1        | backend/services/task-service | `node server.js` | http://localhost:3000 |
| 2        | backend/services/speech-service | `node server.js` | http://localhost:3001 |
| 3        | backend/services/nlp-service  | `node server.js` | http://localhost:3002 |
| 4        | backend/api-gateway           | `node server.js` | http://localhost:8000 |

---

### Step C: Run Frontend Client

Open a fifth terminal window for the client:

```bash
# 5. Run the client
cd client
npm install
npm run dev
# The application will open in your browser (typically http://localhost:5173)   
```
## API Documentation (API Gateway Endpoints)

The frontend interacts only with the **API Gateway** running on port 8000. The gateway then routes requests to the appropriate microservice.

| Purpose                 | Method | Gateway Path                 | Description                                                        | Microservice Handled By |
|-------------------------|--------|------------------------------|--------------------------------------------------------------------|------------------------|
| Get All Tasks           | GET    | /tasks/getTasks             | Retrieves all tasks, optionally filtered by status, priority, or search term. | Task Service           |
| Create Task (Manual)    | POST   | /tasks/createTask or /tasks/ct | Creates a new task using a standard JSON payload.                  | Task Service           |
| Update Task             | PUT    | /tasks/updateTask/:id       | Updates task fields (e.g., status change via drag-and-drop).       | Task Service           |
| Delete Task             | DELETE | /tasks/deleteTask/:id       | Deletes a task by ID.                                              | Task Service           |
| Voice-to-Text           | POST   | /speech/speectranscribe     | Uploads an audio file and returns the text transcript.             | Speech Service         |
| Intelligent Parsing     | POST   | /nlp/aiparser               | Accepts a text transcript and returns structured task JSON.        | NLP Service            |

## Example Voice Input Flow (via API Gateway)

### Client → Speech Service (via Gateway)
- **Method:** POST  
- **Path:** `http://localhost:8000/speech/speectranscribe`  
- **Request Body:** `multipart/form-data` with key `audio` (audio file blob)  
- **Success Response:**
```json
{
  "transcript": "Create a high priority task to review..."
}
```
### Client → NLP Service (via Gateway)
- **Method:** POST  
- **Path:** `http://localhost:8000/nlp/aiparser`  
- **Request Body:**
```json
{
  "transcribe": "Create a high priority task to review the pull request for the authentication module by tomorrow evening"
}
```
- Success Response:
```json
{
    "title": "Review the pull request for the authentication module",
    "priority": "high",
    "dueDate": "2025-12-05T18:00:00.000Z", // Example parsed date
    "status": "todo",
    "rawTranscript": "Create a high priority task to review the pull request..."
}
```
### Client → Task Service (via Gateway)
- **Method:** POST  
- **Path:** `http://localhost:8000/tasks/createTask`  
- **Request Body:** The structured JSON from step 2.

## Decisions & Assumptions

### 1. Architecture Design (Key Decision)
- **Microservices and API Gateway Pattern:** Chose a microservices architecture to enforce clear separation of concerns (SoC).  
- **Task Service:** Pure CRUD and database logic.  
- **Speech Service:** Handles only external STT (Deepgram) integration.  
- **NLP Service:** Handles only external AI parsing (Gemini) and data structuring.  
- **API Gateway:** Acts as a single entry point for the frontend, handling request routing and cross-cutting concerns (like potential rate limiting or logging, though a basic implementation is shown). This setup is highly modular and scalable.  

### 2. Task Data Model
- The Task model in MongoDB includes dedicated fields for the core requirements:  
  - `title`  
  - `priority` (enum: low, medium, high, urgent)  
  - `dueDate` (stored as `Date` for sorting/filtering)  
  - `status` (enum: todo, in-progress, done)  
- Inclusion of `rawTranscript` and `parsedData` fields allows for transparent debugging and fulfills the requirement to show the raw captured voice data alongside the saved task.

### 3. Voice Input Flow Assumption
- **Audio Upload:** For the Speech-to-Text step, the user interaction in the frontend involves capturing audio and converting it into a single file/blob that is then submitted to the `/speech/speectranscribe` endpoint via `multipart/form-data`.  
- This handles both live recording finalization and pre-recorded uploads (as demonstrated in the Postman data).

### 4. Due Date Parsing
- The NLP Service is prompted to convert all relative dates (e.g., "tomorrow evening," "next Monday") into a standardized ISO 8601 Date format (`YYYY-MM-DDTHH:MM:SS.sssZ`) before saving it to the MongoDB `dueDate` field.  
- This is critical for accurate time-based filtering and sorting.
## AI Used

| AI Tool Used           | Purpose in Project                     | Notable Outcome / Learned                                                                                                           |
|------------------------|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Gemini / ChatGPT       | Prompt Engineering for Structured Parsing | Used to create and refine the System Prompt for the NLP Microservice. The key was to force the model to output a strict JSON format with date conversion logic, handling variations in priority and date phrasing. |
| GitHub Copilot         | Boilerplate Code and Architecture Setup | Accelerated the creation of Express server structures, middleware (like the `uploadAudio` middleware for the Speech service), and helped fill in the initial React component structure (e.g., `KanbanBoard.jsx`). |
| ChatGPT                | Code Debugging (Drag-and-Drop)         | Helped debug complex state updates and synchronization issues related to the Kanban drag-and-drop functionality (moving tasks between status columns) on the frontend. |

## Key Highlights

- **Clean Microservices Architecture:**  
  Successfully implemented the API Gateway pattern with three distinct, modular microservices (Task, Speech, NLP), ideal for isolating dependencies and scaling different parts of the application independently.

- **Effective AI Integration:**  
  The voice feature isn't a single endpoint but a two-step pipeline (**Deepgram STT → Gemini NLP**) managed through the Gateway, demonstrating robust integration of multiple third-party AI providers.

- **Data Structure Optimization:**  
  The MongoDB schema uses indexes on `status` and `priority` and a compound index on `(status, priority)`, which is a key optimization for fast filtering and efficient rendering of the Kanban board view.
## Limitations & Next Steps

### Known Issues
- **Mobile Responsiveness:**  
  While functional on desktop, full mobile responsiveness (media queries, touch-friendly layouts) is incomplete.

- **Voice Recording/Upload Errors:**  
  Robust error handling for poor Deepgram API responses or malformed audio files is present but could be enhanced with better user-facing feedback messages.


### What I Would Do Next
- **Date and Time Zone Handling:**  
  Implement more rigorous server-side validation and consistent client-side display for time zones to prevent date shifts.

- **Microservice Communication:**  
  Implement a lightweight event bus (e.g., using Redis or a simple message queue) to decouple services further, allowing the Task Service to be updated after the NLP Service parses the data, rather than relying on synchronous calls via the Gateway.

- **Testing:**  
  Write comprehensive unit tests for all service controllers and integration tests for the API Gateway routing logic.
