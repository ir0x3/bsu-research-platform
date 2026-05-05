import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { exportToExcel } from "../../utils/exportToExel";
import { autoFillFromDOI } from "../../utils/autoFillResearch";

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [link, setLink] = useState("");
  const [year, setYear] = useState("");
  const [abstract, setAbstract] = useState("");

  const [journal, setJournal] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");

  const [items, setItems] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // حماية
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin/login");
    });
    return () => unsub();
  }, []);

  // تحميل
  async function refresh() {
    const snap = await getDocs(collection(db, "research"));
    const data: any[] = [];
    snap.forEach((d) => data.push({ _id: d.id, ...d.data() }));
    setItems(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  // حذف
  async function handleDelete(id: string) {
    if (!window.confirm("هل أنت متأكد؟")) return;
    await deleteDoc(doc(db, "research", id));
    refresh();
  }

  // تعديل
  function handleEdit(item: any) {
    setTitle(item.title);
    setAuthors(
      item.authors?.length
        ? item.authors
        : item.author
        ? [item.author]
        : [""]
    );
    setYear(item.year);
    setLink(item.link);
    setAbstract(item.abstract || "");
    setJournal(item.journal || "");
    setIssue(item.issue || "");
    setPages(item.pages || "");

    setEditId(item._id);
    setShowModal(true);
  }

  // authors
  function addAuthor() {
    setAuthors([...authors, ""]);
  }

  function updateAuthor(i: number, val: string) {
    const arr = [...authors];
    arr[i] = val;
    setAuthors(arr);
  }

  function removeAuthor(i: number) {
    setAuthors(authors.filter((_, index) => index !== i));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold">لوحة الإدارة</h2>

          <button
            onClick={async () => {
              await signOut(auth);
              navigate("/admin/login");
            }}
            className="border px-4 py-2 rounded"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* إضافة */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-3">إضافة بحث</h3>

            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();

                await addDoc(collection(db, "research"), {
                  title,
                  authors: authors.filter((a) => a.trim()),
                  link,
                  year,
                  abstract,
                  journal,
                  issue,
                  pages,
                });

                setTitle("");
                setAuthors([""]);
                setLink("");
                setYear("");
                setAbstract("");
                setJournal("");
                setIssue("");
                setPages("");

                refresh();
              }}
            >

              <input
                placeholder="العنوان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full rounded"
              />

              {/* DOI */}
              <div className="flex gap-2">
                <input
                  placeholder="الرابط أو DOI"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="border p-2 w-full rounded"
                />

                <button
                  type="button"
                  onClick={async () => {
                    const data = await autoFillFromDOI(link);
                    if (!data) return;

                    setTitle(data.title || "");
                    setAuthors(data.authors?.length ? data.authors : [""]);
                    setYear(String(data.year || ""));
                    setJournal(data.journal || "");
                    setIssue(data.issue || "");
                    setPages(data.pages || "");
                    setAbstract(data.abstract || "");
                  }}
                  className="bg-blue-600 text-white px-3 rounded"
                >
                  Auto
                </button>
              </div>

              {/* Authors */}
              {authors.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={a}
                    onChange={(e) => updateAuthor(i, e.target.value)}
                    placeholder={`المؤلف ${i + 1}`}
                    className="border p-2 flex-1 rounded"
                  />

                  {authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(i)}
                      className="text-red-500 text-sm"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addAuthor}
                className="text-blue-500"
              >
                + مؤلف
              </button>

              <input
                placeholder="السنة"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <textarea
                placeholder="المستخلص"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                placeholder="اسم المجلة"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                placeholder="العدد"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                placeholder="الصفحات"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <button className="bg-blue-600 text-white w-full py-2 rounded">
                حفظ
              </button>
            </form>
          </div>

          {/* عرض */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between mb-4">
              <span>الأبحاث ({items.length})</span>

              <button
                onClick={() => exportToExcel(items)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Excel
              </button>
            </div>

            {items.map((item) => (
              <div key={item._id} className="border p-4 rounded-xl mb-4">
                <h3 className="font-bold">{item.title}</h3>

                <p className="mt-2 text-sm text-gray-600">
                  {(item.authors?.join("، ") || "غير معروف")} | {item.year}
                </p>

                <div className="flex gap-3 mt-3">
                  <a href={item.link} target="_blank" className="text-blue-500">
                    فتح
                  </a>

                  <button
                    onClick={() => handleEdit(item)}
                    className="text-yellow-500"
                  >
                    تعديل
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3">
              <h3 className="font-bold">تعديل البحث</h3>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full rounded"
              />

              {authors.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={a}
                    onChange={(e) => updateAuthor(i, e.target.value)}
                    className="border p-2 flex-1 rounded"
                  />

                  {authors.length > 1 && (
                    <button
                      onClick={() => removeAuthor(i)}
                      className="text-red-500 text-sm"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}

              <button onClick={addAuthor} className="text-blue-500">
                + مؤلف
              </button>

              <input value={year} onChange={(e) => setYear(e.target.value)} className="border p-2 w-full rounded" />
              <input value={link} onChange={(e) => setLink(e.target.value)} className="border p-2 w-full rounded" />
              <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} className="border p-2 w-full rounded" />

              <input value={journal} onChange={(e) => setJournal(e.target.value)} className="border p-2 w-full rounded" />
              <input value={issue} onChange={(e) => setIssue(e.target.value)} className="border p-2 w-full rounded" />
              <input value={pages} onChange={(e) => setPages(e.target.value)} className="border p-2 w-full rounded" />

              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await updateDoc(doc(db, "research", editId!), {
                      title,
                      authors: authors.filter((a) => a.trim()),
                      link,
                      year,
                      abstract,
                      journal,
                      issue,
                      pages,
                    });

                    setShowModal(false);
                    refresh();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  حفظ
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}