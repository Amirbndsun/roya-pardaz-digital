import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateStoryPDF } from "@/services/pdfGenerator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StoryResultProps {
  story: string;
  onNewDream: () => void;
}

export function StoryResult({ story, onNewDream }: StoryResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  const handleShareStory = () => {
    // This will be implemented with sharing functionality later
    alert("قابلیت اشتراک‌گذاری به‌زودی اضافه خواهد شد!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-dream-star/20 text-primary">
              ✨ داستان جادویی
            </Badge>
          </div>
          <CardTitle className="text-2xl bg-gradient-dream bg-clip-text text-transparent">
            داستان خواب شما
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <div className="bg-gradient-soft p-6 rounded-lg border border-primary/10">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {story}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="dream" 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? "در حال تولید..." : "📄 دانلود PDF"}
            </Button>
            <Button variant="magic" onClick={handleShareStory}>
              🔗 اشتراک‌گذاری
            </Button>
            <Button variant="outline" onClick={onNewDream}>
              🌙 خواب جدید
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Placeholder for generated image */}
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            🎨 تصویر داستان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gradient-soft rounded-lg border border-primary/10 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">🖼️</p>
              <p>تصویر بر اساس داستان شما به‌زودی تولید خواهد شد</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}