import { Link } from "react-router-dom";

const features = [
  "بحث مباشر ومتجاوب عن طريق عنوان البحث",
  "عرض مقتطفات سريعة وأسماء المؤلفين وسنة النشر",
  "روابط مباشرة إلى صفحة تفاصيل البحث",
  "تصميم متجاوب يعمل على الأجهزة المختلفة"
];

export function AboutPlatformPage() {
  return (
    <div className="min-h-screen space-y-10 p-8">
      <section className="rounded-xl border border-blue-100 bg-white/95 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-up backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-bsu-blue/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-bsu-blue animate-fade-in-up-delay-100">
            نبذة عن المنصة
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-slate-950 sm:text-4xl animate-fade-in-up-delay-200">
            منصة أبحاث علوم المعلومات - جامعة بني سويف
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg animate-fade-in-up-delay-300">
            منصة أكاديمية مصممة لدعم طلاب قسم علوم المعلومات بكلية الآداب في جامعة بني سويف. تهدف المنصة إلى تنظيم
            وعرض الأبحاث العلمية بطريقة مبسطة، مع توفير بحث سريع في العناوين وروابط مباشرة لصفحات التفاصيل.
            المنصة تضع الوضوح وسهولة الاستخدام في المقدمة.
          </p>
        </div>
      </section>

      <section
        className="grid gap-6 xl:grid-cols-2 animate-fade-in-up-delay-200"
      >
        <article className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">ما الهدف؟</div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">مساعدة الباحثين والطلاب</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            توفر المنصة نقطة وصول موحدة لأبحاث العلوم المعلوماتية، تساعد المستخدمين على العثور على الأبحاث المناسبة
            بسرعة وبدون تعقيد. يتم عرض المحتوى بشكل واضح مع إمكانية الانتقال سريعاً إلى المعلومات التفصيلية.
          </p>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">الميزات الأساسية</div>
          <ul className="mt-4 space-y-3 text-slate-600">
            {features.map((feature, idx) => (
              <li key={feature} style={{animation: `fadeInUp 600ms ease-out forwards`, animationDelay: `${300 + idx * 100}ms`, opacity: 0}} className="rounded-3xl border border-slate-200 bg-white/95 px-4 py-3 text-sm transition duration-200 hover:bg-white hover:shadow-sm backdrop-blur-sm">
                {feature}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section
        className="grid gap-6 lg:grid-cols-3 animate-fade-in-up-delay-300"
      >
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-slate-900">منصة أكاديمية احترافية</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            تهدف المنصة إلى أن تكون حلاً سهلاً وموثوقاً للطلاب والباحثين، مع التركيز على تجربة مستخدم سلسة ومعلومات دقيقة.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-slate-900">بحث سريع ومتجاوب</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            يمكن للمستخدم البحث في العناوين وعرض اقتراحات فورية. يتم تحديث النتائج بصورة ذكية ومباشرة أثناء الكتابة.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-slate-900">محتوى آمن وقابل للتطوير</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            تعتمد المنصة على بنية بيانات بسيطة في Firestore، مما يجعل الإدارة والتوسيع في المستقبل أمرًا سلسًا.
          </p>
        </div>
      </section>

      <section
        className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/40 animate-fade-in-up-delay-400 backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">كيف تعمل المنصة؟</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              تبدأ تجربة المستخدم هنا عبر صفحة البحث. يتم عرض اقتراحات للأبحاث بناءً على العنوان، ويمكن النقر على كل
              بحث للانتقال إلى صفحة التفاصيل التي تحتوي على معلومات كاملة حول البحث.
            </p>
          </div>
          <Link
            to="/library"
            className="inline-flex items-center justify-center rounded-3xl bg-bsu-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-bsu-blue/10 transition duration-300 hover:-translate-y-0.5 hover:bg-bsu-blue/90"
          >
            استكشف الأبحاث
          </Link>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-sm lg:grid-cols-2 animate-fade-in-up-delay-500 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">عن قسم علوم المعلومات</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            قسم علوم المعلومات بكلية الآداب جامعة بني سويف هو قسم أكاديمي يهتم بإعداد طلاب مختصين في علوم المكتبات والمعلومات
            والتنظيم المعرفي. المنصة تدعم هذه الرؤية من خلال تقديم وسيلة للوصول إلى الأبحاث الأكاديمية بسهولة.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">رؤيتنا</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            نؤمن بأن الوصول السريع والمنظم إلى الأبحاث العلمية يعزز جودة التعلم ويعطي الطلاب والباحثين فرصة أكبر للتميز.
            لذلك صُممت هذه المنصة لتكون نقطة انطلاق موثوقة للبحث العلمي في القسم.
          </p>
        </div>
      </section>
    </div>
  );
}
