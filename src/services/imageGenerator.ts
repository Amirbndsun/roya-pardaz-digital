// Image generation service for dream stories

export interface GeneratedImage {
  url: string;
  description: string;
  chapterIndex: number;
}

// Simulate image generation (replace with actual AI service later)
export const generateStoryImages = async (story: string, dreamText: string): Promise<GeneratedImage[]> => {
  try {
    // Extract chapters from story
    const chapters = story.split('**').filter(chunk => chunk.trim() && chunk.includes('فصل'));
    
    const images: GeneratedImage[] = [];
    
    for (let i = 0; i < Math.min(chapters.length, 3); i++) {
      const chapter = chapters[i];
      const imagePrompt = generateImagePrompt(chapter, dreamText, i);
      
      // For now, use placeholder images with different themes
      const placeholderImages = [
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800&h=600&fit=crop'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      images.push({
        url: randomImage,
        description: imagePrompt,
        chapterIndex: i
      });
      
      // Add delay to simulate generation time
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return images;
    
  } catch (error) {
    console.error('Error generating images:', error);
    return [];
  }
};

const generateImagePrompt = (chapter: string, dreamText: string, index: number): string => {
  // Extract key visual elements from chapter and dream
  const visualElements = extractVisualElements(chapter + ' ' + dreamText);
  
  const prompts = [
    `منظره رویایی با ${visualElements.setting}، ${visualElements.mood} و ${visualElements.elements}`,
    `صحنه جادویی شامل ${visualElements.characters} در ${visualElements.setting} با حالت ${visualElements.mood}`,
    `تصویری از ${visualElements.actions} در فضایی ${visualElements.setting} با عناصر ${visualElements.elements}`
  ];
  
  return prompts[index % prompts.length];
};

const extractVisualElements = (text: string) => {
  const elements = {
    setting: 'طبیعت زیبا',
    mood: 'آرام و رویایی',
    characters: 'شخصیت اصلی',
    actions: 'حرکت آرام',
    elements: 'نور طلایی'
  };
  
  // Simple keyword matching for Persian text
  if (text.includes('آسمان') || text.includes('ستاره')) elements.setting = 'آسمان شب پرستاره';
  if (text.includes('دریا') || text.includes('آب')) elements.setting = 'کنار دریای آرام';
  if (text.includes('کوه') || text.includes('قله')) elements.setting = 'کوهستان مرتفع';
  if (text.includes('جنگل') || text.includes('درخت')) elements.setting = 'جنگل سبز و انبوه';
  
  if (text.includes('ترس') || text.includes('تاریک')) elements.mood = 'مرموز و نگران‌کننده';
  if (text.includes('شاد') || text.includes('نور')) elements.mood = 'شاد و درخشان';
  if (text.includes('عشق') || text.includes('زیبا')) elements.mood = 'عاشقانه و زیبا';
  
  if (text.includes('پرواز')) elements.actions = 'پرواز در آسمان';
  if (text.includes('دویدن')) elements.actions = 'دویدن سریع';
  if (text.includes('شنا')) elements.actions = 'شنا کردن';
  
  return elements;
};

// Function to generate single image (for future AI integration)
export const generateSingleImage = async (prompt: string): Promise<string | null> => {
  try {
    // Placeholder for AI image generation
    // This would integrate with services like DALL-E, Midjourney, or Stable Diffusion
    console.log('Generating image for prompt:', prompt);
    
    // Return a placeholder for now
    const placeholders = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
    ];
    
    return placeholders[Math.floor(Math.random() * placeholders.length)];
    
  } catch (error) {
    console.error('Error generating single image:', error);
    return null;
  }
};