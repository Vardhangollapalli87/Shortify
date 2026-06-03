import { startGoogleOAuth } from "../../services/auth.service";

export function ContinueWithGoogleButton() {
  return (
    <button
      type="button"
      onClick={startGoogleOAuth}
      className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Continue with Google
    </button>
  );
}
