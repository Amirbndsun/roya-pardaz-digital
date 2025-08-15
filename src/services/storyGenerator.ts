// Advanced story generation service with multiple templates and styles

interface StoryTemplate {
  genre: string;
  style: string;
  structure: string[];
  language: string;
}

const storyTemplates: StoryTemplate[] = [
  {
    genre: "Fantasy Adventure",
    style: "پرماجرا و جادویی",
    structure: [
      "شروع سفر در دنیای رمزآلود",
      "ملاقات با موجودات جادویی", 
      "درگیری با چالش‌های غیرمنتظره",
      "کشف قدرت‌های نهفته",
      "نبرد نهایی با شر",
      "بازگشت با حکمت جدید"
    ],
    language: "فانتزی و شاعرانه"
  },
  {
    genre: "Mystery Adventure", 
    style: "مرموز و هیجان‌انگیز",
    structure: [
      "کشف نخستین نشانه راز",
      "پیگیری سرنخ‌های مرموز",
      "ملاقات با شخصیت‌های اسرارآمیز", 
      "حل معماهای پیچیده",
      "رودررویی با حقیقت شگفت‌انگیز",
      "کشف پاسخ نهایی"
    ],
    language: "اسرارآمیز و تشویقی"
  },
  {
    genre: "Romantic Drama",
    style: "عاشقانه و احساسی", 
    structure: [
      "آغاز ماجرای عاشقانه",
      "شکوفایی احساسات عمیق",
      "مواجهه با موانع و چالش‌ها",
      "دوری و اندوه جدایی",
      "تلاش برای یافتن راه بازگشت",
      "پیوند ابدی عشق"
    ],
    language: "شاعرانه و احساسی"
  },
  {
    genre: "Spiritual Journey",
    style: "معنوی و تأملی",
    structure: [
      "بیداری روحانی اولیه",
      "جستجوی معنای زندگی",
      "ملاقات با مرشدان حکیم",
      "عبور از آزمون‌های روحی", 
      "دستیابی به بینش عمیق",
      "بازگشت با نور جدید"
    ],
    language: "حکیمانه و معنوی"
  }
];

const getRandomTemplate = (): StoryTemplate => {
  return storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
};

const generatePersonalizedStory = (dreamText: string, template: StoryTemplate): string => {
  // Extract key elements from dream
  const dreamElements = extractDreamElements(dreamText);
  
  // Generate unique story based on template and dream elements
  const chapters = template.structure.map((chapterTheme, index) => {
    return generateChapter(chapterTheme, dreamElements, index + 1, template);
  });

  return chapters.join('\n\n');
};

const extractDreamElements = (dreamText: string) => {
  // Simple keyword extraction for Persian text
  const keywords = {
    characters: [] as string[],
    objects: [] as string[],
    emotions: [] as string[],
    actions: [] as string[],
    places: [] as string[]
  };

  // Common Persian dream elements
  const dreamMappings = {
    characters: ['مادر', 'پدر', 'دوست', 'غریبه', 'حیوان', 'فرشته', 'شیطان'],
    objects: ['خانه', 'ماشین', 'درخت', 'آب', 'نور', 'کتاب', 'گل'],
    emotions: ['ترس', 'شادی', 'غم', 'عشق', 'نگرانی', 'امید', 'آرامش'],
    actions: ['پرواز', 'دویدن', 'افتادن', 'صحبت', 'دیدن', 'شنیدن'],
    places: ['آسمان', 'زمین', 'دریا', 'کوه', 'جنگل', 'شهر', 'خانه']
  };

  // Extract relevant elements from dream text
  Object.keys(dreamMappings).forEach(category => {
    dreamMappings[category as keyof typeof dreamMappings].forEach(element => {
      if (dreamText.includes(element)) {
        keywords[category as keyof typeof keywords].push(element);
      }
    });
  });

  return {
    ...keywords,
    mainTheme: dreamText.slice(0, 50) + (dreamText.length > 50 ? '...' : ''),
    mood: determineMood(dreamText)
  };
};

