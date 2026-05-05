
path = "src/pages/ServicesPage.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Fix line 263 (index 262)
lines[262] = '      const year = String(w.published?.["date-parts"]?.[0]?.[0] || w["published-print"]?.["date-parts"]?.[0]?.[0] || "");\n'

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Fixed!")
