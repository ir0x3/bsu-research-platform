import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function searchResearch(queryText: string) {
  const snapshot = await getDocs(collection(db, "research"));

  const results: any[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (
      data.title?.toLowerCase().includes(queryText.toLowerCase()) ||
      data.author?.toLowerCase().includes(queryText.toLowerCase())
    ) {
      results.push({
        id: doc.id,
        ...data
      });
    }
  });

  return results;
}