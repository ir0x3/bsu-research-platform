type ResearchData = {
    title?: string;
    authors?: string[];
    year?: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    abstract?: string;
  };
  
  export async function autoFillFromDOI(link: string): Promise<ResearchData | null> {
    try {
      // 🔍 استخراج DOI لو المستخدم حط رابط كامل
      const doiMatch = link.match(/10.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
      const doi = doiMatch ? doiMatch[0] : link;
  
      if (!doi) {
        alert("❌ الرابط غير صالح");
        return null;
      }
  
      // 🔥 API CrossRef
      const res = await fetch(`https://api.crossref.org/works/${doi}`);
      const json = await res.json();
  
      const item = json.message;
  
      return {
        title: item.title?.[0] || "",
        authors:
          item.author?.map(
            (a: any) => `${a.given || ""} ${a.family || ""}`.trim()
          ) || [],
        year: item.issued?.["date-parts"]?.[0]?.[0]?.toString() || "",
        journal: item["container-title"]?.[0] || "",
        volume: item.volume || "",
        issue: item.issue || "",
        pages: item.page || "",
        abstract: item.abstract
          ? item.abstract.replace(/<[^>]+>/g, "") // إزالة HTML
          : "",
      };
    } catch {
      alert("❌ فشل في جلب البيانات (تأكد من DOI)");
      return null;
    }
  }