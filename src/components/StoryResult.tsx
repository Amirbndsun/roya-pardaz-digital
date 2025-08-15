import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateStoryPDF } from "@/services/pdfGenerator";
import { shareStory } from "@/services/shareService";
import { GeneratedImage } from "@/services/imageGenerator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StoryResultProps {
  story: string;
  dreamText: string;
  images: GeneratedImage[];
  onNewDream: () => void;
}

export function StoryResult({ story, dreamText, images, onNewDream }: StoryResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const result = await generateStoryPDF(story, "داستان خواب شما");
      
      if (result.success) {
        toast({
          title: "✅ PDF با موفقیت تولید شد",
          description: `فایل ${result.filename} دانلود شد`,
        });
      } else {
        toast({
          title: "❌ خطا در تولید PDF",
          description: result.error || "لطفاً دوباره تلاش کنید",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ خطا در تولید PDF",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareStory = async () => {
    setIsSharing(true);
    
    try {
      const success = await shareStory(story, "داستان خواب من");
      
      if (success) {
        toast({
          title: "✅ داستان اشتراک‌گذاری شد",
          description: "داستان شما با موفقیت کپی یا اشتراک‌گذاری شد",
        });
      } else {
        toast({
          title: "❌ خطا در اشتراک‌گذاری",
          description: "لطفاً دوباره تلاش کنید",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ خطا در اشتراک‌گذاری",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Story Content */}
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20 shadow-lg">
        <CardHeader className="text-center border-b border-primary/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-gradient-dream text-white px-4 py-2">
              ✨ داستان جادویی شما
            </Badge>
          </div>
          <CardTitle className="text-3xl bg-gradient-dream bg-clip-text text-transparent font-bold">
            داستان خواب شما
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            براساس خواب: <span className="text-primary font-medium">"{dreamText}"</span>
          </p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="prose prose-lg max-w-none text-right leading-loose">
            <div className="bg-gradient-to-br from-card via-secondary/5 to-muted/10 p-8 rounded-xl border border-primary/10 shadow-inner">
              <div className="text-foreground text-lg leading-relaxed whitespace-pre-line font-medium">
                {story.split('\n\n').map((paragraph, index) => {
                  if (paragraph.includes('**')) {
                    // Chapter title
                    const title = paragraph.replace(/\*\*/g, '');
                    return (
                      <h2 key={index} className="text-2xl font-bold text-primary mb-6 mt-8 first:mt-0 border-r-4 border-accent pr-4">
                        {title}
                      </h2>
                    );
                  } else if (paragraph.trim()) {
                    // Regular paragraph
                    return (
                      <p key={index} className="mb-6 text-justify leading-loose text-foreground/90">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-primary/10">
            <Button 
              variant="dream" 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="min-w-40"
            >
              {isGeneratingPDF ? "در حال تولید PDF..." : "📄 دانلود PDF"}
            </Button>
            <Button 
              variant="magic" 
              onClick={handleShareStory}
              disabled={isSharing}
              className="min-w-40"
            >
              {isSharing ? "در حال اشتراک..." : "🔗 اشتراک‌گذاری"}
            </Button>
            <Button variant="outline" onClick={onNewDream} className="min-w-40">
              🌙 خواب جدید
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Generated Images Section */}
      {images && images.length > 0 && (
        <Card className="backdrop-blur-sm bg-card/80 border-primary/20 shadow-lg">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              🎨 تصاویر داستان شما
            </CardTitle>
            <p className="text-center text-muted-foreground">
              تصاویر تولید شده بر اساس داستان شما
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-video rounded-lg overflow-hidden border border-primary/20 shadow-md group-hover:shadow-lg transition-shadow">
                    <img 
                      src={image.url} 
                      alt={image.description}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      فصل {image.chapterIndex + 1}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Image Generation Placeholder */}
      {(!images || images.length === 0) && (
        <Card className="backdrop-blur-sm bg-card/80 border-primary/20 shadow-lg">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
              🎨 تصاویر داستان
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="aspect-video bg-gradient-soft rounded-xl border border-primary/10 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-4">🖼️</div>
                <p className="text-lg mb-2">تولید تصاویر در حال انجام...</p>
                <p className="text-sm">تصاویر زیبا بر اساس داستان شما به‌زودی آماده خواهد شد</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}