const determineMood = (dreamText: string): string => {
  const positiveWords = ['خوشحال', 'شاد', 'زیبا', 'نور', 'آرامش', 'عشق', 'پرواز'];
  const negativeWords = ['ترس', 'تاریک', 'افتادن', 'گریه', 'نگران', 'دویدن'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (dreamText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (dreamText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'مثبت';
  if (negativeCount > positiveCount) return 'منفی';
  return 'خنثی';
};

const generateChapter = (theme: string, elements: any, chapterNum: number, template: StoryTemplate): string => {
  const chapterTitles = [
    `**فصل ${chapterNum}: ${theme}**`,
    `**بخش ${chapterNum}: ${theme}**`,
    `**قسمت ${chapterNum}: ${theme}**`
  ];
  
  const title = chapterTitles[Math.floor(Math.random() * chapterTitles.length)];
  
  // Generate content based on mood and elements
  const content = generateChapterContent(theme, elements, template);
  
  return `${title}\n\n${content}`;
};

const generateChapterContent = (theme: string, elements: any, template: StoryTemplate): string => {
  // Base story content with personalization
  const baseContent = generateBaseStory(theme, elements.mood);
  
  // Inject dream elements naturally
  let personalizedContent = baseContent;
  
  // Add main theme reference
  if (elements.mainTheme) {
    personalizedContent = personalizedContent.replace('[DREAM_REFERENCE]', elements.mainTheme);
  }
  
  // Add character references
  if (elements.characters.length > 0) {
    const character = elements.characters[0];
    personalizedContent += ` در این سفر، ${character} نقش مهمی در داستان شما ایفا می‌کند.`;
  }
  
  // Add object/place references
  if (elements.objects.length > 0 || elements.places.length > 0) {
    const element = elements.objects[0] || elements.places[0];
    personalizedContent += ` ${element} در این بخش از داستان، نماد مهمی محسوب می‌شود.`;
  }
  
  return personalizedContent;
};

const generateBaseStory = (theme: string, mood: string): string => {
  const storyVariations = {
    positive: [
      "نور طلایی صبح بر چهره‌تان می‌تابد و احساس آرامش عمیقی در وجودتان جاری می‌شود.",
      "نسیم ملایم بهاری موهایتان را نوازش می‌کند و قلب‌تان از امید لبریز است.",
      "صدای دلنشین پرندگان صبحگاهی روح‌تان را به شادی فرا می‌خواند."
    ],
    negative: [
      "ابرهای تیره آسمان را پوشانده و احساس نگرانی در دل‌تان جای گرفته است.",
      "سایه‌های مرموز اطراف‌تان حلقه زده و دل‌تان از نگرانی تپیده.",
      "صدای دوری شما را به حالت هوشیاری فرا می‌خواند."
    ],
    neutral: [
      "در فضایی آرام و معتدل قدم برمی‌دارید و به اطراف نگاه می‌کنید.",
      "جهان اطراف‌تان آهسته آهسته شکل می‌گیرد و شما شاهد تحولات آن هستید.",
      "در این لحظه، زمان متوقف شده و شما در حال تجربه چیزی نو هستید."
    ]
  };
  
  const variations = storyVariations[mood as keyof typeof storyVariations] || storyVariations.neutral;
  const baseStory = variations[Math.floor(Math.random() * variations.length)];
  
  // Add theme-specific content
  const themeContent = generateThemeSpecificContent(theme);
  
  return `${baseStory}\n\n${themeContent}\n\n[DREAM_REFERENCE] این عنصر مهم از خواب شما، داستان را به مسیر شگفت‌انگیزی هدایت می‌کند.`;
};

const generateThemeSpecificContent = (theme: string): string => {
  const themeContents = {
    "شروع سفر در دنیای رمزآلود": "درهای طلایی جهان رویا در برابر شما گشوده می‌شود. هر قدم که برمی‌دارید، شگفتی‌های جدیدی را کشف می‌کنید.",
    "ملاقات با موجودات جادویی": "موجوداتی نورانی با چشمان درخشان نزدیک می‌شوند. آن‌ها پیام‌هایی از عالم بالا برای شما به همراه دارند.",
    "کشف نخستین نشانه راز": "نشانه‌ای مرموز جلب توجه‌تان می‌کند. این اولین سرنخ برای کشف راز بزرگی است که در انتظارتان می‌باشد.",
    "آغاز ماجرای عاشقانه": "قلب‌تان با ریتمی تازه می‌تپد. احساسی عمیق و زیبا در وجودتان بیدار می‌شود و جهان رنگ تازه‌ای به خود می‌گیرد.",
    "بیداری روحانی اولیه": "نوری درخشان از اعماق وجودتان طلوع می‌کند. این آغاز سفری معنوی است که تمام هستی‌تان را دگرگون خواهد کرد."
  };
  
  // Find matching content or use default
  for (const [key, content] of Object.entries(themeContents)) {
    if (theme.includes(key) || key.includes(theme)) {
      return content;
    }
  }
  
  return "در این بخش از سفر، تجربه‌ای منحصر به فرد در انتظار شماست که مسیر داستان را برای همیشه تغییر خواهد داد.";
};

export const generateUniqueStory = async (dreamText: string): Promise<string> => {
  try {
    // Select random template for variety
    const template = getRandomTemplate();
    
    // Generate personalized story
    const story = generatePersonalizedStory(dreamText, template);
    
    return story;
    
  } catch (error) {
    console.error('Error generating story:', error);
    // Fallback to simple story
    return generateFallbackStory(dreamText);
  }
};

const generateFallbackStory = (dreamText: string): string => {
  return `**فصل اول: آغاز سفر رویایی**

در دنیایی پر از رمز و راز، ${dreamText}

نور ماه نقره‌ای بر زمین می‌تابید و ستاره‌های درخشان راه را برای شما نشان می‌دهند. این جا، آنجا که خیال و واقعیت در هم می‌آمیزند، داستان شما آغاز می‌شود.

**فصل دوم: کشف جهان درون**

هر قدم که برمی‌دارید، جهان اطراف‌تان تغییر می‌کند و رنگ‌های جدید و شگفت‌انگیزی به خود می‌گیرد. باد ملایمی موهای‌تان را نوازش می‌کند و صدای زمزمه‌وار طبیعت در گوش‌تان پیچیده.

**فصل سوم: پایان سفر و آغاز جدید**

و اینگونه، داستان رویای شما پایان می‌یابد، اما در حقیقت آغاز سفری جدید در زندگی بیداری شماست. سفری که با امید، شادی و ایمان به قدرت‌های درونی‌تان همراه خواهد بود.`;
};