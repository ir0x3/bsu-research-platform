import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export type ResearchItem = {
  _id: string;
  title: string;
  author: string;
  link: string;
};

export async function listResearch() {
  const snapshot = await getDocs(collection(db, "research"));

  const data = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      _id: doc.id,
      title: d.title || "",
      author: d.author || "",
      link: d.link || "",
    };
  });

  return {
    items: data,
    total: data.length,
    totalPages: 1,
  };
}

export async function addResearch(data: {
  title: string;
  author: string;
  link: string;
}) {
  const docRef = await addDoc(collection(db, "research"), data);
  return { _id: docRef.id, ...data };
}