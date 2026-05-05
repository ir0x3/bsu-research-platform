import { Card } from "../../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-xl">
      <Card noHover>
        <h2 className="text-xl font-extrabold">تسجيل دخول المدير</h2>
        <p className="mt-1 text-sm text-muted">لوحة الإدارة مخصصة للمصرح لهم فقط.</p>

        <form
          className="mt-5 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              await signInWithEmailAndPassword(auth, email.trim(), password);
              navigate("/admin", { replace: true });
            } catch (err) {
              alert(err instanceof Error ? err.message : "فشل تسجيل الدخول");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="grid gap-1 text-sm">
            <span className="text-muted">البريد الإلكتروني</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-bsu-gold/60"
              placeholder="admin@bsu.edu.eg"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted">كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-bsu-gold/60"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-bsu-blue px-5 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
          </button>

          <Link to="/research" className="text-sm font-semibold text-bsu-blue hover:underline">
            العودة لمكتبة الأبحاث
          </Link>
        </form>
      </Card>
    </div>
  );
}

