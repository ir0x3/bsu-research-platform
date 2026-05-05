import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

type ResearchItem = {
  _id: string;
  title: string;
  authors?: string;
};

export function HomePage() {
  const [search, setSearch] = useState("");
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    async function loadResearch() {
      try {
        const snapshot = await getDocs(collection(db, "research"));
        const items = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            title: String(data.title || "Untitled Research"),
            authors: data.authors ? String(data.authors) : "غير محدد",
          };
        });
        setResearchItems(items);
      } finally {
        setIsLoading(false);
      }
    }

    loadResearch();
  }, []);

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return researchItems
      .filter((item) => item.title.toLowerCase().includes(query))
      .slice(0, 5);
  }, [researchItems, search]);

  const handleSelect = (id: string) => {
    navigate(`/research/${id}`);
  };

  const showEmptyState = !isLoading && search.trim().length > 0 && suggestions.length === 0;

  return (
    <div className="min-h-[calc(100vh-96px)] px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="mx-auto flex max-w-3xl flex-col items-center rounded-xl border border-blue-100 bg-white/95 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-up backdrop-blur-sm"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 animate-fade-in-up-delay-100">
            منصة أبحاث قسم علوم المعلومات - جامعة بني سويف
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl animate-fade-in-up-delay-200">
            اكتشف الأبحاث عبر عنوان البحث
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base animate-fade-in-up-delay-300">
            اكتب عنوان بحث أو كلمة مفتاحية، وسيظهر لك اقتراحات فورية من قاعدة البيانات. انقر على أي اقتراح للانتقال
            إلى صفحة البحث التفصيلية.
          </p>
        </div>

        <div className="relative mt-10 w-full mb-24 animate-fade-in-up-delay-400">
          <label htmlFor="research-search" className="sr-only">
            بحث الأبحاث
          </label>
          <input
            id="research-search"
            value={search}
            onFocus={() => setShowDropdown(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowDropdown(true);
              setActiveIndex(-1);
            }}
            placeholder="ابحث عن عنوان البحث..."
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-base text-slate-900 shadow-sm outline-none transition duration-200 focus:border-bsu-blue focus:ring-2 focus:ring-bsu-blue/20"
          />

          {showDropdown && (search.trim().length > 0 || isLoading) ? (
            <div className="absolute left-0 right-0 mt-2 z-30 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
              {isLoading ? (
                <div className="px-5 py-4 text-sm text-slate-500">تحميل الاقتراحات...</div>
              ) : suggestions.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {suggestions.map((item, index) => (
                    <li
                      key={item._id}
                      className={`cursor-pointer px-5 py-4 transition duration-150 ${
                        activeIndex === index ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      onClick={() => handleSelect(item._id)}
                    >
                      <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.authors}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-5 py-4 text-sm text-slate-500">لا يوجد نتائج مطابقة. حاول تغيير الكلمات.</div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-slate-500 sm:flex-row">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2">
            البحث من قاعدة البيانات مباشرة
          </span>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-16 px-4">
        <div
          className={`mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-md transition duration-700 ease-out ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-2xl font-bold text-slate-900">عن القسم</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
           قسم المكتبات والمعلومات هو أحد الأقسام الأكاديمية المتخصصة في تنظيم وإدارة المعرفة، ويهدف إلى إعداد كوادر قادرة على التعامل مع مصادر المعلومات التقليدية والرقمية بكفاءة، ودعم البحث العلمي من خلال توفير المعلومات الدقيقة وسهولة الوصول إليها.
          </p>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="mt-16 px-4">
        <div
          className={`mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-md transition duration-700 ease-out ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-2xl font-bold text-slate-900">تواصل معنا</h2>
          <p className="mt-2 text-slate-600">
            للتواصل والاستفسارات، يرجى متابعتنا على وسائل التواصل الاجتماعي:
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://www.facebook.com/share/1Nv2wB5rBd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition duration-200 hover:bg-blue-700"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </a>
          <a
            href="https://t.me/artsstudents_ProfRehabYousef"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition duration-200 hover:bg-blue-700"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.5-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.485-1.302.475-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.155.201-.315.529-.465 2.083-.996 3.965-1.869 4.859-2.837.888-.968 1.523-1.92 1.523-2.851 0-.55-.313-1.092-.mid-.363z" />
            </svg>
            Telegram
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}