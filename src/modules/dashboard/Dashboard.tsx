import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "Active" | "Closed" | "Blocked";
  checklistId?: string;
  createdAt?: any;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "tasks"), where("ownerUid", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const data: Task[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...(d.data() as any) }));
      setTasks(data);
    });
    return () => unsub();
  }, [uid]);

  const groups = useMemo(
    () => ({
      Active: tasks.filter((t) => t.status === "Active"),
      Blocked: tasks.filter((t) => t.status === "Blocked"),
      Closed: tasks.filter((t) => t.status === "Closed"),
    }),
    [tasks]
  );

  const setStatus = async (id: string, status: Task["status"]) => {
    await updateDoc(doc(db, "tasks", id), { status });
  };

  const Column = ({
    title,
    items,
  }: {
    title: Task["status"];
    items: Task[];
  }) => (
    <div className="flex-1 min-w-0 border rounded-xl p-3 space-y-3">
      <h2 className="font-semibold text-center lg:text-left">
        {title} ({items.length})
      </h2>
      {items.map((t) => (
        <div key={t.id} className="border rounded p-3 break-words">
          <div className="font-medium text-sm md:text-base">{t.title}</div>
          {t.description && (
            <p className="text-xs md:text-sm opacity-80 mt-1">
              {t.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1 md:gap-2">
            {["Active", "Blocked", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(t.id, s as Task["status"])}
                className={`text-xs md:text-sm border rounded px-2 py-1 ${t.status === s ? "bg-black text-white" : "hover:bg-gray-50"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Header />
      <div className="flex flex-col lg:flex-row gap-4">
        <Column title="Active" items={groups.Active} />
        <Column title="Blocked" items={groups.Blocked} />
        <Column title="Closed" items={groups.Closed} />
      </div>
    </div>
  );
}

function Header() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
      <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <a href="/checklists" className="text-sm md:text-base underline">
          Checklist management →
        </a>
        <button
          onClick={handleLogout}
          className="text-xs md:text-sm text-red-600 hover:text-red-800 underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
