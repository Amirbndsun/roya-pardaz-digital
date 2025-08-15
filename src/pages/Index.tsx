import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DreamInput } from "@/components/DreamInput";
import { StoryResult } from "@/components/StoryResult";
import { generateUniqueStory } from "@/services/storyGenerator";
import { generateStoryImages, GeneratedImage } from "@/services/imageGenerator";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [story, setStory] = useState<string | null>(null);
  const [dreamText, setDreamText] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDreamSubmit = async (dream: string) => {
    setIsLoading(true);
    setDreamText(dream);
    
    try {
      // Generate unique personalized story
      const generatedStory = await generateUniqueStory(dream);
      setStory(generatedStory);
      
      // Show success message
      toast({
        title: "✨ داستان تولید شد",
        description: "داستان منحصر به فرد بر اساس خواب شما آماده است",
      });
      
      // Generate images in background
      try {
        const images = await generateStoryImages(generatedStory, dream);
        setGeneratedImages(images);
        
        if (images.length > 0) {
          toast({
            title: "🎨 تصاویر تولید شد",
            description: `${images.length} تصویر برای داستان شما آماده شد`,
          });
        }
      } catch (imageError) {
        console.error('Error generating images:', imageError);
        toast({
          title: "⚠️ خطا در تولید تصاویر",
          description: "تصاویر در حال بارگذاری هستند...",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "❌ خطا در تولید داستان",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
      
      // Fallback to simple story
      const fallbackStory = `**فصل اول: آغاز سفر رویایی**

در دنیایی پر از رمز و راز، ${dream}

این خواب شما آغاز داستانی شگفت‌انگیز است. در این سرزمین رویایی، هر چیز ممکن است و شما قهرمان این ماجراجویی هستید.

**فصل دوم: کشف جهان درون**

در عمق ضمیر خود سفر می‌کنید و اسرار نهفته در وجودتان را کشف می‌کنید. هر گام، شما را به حقیقت‌های تازه‌ای رهنمون می‌سازد.

**فصل سوم: بازگشت با حکمت**

و سرانجام، با دانش و حکمت جدید به دنیای بیداری بازمی‌گردید. این خواب، پیام مهمی برای زندگی‌تان در بردارد.`;
      
      setStory(fallbackStory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDream = () => {
    setStory(null);
    setDreamText("");
    setGeneratedImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted">
      <Header />
      
      <main className="container mx-auto px-4 pb-16">
        {!story ? (
          <>
            <Hero />
            <DreamInput onSubmit={handleDreamSubmit} isLoading={isLoading} />
          </>
        ) : (
          <div className="pt-8">
            <StoryResult 
              story={story} 
              dreamText={dreamText}
              images={generatedImages}
              onNewDream={handleNewDream} 
            />
          </div>
        )}
      </main>
      
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Index;
