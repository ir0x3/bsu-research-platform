import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { formatAPAString } from "../apaFormat";

// ─── Types ────────────────────────────────────────────────────────────────────
type ResearchItem = {
  _id: string;
  title: string;
  authors?: string[];
  author?: string;
  year?: string;
  journal?: string;
  issue?: string;
  pages?: string;
  link?: string;
  abstract?: string;
};

type Tab = "stats" | "doi" | "citation" | "compare" | "guide";
type CitStyle = "APA" | "MLA" | "Chicago" | "Harvard";

// ─── APA helper (free generator) ─────────────────────────────────────────────
function buildAPA(
  authors: string,
  year: string,
  title: string,
  journal: string,
  issue: string,
  pages: string,
  url: string
): string {
  const authorParts = authors
    .split("،")
    .map((a) => {
      const parts = a.trim().split(" ");
      if (parts.length < 2) return a.trim();
      const last = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map((p) => p[0] + ".").join(" ");
      return `${last}، ${initials}`;
    })
    .join("؛ ");
  let ref = `${authorParts}. (${year}). ${title}.`;
  if (journal) ref += ` ${journal}`;
  if (issue) ref += `، ${issue}`;
  if (pages) ref += `، ${pages}`;
  ref += ".";
  if (url) ref += ` ${url}`;
  return ref;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatsTab({ items }: { items: ResearchItem[] }) {
  const total = items.length;
  const authorsSet = new Set(
    items.flatMap((i) => i.authors ?? (i.author ? [i.author] : []))
  );
  const journalsSet = new Set(items.map((i) => i.journal).filter(Boolean));

  // توزيع السنوات
  const yearMap: Record<string, number> = {};
  items.forEach((i) => {
    if (i.year) yearMap[i.year] = (yearMap[i.year] ?? 0) + 1;
  });
  const sortedYears = Object.entries(yearMap).sort((a, b) =>
    Number(a[0]) - Number(b[0])
  );
  const maxCount = Math.max(...sortedYears.map(([, c]) => c), 1);

  // أكثر المؤلفين
  const authorCount: Record<string, number> = {};
  items.forEach((i) => {
    (i.authors ?? (i.author ? [i.author] : [])).forEach((a) => {
      authorCount[a] = (authorCount[a] ?? 0) + 1;
    });
  });
  const topAuthors = Object.entries(authorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* بطاقات الإحصاء */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { label: "إجمالي الأبحاث", value: total, icon: "📄", color: "from-blue-500 to-blue-600" },
          { label: "المؤلفون", value: authorsSet.size, icon: "👤", color: "from-indigo-500 to-indigo-600" },
          { label: "المجلات", value: journalsSet.size, icon: "📰", color: "from-sky-500 to-sky-600" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl bg-gradient-to-br ${s.color} p-5 text-white shadow-lg`}
          >
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-4xl font-extrabold">{s.value}</div>
            <div className="mt-1 text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* مخطط توزيع السنوات */}
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4 text-slate-800">
          📊 توزيع الأبحاث حسب السنة
        </h3>
        <div className="flex items-end gap-2 h-40 overflow-x-auto pb-2">
          {sortedYears.map(([year, count]) => (
            <div key={year} className="flex flex-col items-center gap-1 min-w-[48px]">
              <span className="text-xs font-semibold text-blue-600">{count}</span>
              <div
                className="w-10 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
                style={{ height: `${(count / maxCount) * 100}%`, minHeight: "4px" }}
              />
              <span className="text-xs text-slate-500">{year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* أكثر المؤلفين */}
      {topAuthors.length > 0 && (
        <div className="rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4 text-slate-800">
            🏆 أكثر المؤلفين إنتاجاً
          </h3>
          <div className="space-y-3">
            {topAuthors.map(([author, count], i) => (
              <div key={author} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{author}</span>
                    <span className="text-xs text-slate-500">{count} بحث</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                      style={{ width: `${(count / topAuthors[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function buildMLA(authors: string, title: string, journal: string, issue: string, year: string, pages: string): string {
  const a = authors.split("،")[0]?.trim() || "";
  return `${a}. "${title}." ${journal}${issue ? ", " + issue : ""} (${year})${pages ? ": " + pages : ""}.`;
}

function buildChicago(authors: string, year: string, title: string, journal: string, issue: string, pages: string): string {
  const a = authors.split("،")[0]?.trim() || "";
  return `${a}. "${title}." ${journal} ${issue} (${year})${pages ? ": " + pages : ""}.`;
}

function buildHarvard(authors: string, year: string, title: string, journal: string, issue: string, pages: string): string {
  const a = authors.split("،")[0]?.trim() || "";
  return `${a} (${year}) '${title}', ${journal}, ${issue}${pages ? ", pp. " + pages : ""}.`;
}

function CitationTab() {
  const [style, setStyle] = useState<CitStyle>("APA");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const hasContent = authors.trim() && year.trim() && title.trim();
  const result = style === "APA" ? buildAPA(authors, year, title, journal, issue, pages, url)
    : style === "MLA" ? buildMLA(authors, title, journal, issue, year, pages)
    : style === "Chicago" ? buildChicago(authors, year, title, journal, issue, pages)
    : buildHarvard(authors, year, title, journal, issue, pages);

  function copy() { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  const fields = [
    { label: "المؤلف/المؤلفون (افصل بـ ،)", value: authors, set: setAuthors, required: true },
    { label: "سنة النشر", value: year, set: setYear, required: true },
    { label: "عنوان البحث", value: title, set: setTitle, required: true, wide: true },
    { label: "اسم المجلة", value: journal, set: setJournal, required: false },
    { label: "رقم العدد / المجلد", value: issue, set: setIssue, required: false },
    { label: "أرقام الصفحات", value: pages, set: setPages, required: false },
    { label: "الرابط أو DOI", value: url, set: setUrl, required: false },
  ];

  const styles: CitStyle[] = ["APA", "MLA", "Chicago", "Harvard"];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-1">📝 مولّد التوثيق الأكاديمي</h3>
        <p className="text-sm text-slate-500 mb-4">أدخل بيانات البحث يدوياً وسيُنشأ التوثيق تلقائياً</p>
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs font-semibold text-slate-600 self-center">أسلوب التوثيق:</span>
          {styles.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold border transition ${
                style === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
              }`}>{s}</button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className={(f as any).wide ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              <input value={f.value} onChange={(e) => f.set(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          ))}
        </div>
      </div>
      {hasContent && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block rounded-lg bg-blue-600 text-white text-xs font-bold px-2 py-1">{style}</span>
            <h4 className="text-sm font-bold text-blue-800">التوثيق الناتج:</h4>
          </div>
          <p className="text-sm leading-8 text-slate-700 bg-white rounded-xl p-4 border border-blue-100 font-mono">{result}</p>
          <button onClick={copy} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold transition">
            {copied ? "✅ تم النسخ!" : "📋 نسخ التوثيق"}
          </button>
        </div>
      )}
    </div>
  );
}

function DOITab() {
  const [doi, setDoi] = useState("");
  const [style, setStyle] = useState<CitStyle>("APA");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [meta, setMeta] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const styles: CitStyle[] = ["APA", "MLA", "Chicago", "Harvard"];

  async function fetchDOI() {
    const cleaned = doi.trim().replace(/^https?:\/\/doi\.org\//, "");
    if (!cleaned) return;
    setLoading(true); setError(""); setResult(""); setMeta(null);
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleaned)}`);
      if (!res.ok) throw new Error("DOI غير موجود أو غير صحيح");
      const data = await res.json();
      const w = data.message;
      const authors = (w.author || []).map((a: any) => `${a.family || ""}، ${(a.given || "")[0] || ""}.`).join("؛ ");
      const year = String(w.published?.["date-parts"]?.[0]?.[0] || w["published-print"]?.["date-parts"]?.[0]?.[0] || "");
      const title = (w.title || [""])[0];
      const journal = (w["container-title"] || [""])[0];
      const vol = w.volume || "";
      const issue2 = w.issue || "";
      const issueStr = vol ? `${vol}(${issue2})` : issue2;
      const pages = w.page || "";
      const doiUrl = `https://doi.org/${cleaned}`;
      setMeta({ authors, year, title, journal, issueStr, pages, doiUrl });
      const citation =
        style === "APA" ? buildAPA(authors, year, title, journal, issueStr, pages, doiUrl)
        : style === "MLA" ? buildMLA(authors, title, journal, issueStr, year, pages)
        : style === "Chicago" ? buildChicago(authors, year, title, journal, issueStr, pages)
        : buildHarvard(authors, year, title, journal, issueStr, pages);
      setResult(citation);
    } catch (e: any) {
      setError(e.message || "حدث خطأ أثناء الجلب");
    } finally { setLoading(false); }
  }

  function updateStyle(s: CitStyle) {
    setStyle(s);
    if (meta) {
      const c = s === "APA" ? buildAPA(meta.authors, meta.year, meta.title, meta.journal, meta.issueStr, meta.pages, meta.doiUrl)
        : s === "MLA" ? buildMLA(meta.authors, meta.title, meta.journal, meta.issueStr, meta.year, meta.pages)
        : s === "Chicago" ? buildChicago(meta.authors, meta.year, meta.title, meta.journal, meta.issueStr, meta.pages)
        : buildHarvard(meta.authors, meta.year, meta.title, meta.journal, meta.issueStr, meta.pages);
      setResult(c);
    }
  }

  function copy() { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-1">🔗 استخراج التوثيق عبر DOI</h3>
        <p className="text-sm text-slate-500 mb-5">أدخل رقم DOI للبحث وسيتم استخراج بياناته وتوثيقه تلقائياً</p>
        <div className="flex gap-2 mb-5">
          <input value={doi} onChange={e => setDoi(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchDOI()}
            placeholder="مثال: 10.1016/j.ipm.2021.102762"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          <button onClick={fetchDOI} disabled={loading || !doi.trim()}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 text-sm font-semibold transition flex items-center gap-2">
            {loading ? <span className="animate-spin">⏳</span> : "🔍"} {loading ? "جارٍ الجلب..." : "استخراج"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-600 self-center">أسلوب التوثيق:</span>
          {styles.map(s => (
            <button key={s} onClick={() => updateStyle(s)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold border transition ${
                style === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3">
          <span className="text-xl">⚠️</span> {error}
        </div>
      )}

      {meta && (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-md space-y-3">
          <h4 className="text-sm font-bold text-slate-700">📋 بيانات البحث المستخرجة:</h4>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              { l: "العنوان", v: meta.title },
              { l: "المؤلفون", v: meta.authors },
              { l: "السنة", v: meta.year },
              { l: "المجلة", v: meta.journal },
              { l: "المجلد/العدد", v: meta.issueStr },
              { l: "الصفحات", v: meta.pages },
            ].filter(x => x.v).map(x => (
              <div key={x.l} className="rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 mb-1">{x.l}</div>
                <div className="text-slate-800">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block rounded-lg bg-blue-600 text-white text-xs font-bold px-2 py-1">{style}</span>
            <h4 className="text-sm font-bold text-blue-800">التوثيق الناتج:</h4>
          </div>
          <p className="text-sm leading-8 text-slate-700 bg-white rounded-xl p-4 border border-blue-100 font-mono">{result}</p>
          <button onClick={copy} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold transition">
            {copied ? "✅ تم النسخ!" : "📋 نسخ التوثيق"}
          </button>
        </div>
      )}
    </div>
  );
}

function CompareTab({ items }: { items: ResearchItem[] }) {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");

  const r1 = items.find((i) => i._id === id1);
  const r2 = items.find((i) => i._id === id2);

  const fields: Array<{ label: string; key: keyof ResearchItem }> = [
    { label: "العنوان", key: "title" },
    { label: "المؤلف/المؤلفون", key: "authors" },
    { label: "السنة", key: "year" },
    { label: "المجلة", key: "journal" },
    { label: "العدد", key: "issue" },
    { label: "الصفحات", key: "pages" },
  ];

  function getVal(r: ResearchItem, key: keyof ResearchItem): string {
    if (key === "authors") {
      return (r.authors?.join("، ") || r.author) ?? "—";
    }
    return String(r[key] ?? "—");
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-1">🔍 مقارنة بحثين</h3>
        <p className="text-sm text-slate-500 mb-5">
          اختر بحثين من قاعدة البيانات لمقارنتهما جنباً إلى جنب
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "البحث الأول", val: id1, set: setId1 },
            { label: "البحث الثاني", val: id2, set: setId2 },
          ].map((s) => (
            <div key={s.label}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{s.label}</label>
              <select
                value={s.val}
                onChange={(e) => s.set(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">— اختر بحثاً —</option>
                {items.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.title}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {r1 && r2 && (
        <div className="rounded-2xl border border-blue-100 bg-white/95 shadow-md overflow-hidden">
          <div className="grid grid-cols-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold">
            <div className="p-3 text-center border-l border-blue-400">الحقل</div>
            <div className="p-3 text-center border-l border-blue-400 truncate">{r1.title?.slice(0, 30)}...</div>
            <div className="p-3 text-center truncate">{r2.title?.slice(0, 30)}...</div>
          </div>
          {fields.map(({ label, key }, i) => (
            <div
              key={key}
              className={`grid grid-cols-3 text-sm border-t border-slate-100 ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
            >
              <div className="p-3 font-semibold text-slate-600 border-l border-slate-100">{label}</div>
              <div className="p-3 text-slate-700 border-l border-slate-100">{getVal(r1, key)}</div>
              <div className="p-3 text-slate-700">{getVal(r2, key)}</div>
            </div>
          ))}
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">التوثيق APA</p>
            <p className="text-xs text-slate-600 leading-6 bg-white rounded-lg p-3 border">{formatAPAString(r1)}</p>
            <p className="text-xs text-slate-600 leading-6 bg-white rounded-lg p-3 border">{formatAPAString(r2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GuideTab() {
  const sections = [
    {
      title: "📖 المقال العلمي في مجلة محكّمة",
      color: "border-blue-400",
      format: "اسم العائلة، الأحرف الأولى. (السنة). عنوان المقال. اسم المجلة، المجلد(العدد)، الصفحات. الرابط",
      example: "تمام، ي. م.. (2020). المداخل النظرية في دراسة القيادة التنظيمية. مجلة كلية الآداب، ع57، 141-174. https://search.mandumah.com/Record/1208430",
    },
    {
      title: "📘 كتاب كامل",
      color: "border-indigo-400",
      format: "اسم العائلة، الأحرف الأولى. (السنة). عنوان الكتاب. دار النشر.",
      example: "الهاشمي، ع. ر.. (2018). علم المكتبات والمعلومات في عصر الرقمنة. دار اليازوري العلمية.",
    },
    {
      title: "🌐 صفحة ويب",
      color: "border-sky-400",
      format: "اسم العائلة، الأحرف الأولى. (السنة، اليوم الشهر). عنوان الصفحة. اسم الموقع. الرابط",
      example: "وزارة التعليم العالي. (2023، 15 مارس). إحصاءات التعليم الجامعي. بوابة التعليم العالي. https://mohe.gov.eg",
    },
    {
      title: "🎓 رسالة ماجستير أو دكتوراه",
      color: "border-violet-400",
      format: "اسم العائلة، الأحرف الأولى. (السنة). عنوان الرسالة [نوع الرسالة، اسم الجامعة].",
      example: "محمد، س. أ.. (2022). تطوير خدمات المكتبات الجامعية في ضوء معايير الجودة [رسالة ماجستير، جامعة بني سويف].",
    },
    {
      title: "📑 فصل في كتاب محرَّر",
      color: "border-teal-400",
      format: "اسم العائلة، الأحرف الأولى. (السنة). عنوان الفصل. في الأحرف الأولى. اسم المحرر (محرر)، عنوان الكتاب (ص. من–إلى). دار النشر.",
      example: "حسن، م. م.. (2021). الأرشفة الرقمية. في أ. ر. الهاشمي (محرر)، قضايا المكتبات الرقمية (ص. 45-78). دار الفكر.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-1">📚 دليل التوثيق الأكاديمي APA 7</h3>
        <p className="text-sm text-slate-500">
          مرجع سريع لأبرز أنواع المصادر وفق النظام الأمريكي للمراجع (APA) الإصدار السابع
        </p>
      </div>

      {sections.map((s, i) => (
        <div
          key={i}
          className={`rounded-2xl border-r-4 ${s.color} border border-slate-100 bg-white/95 shadow-sm overflow-hidden`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-right"
          >
            <span className="font-semibold text-slate-800 text-sm">{s.title}</span>
            <span className="text-slate-400 text-lg">{open === i ? "▲" : "▼"}</span>
          </button>
          {open === i && (
            <div className="px-5 pb-5 space-y-3 border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">الصيغة العامة</p>
                <p className="text-sm text-slate-600 leading-7 bg-slate-50 rounded-lg p-3 font-mono">{s.format}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">مثال تطبيقي</p>
                <p className="text-sm text-blue-700 leading-7 bg-blue-50 rounded-lg p-3">{s.example}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 leading-7">
        <strong>📌 قواعد عامة مهمة:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>يُرتَّب الاسم: اسم العائلة أولاً، ثم الأحرف الأولى من الاسم</li>
          <li>السنة تُوضع بين قوسين مباشرة بعد اسم المؤلف</li>
          <li>عنوان المجلة يُكتب بخط مائل (italic)</li>
          <li>عنوان المقال لا يُكتب بخط مائل</li>
          <li>يُضاف الرابط DOI أو URL في نهاية التوثيق</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [items, setItems] = useState<ResearchItem[]>([]);

  useEffect(() => {
    getDocs(collection(db, "research")).then((snap) => {
      setItems(snap.docs.map((d) => ({ _id: d.id, ...d.data() } as ResearchItem)));
    });
  }, []);

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: "stats", label: "إحصائيات المنصة", icon: "📊" },
    { id: "doi", label: "استخراج عبر DOI", icon: "🔗" },
    { id: "citation", label: "مولّد التوثيق", icon: "📝" },
    { id: "compare", label: "مقارنة الأبحاث", icon: "🔍" },
    { id: "guide", label: "دليل التوثيق", icon: "📚" },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          الخدمات الإضافية
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          أدوات بحثية متكاملة لدعم الباحثين وطلاب قسم المكتبات والمعلومات
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up-delay-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === t.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white/95 text-slate-600 border border-blue-100 hover:border-blue-300 hover:text-blue-600 shadow-sm"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "stats" && <StatsTab items={items} />}
        {activeTab === "doi" && <DOITab />}
        {activeTab === "citation" && <CitationTab />}
        {activeTab === "compare" && <CompareTab items={items} />}
        {activeTab === "guide" && <GuideTab />}
      </div>
    </div>
  );
}
