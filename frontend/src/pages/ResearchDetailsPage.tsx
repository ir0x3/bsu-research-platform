import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { formatAPA, formatAPAString } from "../apaFormat";

export function ResearchDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const docRef = doc(db, "research", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const current = docSnap.data();
        setData(current);

        //  related
        const all = await getDocs(collection(db, "research"));
        const rel: any[] = [];

        const normalize = (name: string) =>
          name?.trim().toLowerCase();

        const currentAuthors = (current.authors || [current.author || ""])
          .map((a: string) => normalize(a));

        all.forEach((d) => {
          const item = d.data();

          const itemAuthors = (item.authors || [item.author || ""])
            .map((a: string) => normalize(a));

          const hasCommonAuthor = itemAuthors.some((a: string) =>
            currentAuthors.includes(a)
          );

          if (d.id !== id && hasCommonAuthor) {
            rel.push({ _id: d.id, ...item });
          }
        });

        setRelated(rel);
      }
    }

    fetchData();
  }, [id]);

  if (!data)
    return <p className="text-fg p-4">جارٍ التحميل...</p>;

  //  authors
  const authorsText =
    data.authors?.join("، ") || data.author || "غير معروف";

  //  abstract
  let arabic = "";
  let english = "";

  if (data.abstract) {
    const parts = data.abstract.split("\n");
    arabic = parts[0] || "";
    english = parts.slice(1).join(" ");
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/*  رجوع */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 font-medium hover:text-blue-700 transition"
        >
          ← رجوع
        </button>

        {/*  Card */}
        <div className="bg-white/95 border border-blue-100 rounded-xl p-6 shadow">

          {/*  عنوان */}
          <h1 className="text-fg text-2xl font-bold leading-relaxed">
            {data.title}
          </h1>

          {/*  المؤلف */}
          <p className="text-muted mt-2">
            {authorsText} - {data.year}
          </p>

          {/*  فتح البحث */}
          <a
            href={data.link}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block mt-4 transition"
          >
            فتح البحث
          </a>

          {/*  المستخلص */}
          {data.abstract && (
            <div className="mt-6 rounded-xl border p-4">
              <h3 className="text-fg font-bold text-lg mb-3">
                المستخلص
              </h3>

              <p className="leading-8">{arabic}</p>

              <div className="h-4" />

              <p className="leading-8">{english}</p>
            </div>
          )}

          {/*  APA */}
          <div className="mt-6">
            <h3 className="text-fg font-bold text-lg mb-2">
              طريقة التوثيق (APA)
            </h3>

            <div className="bg-white border rounded-xl p-4 text-sm leading-relaxed">
              {formatAPA(data)}
            </div>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  formatAPAString(data) // ✅ الحل هنا
                )
              }
              className="mt-2 text-blue-500 text-sm hover:text-blue-700 transition"
            >
              نسخ التوثيق
            </button>
          </div>

        </div>

        {/*  Related */}
        {related.length > 0 && (
          <div>
            <h3 className="text-fg font-bold mt-6 text-lg">
              أبحاث مشابهة
            </h3>

            <div className="space-y-3 mt-3">
              {related.map((r) => (
                <div
                  key={r._id}
                  className="bg-white border p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition"
                  onClick={() => navigate(`/research/${r._id}`)}
                >
                  <p className="font-medium">{r.title}</p>
                  <p className="text-muted text-sm mt-1">
                    {r.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}