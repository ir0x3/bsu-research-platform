function formatAuthorName(name: string) {
  const parts = name.trim().split(" ");

  if (parts.length === 0) return name;

  const lastName = parts[parts.length - 1];
  const initials = parts
    .slice(0, parts.length - 1)
    .map((p) => p[0] + ".")
    .join(" ");

  return `${lastName}، ${initials}`;
}

//  JSX للعرض
export function formatAPA(item: any) {
  if (!item) return null;

  const authors = item.authors?.length
    ? item.authors.map(formatAuthorName).join("، ")
    : formatAuthorName(item.author || "غير معروف");

  return (
    <span>
      {authors}. ({item.year}). {item.title}.{" "}
      <em>{item.journal}</em>
      {item.issue && <>، {item.issue}</>}
      {item.pages && <>، {item.pages}</>}.{" "}
      {item.link}
    </span>
  );
}

//  string للنسخ
export function formatAPAString(item: any) {
  if (!item) return "";

  const authors = item.authors?.length
    ? item.authors.map(formatAuthorName).join("، ")
    : formatAuthorName(item.author || "غير معروف");

  return `${authors}. (${item.year}). ${item.title}. ${item.journal}${item.issue ? `، ${item.issue}` : ""}${item.pages ? `، ${item.pages}` : ""}. ${item.link}`;
}