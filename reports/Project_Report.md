# IDTrace: Project Report
**Digital Footprint Awareness & Risk Scoring Platform**

---

## **1. Project Overview**
**IDTrace** is a sophisticated cybersecurity platform designed to empower individuals and organizations to visualize, understand, and secure their digital footprint. In an era where data breaches are ubiquitous, IDTrace moves beyond simple monitoring. It aggregates intelligence from multiple dark web sources, calculates a quantifiable risk score, and provides actionable, AI-driven security insights. The platform transforms raw threat data into a user-friendly "credit score" for digital identity security, closing the gap between complex threat intelligence and personal actionable security.

---

## **2. Project Modules**
The project is architected into five distinct, interacting modules that handle specific aspects of the user experience and data processing:

### **2.1 Authentication & Identity Module**
This module manages the secure onboarding and identification of users.
*   **Functionality:** Handles secure registration and login via Email/Password credentials and Google OAuth 2.0.
*   **Role Management:** Distinguishes between standard Users and Administrators for platform management.
*   **Session Handling:** Maintained via secure, encrypted JWT (JSON Web Tokens) sessions.

### **2.2 Intelligence Aggregation Engine (The "Scanner")**
The core backend service responsible for interacting with external threat landscapes.
*   **Functionality:** Queries multiple external threat intelligence APIs (such as IntelX, LeakCheck, DeHashed, and Maigret) in parallel.
*   **Normalization:** Ingests disparate data formats from these sources and converts them into a standardized, unified interior "Exposure" model, ensuring consistency in data analysis.

### **2.3 Risk Analysis & Scoring System**
A logic engine that processes raw exposure data to determine the user's threat level.
*   **Functionality:** Calculates a normalized Risk Score (0-100) based on multiple weighted factors: breach severity, data recency, and sensitivity of leaked data (e.g., passwords impose a higher penalty than usernames).
*   **Categorization:** Classifies users into risk tiers: Low, Medium, High, and Critical.

### **2.4 Command Dashboard & Visualization**
The user interface layer that presents complex data through intuitive visuals.
*   **Functionality:** Displays the Risk Gauge, Origin Maps (geospatial visualization of breach origins), and chronological timelines of data exposure events.

### **2.5 AI Sentinel Module**
An integrated interactive assistant powered by generative AI.
*   **Functionality:** Provides a conversational interface ("IDTrace Sentinel") where users can ask questions about specific breaches. It interprets technical breach data and offers personalized, step-by-step remediation advice.

---

## **3. Technologies Used**
The project utilizes a modern, performance-oriented technology stack to ensure scalability and responsiveness:

*   **Frontend Framework:** **Next.js 15 (App Router)** – Selected for its robust server-side rendering capabilities, SEO optimization, and routing efficiency.
*   **Language:** **TypeScript** – Utilized throughout the full stack to ensure type safety, reduce runtime errors, and improve code maintainability.
*   **Styling & UI:** **Tailwind CSS** combined with **Framer Motion** – Provides a premium, responsive "Glassmorphism" aesthetic with smooth, professional animations.
*   **Authentication:** **Auth.js (NextAuth v5)** – A flexible and secure authentication solution supporting multiple providers and session strategies.
*   **Database & ORM:** **PostgreSQL** managed via **Prisma ORM** – Ensures reliable, structured data storage with type-safe database queries.
*   **AI Integration:** **Vercel AI SDK** with **Google Gemini API** – Powers the intelligent analysis and chatbot features.
*   **Visualization:** **Leaflet.js** for interactive geospatial maps and **Recharts** for data visualization graphs.

---

