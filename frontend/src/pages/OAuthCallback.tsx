import { useEffect, useState } from "react";
import { refreshSession } from "../services/auth.service";

type OAuthCallbackProps = {
  onAuthenticated: (accessToken: string) => void;
  onAuthFailed?: () => void;
};

export function OAuthCallback({ onAuthenticated, onAuthFailed }: OAuthCallbackProps) {
  const [status, setStatus] = useState("Finishing sign in...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      setStatus("Google sign in failed. Please try again.");
      onAuthFailed?.();
      return;
    }

    refreshSession()
      .then((response) => {
        onAuthenticated(response.data.accessToken);
      })
      .catch(() => {
        setStatus("Your session could not be restored. Please sign in again.");
        onAuthFailed?.();
      });
  }, [onAuthenticated, onAuthFailed]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-foreground">{status}</h1>
      </div>
    </main>
  );
}
