import { type ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

export function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/sign-in");
      else setReady(true);
    });
  }, [navigate]);

  if (!ready) return <div className="p-6">Loading…</div>;
  return <>{children}</>;
}
