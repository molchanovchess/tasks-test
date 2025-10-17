import { auth, db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type Input = { title: string; checklistId: string };

async function generateTaskDescription(title: string): Promise<string> {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not found, using simple description");
    return `Task: ${title}`;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that creates concise, actionable task descriptions. Keep responses to 1-2 sentences maximum.",
            },
            {
              role: "user",
              content: `Create a brief, actionable description for this task: "${title}"`,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || `Task: ${title}`;
  } catch (error) {
    console.error("AI generation failed:", error);
    return `Task: ${title}`;
  }
}

export async function createTaskWithAIDescription({
  title,
  checklistId,
}: Input) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const description = await generateTaskDescription(title);

  await addDoc(collection(db, "tasks"), {
    ownerUid: uid,
    checklistId,
    title,
    description,
    status: "Active",
    createdAt: serverTimestamp(),
  });
}
