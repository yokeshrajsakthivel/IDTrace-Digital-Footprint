# Google Authentication Setup Guide

To make "Sign in with Google" work on both Localhost and Vercel, follow these exact steps.

## Phase 1: Google Cloud Console (Get Keys)

1.  Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2.  **Create a New Project**:
    *   Click the project dropdown (top left).
    *   Click **"New Project"**.
    *   Name it `IDTrace` and click **Create**.
3.  **Configure OAuth Consent Screen**:
    *   In the search bar, type `OAuth consent screen` and select it.
    *   Select **External** (User Type) and click **Create**.
    *   **App Name**: `IDTrace`.
    *   **User Support Email**: Select your email.
    *   **Developer Contact Email**: Enter your email.
    *   Click **Save and Continue** (skip Scopes and Test Users for now, just keep clicking Save).
    *   *Note: If testing fails later, go back to "Test Users" and add your specific email, or click "Publish App" to make it public.*
4.  **Create Credentials**:
    *   Go to **Credentials** (left sidebar).
    *   Click **+ CREATE CREDENTIALS** -> **OAuth client ID**.
    *   **Application type**: `Web application`.
    *   **Name**: `IDTrace Code`.
    *   **Authorized JavaScript origins**:
        *   Add URI 1: `http://localhost:3000`
        *   Add URI 2: `https://your-project-name.vercel.app` (Replace with your actual Vercel domain)
    *   **Authorized redirect URIs** (CRITICAL):
        *   Add URI 1: `http://localhost:3000/api/auth/callback/google`
        *   Add URI 2: `https://your-project-name.vercel.app/api/auth/callback/google` (Replace with your actual Vercel domain)
    *   Click **Create**.
5.  **Copy Your Keys**:
    *   Copy **Client ID**.
    *   Copy **Client Secret**.

---

## Phase 2: Add Keys to Vercel (Production)

1.  Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2.  Select your project (`idtrace`).
3.  Go to **Settings** -> **Environment Variables**.
4.  Add the following variables:
    *   **Key**: `AUTH_GOOGLE_ID`
        *   **Value**: (Paste your Client ID)
    *   **Key**: `AUTH_GOOGLE_SECRET`
        *   **Value**: (Paste your Client Secret)
        *   *Check options: Select specific environments (Production, Preview, Development).*
    *   **Key**: `NEXTAUTH_URL`
        *   **Value**: `https://your-project-name.vercel.app` (Your actual Vercel URL)
    *   **Key**: `NEXTAUTH_SECRET`
        *   **Value**: (Copy from your local .env.local file)

5.  **Re-deploy**:
    *   Go to **Deployments**.
    *   Redeploy your latest commit (or push a new commit) to ensure the new environment variables take effect.

---

## Phase 3: Add Keys Locally (Testing)

1.  Open the file `.env.local` in this project.
2.  Update the lines at the bottom:
    ```env
    AUTH_GOOGLE_ID=your-pasted-client-id
    AUTH_GOOGLE_SECRET=your-pasted-client-secret
    ```
3.  Restart your local server (`Ctrl+C` then `npm run dev`).

You are now ready to log in with Google!
