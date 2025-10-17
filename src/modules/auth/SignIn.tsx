import { type FormEvent, useState } from "react";
import { auth, googleProvider } from "../../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(undefined);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center">
      <div className="w-full max-w-sm p-6 border rounded-xl">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            aria-label="Password"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            className="w-full border rounded py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <button
          onClick={google}
          className="w-full mt-3 border rounded py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        <p className="text-sm mt-4">
          No account?{" "}
          <Link to="/sign-up" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