## **4. Core Functionalities**
*   **Multi-Source Breach Scanning:** Capable of scanning multiple open-source intelligence (OSINT) and dark web databases simultaneously to build a complete profile.
*   **Dynamic Risk Scoring:** Generates a real-time security score (0-100), providing an immediate, understandable metric for digital safety.
*   **Geospatial Visualization:** Maps the geographical origin of data breaches, helping users visualize the global spread of their compromised information.
*   **AI-Driven Context:** Automatically analyzes the specific combination of leaks to generate a natural-language risk summary (e.g., "Your score is critical largely due to a recent password leak in the Adobe breach").
*   **Historical Tracking:** For registered users, the platform monitors risk status over time, creating a history of their digital security posture.
*   **Interactive Assistant:** A built-in chatbot allows users to query the system for advice, such as "How do I secure my account after the Canva leak?"

---

## **5. Comparison: Existing Systems vs. IDTrace**

| Feature | Existing Systems (e.g., HaveIBeenPwned) | **IDTrace (Current Project)** |
| :--- | :--- | :--- |
| **Data Presentation** | Static textual lists of breaches; often overwhelming textual data. | **Visual Dashboard:** Risk Gauges, Heatmaps, and interactive timelines for intuitive understanding. |
| **Risk Metrics** | Binary status (Pwned / Safe). | **Quantifiable Score:** A calculated 0-100 "Security Credit Score" for granular assessment. |
| **Context** | Generic security advice applicable to everyone. | **AI-Personalized Context:** Advice tailored to *your* specific leaked data types (e.g., specific advice for leaked phone numbers vs. passwords). |
| **Data Scope** | Often limited to a single proprietary database. | **Aggregated Intelligence:** Queries multiple OSINT sources simultaneously for broader coverage. |
| **User Engagement** | Passive, read-only search pages. | **Active Engagement:** Interactive chat with an AI assistant for immediate, conversational help. |

---

## **6. Technical Implementation**
The system implements a refined data processing pipeline:

1.  **Input Acquisition:** The user provides an identifier (email or username) via the secure Dashboard interface.
2.  **Service Orchestration:** The `monitor-scanner.ts` service triggers a parallel execution of enabled **Adapters** (e.g., `IntelXAdapter`, `LeakCheckAdapter`, `DeHashedAdapter`).
3.  **Data Normalization:** Raw JSON responses from external APIs are parsed and mapped to a unified `Exposure` object structure, abstracting away the differences between data providers.
4.  **Algorithmic Scoring (`scoring.ts`):**
    *   The engine iterates through all normalized exposures.
    *   **Penalties** are applied based on type (e.g., -25 for Breaches, -10 for Scrapes).
    *   **Modifiers** adjust penalties based on severity (Critical breaches multiply penalty by 2x) and data classes (Password leaks incur higher penalties).
    *   **Logic Capping:** To prevent false assurances, the score is strictly capped at 60/100 if any confirmed password breach is detected.
5.  **GenAI Analysis:** A constructed prompt containing the user's specific breach summary is sent to the Google Gemini model, which returns a concise, human-readable explanation of the risk factors.
6.  **Presentation Hydration:** The processed data and AI analysis are sent to the frontend `AnalyzePage`, where React components render the visualizations.

---

## **7. Project Structure**
The project follows a modular, industry-standard directory structure based on the Next.js App Router:

*   **`app/`**: Contains the application routing logic.
    *   `dashboard/`: Protected user views including History, Monitors, and Settings.
    *   `api/`: Backend API routes (`/scan`, `/auth`, `/chat`) handling server-side logic.
    *   `analyze/`: The public-facing analysis results interface.
*   **`components/`**: Houses reusable UI building blocks.
    *   `features/`: Complex, business-logic-aware components like `RiskGauge` and `LocationMap`.
    *   `ui/`: Atomic design elements (Buttons, Inputs, Cards) for consistent styling.
*   **`lib/`**: Contains the core business logic and utility functions.
    *   `services/`: The backend logic for the scanner and scoring engines (`monitor-scanner.ts`, `scoring.ts`).
    *   `prisma/`: Database configuration and schema definitions.
*   **`prisma/`**: Contains the `schema.prisma` file, defining the data models for `User`, `Account`, and `Monitor` entities.
