import { type FormEvent, useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { createTaskWithAIDescription } from "../tasks/createTaskWithAI";

type Checklist = {
  id: string;
  title: string;
  ownerUid: string;
  createdAt?: any;
};

export default function Checklists() {
  const uid = auth.currentUser?.uid!;
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "checklists"),
      where("ownerUid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr: Checklist[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
      setItems(arr);
    });

    return () => unsub();
  }, [uid]);

  const addChecklist = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "checklists"), {
        title,
        ownerUid: uid,
        createdAt: serverTimestamp(),
      });
      setTitle("");
    } catch (error) {
      console.error("Error adding checklist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">
          Checklist management
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <a href="/" className="text-sm md:text-base underline">
            ← Back to Dashboard
          </a>
          <button
            onClick={handleLogout}
            className="text-xs md:text-sm text-red-600 hover:text-red-800 underline"
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={addChecklist} className="flex flex-col sm:flex-row gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm md:text-base"
          placeholder="Checklist title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
          minLength={1}
          maxLength={100}
          aria-label="Checklist title"
        />
        <button
          className="border rounded px-4 py-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          disabled={loading || !title.trim()}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((c) => (
          <ChecklistCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}

function ChecklistCard({ c }: { c: Checklist }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setLoading(true);
    try {
      await createTaskWithAIDescription({
        title: taskTitle,
        checklistId: c.id,
      });
      setTaskTitle("");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border rounded-xl p-3 md:p-4 break-words">
      <h2 className="font-semibold text-sm md:text-base">{c.title}</h2>
      <form onSubmit={addTask} className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          className="border rounded px-3 py-2 flex-1 text-sm md:text-base"
          placeholder="New task…"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
          maxLength={200}
        />
        <button
          disabled={loading || !taskTitle.trim()}
          className="border rounded px-4 py-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Creating…" : "Add task"}
        </button>
      </form>
    </div>
  );
}
