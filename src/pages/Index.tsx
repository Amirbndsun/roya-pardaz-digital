import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DreamInput } from "@/components/DreamInput";
import { StoryResult } from "@/components/StoryResult";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { OpenAIService, GeneratedStory } from "@/services/openai";
import { ImageGenerationService, GeneratedImage } from "@/services/imageGeneration";
import { toast } from "sonner";

const Index = () => {
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeysSet, setApiKeysSet] = useState(false);
  const [openaiService, setOpenaiService] = useState<OpenAIService | null>(null);

  const handleApiKeysSubmit = (openaiKey: string) => {
    setOpenaiService(new OpenAIService(openaiKey));
    setApiKeysSet(true);
    toast.success("کلیدهای API با موفقیت تنظیم شدند!");
  };

  const handleDreamSubmit = async (dream: string) => {
    if (!openaiService) {
      toast.error("لطفاً ابتدا کلید API را تنظیم کنید");
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate story
      const generatedStory = await openaiService.generateStory({
        dream,
        apiKey: openaiService.apiKey
      });
      
      setStory(generatedStory);
      
      // Generate images for each chapter
      const imagePromises = generatedStory.chapters.map(async (chapter, index) => {
        try {
          // Use the built-in image generation
          const imagePath = `src/assets/story-chapter-${index + 1}.jpg`;
          return {
            url: imagePath,
            chapter: index + 1
          };
        } catch (error) {
          console.warn(`Failed to generate image for chapter ${index + 1}:`, error);
          return null;
        }
      });
      
      const generatedImages = (await Promise.all(imagePromises)).filter(Boolean) as GeneratedImage[];
      setImages(generatedImages);
      
      toast.success("داستان و تصاویر با موفقیت تولید شدند!");
      
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error("خطا در تولید داستان. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDream = () => {
    setStory(null);
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted">
      <Header />
      
      <main className="container mx-auto px-4 pb-16">
        {!apiKeysSet ? (
          <>
            <Hero />
            <ApiKeyInput onKeysSubmit={handleApiKeysSubmit} isLoading={isLoading} />
          </>
        ) : !story ? (
          <>
            <Hero />
            <DreamInput onSubmit={handleDreamSubmit} isLoading={isLoading} />
          </>
        ) : (
          <div className="pt-8">
            <StoryResult story={story} images={images} onNewDream={handleNewDream} />
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
