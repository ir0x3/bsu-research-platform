export async function generateGeminiResponse(prompt: string, history: {role: string, parts: {text: string}[]}[] = []) {
  const API_KEY = "";
  
  const modelConfigs = [
    { model: "gemini-2.0-flash-lite", version: "v1" },
    { model: "gemini-2.0-flash-lite-001", version: "v1" },
    { model: "gemini-2.5-flash-lite", version: "v1" },
    { model: "gemini-2.0-flash", version: "v1" },
    { model: "gemini-2.5-flash", version: "v1" },
    { model: "gemini-flash-lite-latest", version: "v1beta" },
    { model: "gemini-flash-latest", version: "v1beta" }
  ];

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `أنت مساعد بحثي أكاديمي ذكي لمنصة "أبحاث قسم علوم المعلومات" (BSU Research Platform). 
تخصصك: علم المكتبات، تنظيم المعلومات، التوثيق الأكاديمي (APA/MLA)، الأرشفة الرقمية، قواعد البيانات البحثية.
عليك مساعدة الطلاب والباحثين في أسئلتهم الأكاديمية والبحثية وكيفية استخدام أدوات البحث. 
أجب دائماً باللغة العربية بأسلوب أكاديمي احترافي ولكن مبسط، ومختصر قدر الإمكان.
إذا سئلت عن من أنت، قل أنك "المساعد الأكاديمي الذكي لمنصة أبحاث قسم علوم المعلومات".
تأكد من أن جميع إجاباتك تتبع قواعد اللغة العربية الصحيحة وتدعم اتجاه النص من اليمين إلى اليسار.` }]
      },
      {
        role: "model",
        parts: [{ text: "فهمت، أنا المساعد الأكاديمي الذكي لمنصة أبحاث قسم علوم المعلومات. كيف يمكنني مساعدتك اليوم؟" }]
      },
      ...history,
      { role: "user", parts: [{ text: prompt }] }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  for (const { model, version } of modelConfigs) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`;
      console.log(`Trying ${version}/${model}...`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Success with ${version}/${model}!`);
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من تكوين إجابة حالياً.";
      }

      const err = await response.json();
      console.error(`Gemini API Error (${version}/${model}, status ${response.status}):`, JSON.stringify(err, null, 2));
      
      if (response.status === 429 || response.status === 404) {
        continue;
      }
    } catch (error: any) {
      console.error(`Gemini call failed (${version}/${model}):`, error);
    }
  }

  return `عذراً، نموذج الذكاء الاصطناعي غير متوفر حالياً. يرجى مراجعة إعدادات المنصة.`;
}