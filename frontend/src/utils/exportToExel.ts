import * as XLSX from "xlsx";

export function exportToExcel(data: any[]) {

  const formatted = data.map((item) => {

    // author's name handeling
    let authors = "";

    if (item.authors && Array.isArray(item.authors)) {
      authors = item.authors
        .filter((a: string) => a?.trim())
        .join("، ");
    }

    if (!authors) {
      authors = item.author || "غير مذكور";
    }

    return {
      "عنوان البحث": item.title || "",
      "اسم الباحث": authors,
      "السنة": item.year || "",
      "الرابط": item.link || "",
      "المستخلص": item.abstract || "",
      "المجلة": item.journal || "",
      "العدد": item.issue || "",
      "الصفحات": item.pages || "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Research");

  XLSX.writeFile(workbook, "research.xlsx");
}