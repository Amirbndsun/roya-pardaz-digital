import { toast } from "sonner";

export interface GenerateStoryParams {
  dream: string;
  apiKey: string;
}

export interface StoryChapter {
  title: string;
  content: string;
  imagePrompt: string;
}

export interface GeneratedStory {
  title: string;
  chapters: StoryChapter[];
}

export class OpenAIService {
  public apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStory(params: GenerateStoryParams): Promise<GeneratedStory> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${params.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `شما یک نویسنده حرفه‌ای رمان فارسی هستید. باید خواب کاربر را به یک رمان جذاب، هیجان‌انگیز و طولانی تبدیل کنید.

مقدمات:
- رمان باید شامل 6-8 فصل باشد
- هر فصل باید حداقل 300-400 کلمه باشد
- داستان باید کاملاً مرتبط با خواب کاربر باشد
- از عناصر تخیلی، ماجراجویی و هیجان استفاده کنید
- شخصیت‌پردازی عمیق داشته باشد
- پایان رضایت‌بخش داشته باشد

فرمت خروجی باید JSON باشد:
{
  "title": "عنوان داستان",
  "chapters": [
    {
      "title": "عنوان فصل",
      "content": "متن کامل فصل...",
      "imagePrompt": "توصیف تصویر مناسب برای این فصل به انگلیسی"
    }
  ]
}

برای imagePrompt: توصیف کوتاه و واضح صحنه کلیدی فصل به انگلیسی برای تولید تصویر`
            },
            {
              role: 'user',
              content: `لطفاً این خواب را به یک رمان جذاب تبدیل کنید: ${params.dream}`
            }
          ],
          temperature: 0.8,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const storyText = data.choices[0].message.content;
      
      try {
        return JSON.parse(storyText);
      } catch {
        // If JSON parsing fails, create a structured story from the text
        return this.parseTextToStory(storyText, params.dream);
      }
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('خطا در تولید داستان. لطفاً کلید API خود را بررسی کنید.');
      throw error;
    }
  }

  private parseTextToStory(text: string, dream: string): GeneratedStory {
    const chapters: StoryChapter[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentChapter: StoryChapter | null = null;
    
    for (const line of lines) {
      if (line.includes('فصل') || line.includes('**فصل')) {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          title: line.replace(/\*+/g, '').trim(),
          content: '',
          imagePrompt: `Fantasy scene related to: ${dream}`
        };
      } else if (currentChapter && line.trim()) {
        currentChapter.content += line + '\n\n';
      }
    }
    
    if (currentChapter) {
      chapters.push(currentChapter);
    }

    return {
      title: 'داستان رویای شما',
      chapters: chapters.length > 0 ? chapters : [{
        title: 'فصل اول: آغاز سفر',
        content: text,
        imagePrompt: `Fantasy dream scene: ${dream}`
      }]
    };
  }
}