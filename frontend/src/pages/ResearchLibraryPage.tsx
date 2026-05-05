import { Card } from "../components/Card";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { formatAPA, formatAPAString } from "../apaFormat";

export function ResearchLibraryPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const [showCitation, setShowCitation] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  //  تحميل البيانات
  async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "research"));
    const data: any[] = [];

    querySnapshot.forEach((docu) => {
      data.push({ _id: docu.id, ...docu.data() });
    });

    setItems(data);
    setFiltered(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  //  authors sorted + filtered
  const authors = Array.from(
    new Set(
      items.flatMap((i) =>
        i.authors ? i.authors : i.author ? [i.author] : []
      )
    )
  )
    .sort((a, b) => a.localeCompare(b, "ar"))
    .filter((a) =>
      a.toLowerCase().includes(authorSearch.toLowerCase())
    );

  //  ترتيب السنوات تصاعدي
  const years = Array.from(
    new Set(items.map((i) => i.year))
  ).sort((a, b) => Number(a) - Number(b));

  //  الفلترة
  useEffect(() => {
    let data = [...items];

    if (search.trim() !== "") {
      data = data.filter((item) => {
        const authorsText = item.authors?.join(" ") || item.author || "";

        return (
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          authorsText.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (selectedAuthors.length > 0) {
      data = data.filter((item) => {
        const authorsArr = item.authors || [item.author];
        return authorsArr?.some((a: string) =>
          selectedAuthors.includes(a)
        );
      });
    }

    if (selectedYears.length > 0) {
      data = data.filter((item) =>
        selectedYears.includes(item.year)
      );
    }

    setFiltered(data);
  }, [search, selectedAuthors, selectedYears, items]);

  function toggleAuthor(author: string) {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  }

  function toggleYear(year: string) {
    setSelectedYears((prev) =>
      prev.includes(year)
        ? prev.filter((y) => y !== year)
        : [...prev, year]
    );
  }

  return (
    <div className="min-h-screen flex gap-6 text-fg p-4">

      {/* Sidebar */}
      <div className="w-64 space-y-4 rounded-xl border border-blue-100 bg-white/95 p-4 shadow-md backdrop-blur-sm">

        <h3 className="font-bold text-lg">تصفية النتائج</h3>

        {/* 🔍 البحث */}
        <input
          placeholder="ابحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
        />

        {/* 👤 المؤلف */}
        <div>
          <p className="font-semibold mb-2">المؤلف</p>

          <input
            placeholder="ابحث عن مؤلف..."
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
            className="w-full mb-2 rounded border px-2 py-1 text-sm"
          />

          <div className="max-h-48 overflow-y-auto space-y-2">
            {authors.map((author) => (
              <label key={author} className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedAuthors.includes(author)}
                  onChange={() => toggleAuthor(author)}
                />
                {author}
              </label>
            ))}
          </div>
        </div>

        {/* 📅 السنة */}
        <div>
          <p className="font-semibold mb-2">السنة</p>

          <div className="max-h-32 overflow-y-auto space-y-2">
            {years.map((year) => (
              <label key={year} className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={() => toggleYear(year)}
                />
                {year}
              </label>
            ))}
          </div>
        </div>

        {/* 🔄 Reset */}
        <button
          onClick={() => {
            setSearch("");
            setAuthorSearch("");
            setSelectedAuthors([]);
            setSelectedYears([]);
          }}
          className="text-blue-500 text-sm"
        >
          مسح التصفية
        </button>
      </div>

      {/* المحتوى */}
      <div className="flex-1">
        <h2 className="text-2xl font-extrabold mb-4">
          مكتبة الأبحاث
        </h2>

        {filtered.length === 0 ? (
          <p>لا يوجد نتائج</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {filtered.map((item, idx) => {
              const authorsText =
                item.authors?.join("، ") || item.author;

              return (
                <Card
                  key={item._id}
                  onClick={() => navigate(`/research/${item._id}`)}
                  delay={200 + idx * 100}
                >
                  <h3 className="font-bold text-lg">
                    {item.title}
                  </h3>

                  <p className="text-sm mt-1 text-gray-500">
                    {authorsText} | {item.year}
                  </p>

                  {/*  hover link */}
                  <p className="text-blue-500 mt-3 cursor-pointer hover:underline">
                    عرض التفاصيل
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                      setShowCitation(true);
                    }}
                    className="text-sm text-blue-500 mt-2"
                  >
                    اقتباس
                  </button>
                </Card>
              );
            })}

          </div>
        )}
      </div>

      {/*  Modal */}
      {showCitation && selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] p-6 rounded-xl shadow-2xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">اقتباس</h3>

              <button
                onClick={() => setShowCitation(false)}
                className="text-xl"
              >
                ×
              </button>
            </div>

            {/*  عرض APA صح */}
            <div className="w-full p-3 border rounded bg-gray-50 text-sm leading-7">
              {formatAPA(selectedItem)}
            </div>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  formatAPAString(selectedItem)
                )
              }
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              نسخ التوثيق
            </button>

          </div>
        </div>
      )}

    </div>
  );
}