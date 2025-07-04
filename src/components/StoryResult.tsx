import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import { GeneratedStory } from "@/services/openai";
import { GeneratedImage } from "@/services/imageGeneration";
import { PDFGeneratorService } from "@/services/pdfGenerator";
import { toast } from "sonner";

interface StoryResultProps {
  story: GeneratedStory;
  images: GeneratedImage[];
  onNewDream: () => void;
}

export function StoryResult({ story, images, onNewDream }: StoryResultProps) {
  const pdfService = new PDFGeneratorService();

  const handleDownloadPDF = async () => {
    try {
      await pdfService.generatePDF({ story, images });
      toast.success("فایل PDF با موفقیت دانلود شد!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("خطا در تولید فایل PDF");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl bg-gradient-dream bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            {story.title}
          </CardTitle>
          <p className="text-muted-foreground">
            داستان رویای شما آماده است! هم‌اکنون می‌توانید آن را به صورت PDF دانلود کنید.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleDownloadPDF}
            variant="dream" 
            size="lg"
            className="flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            دانلود کتاب PDF
          </Button>
          <Button 
            onClick={onNewDream}
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            داستان جدید
          </Button>
        </CardContent>
      </Card>

      {/* Story Chapters */}
      <div className="space-y-6">
        {story.chapters.map((chapter, index) => {
          const chapterImage = images.find(img => img.chapter === index + 1);
          
          return (
            <Card key={index} className="backdrop-blur-sm bg-card/80 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary text-right">
                  {chapter.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chapter Image */}
                {chapterImage && (
                  <div className="w-full h-64 bg-gradient-soft rounded-lg overflow-hidden border border-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-2 animate-glow" />
                        <p>تصویر فصل {index + 1}</p>
                        <p className="text-sm opacity-70">در حال بارگذاری...</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Chapter Content */}
                <div className="prose prose-lg max-w-none text-right" dir="rtl">
                  {chapter.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Actions */}
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownloadPDF}
              variant="dream" 
              size="xl"
              className="flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              دانلود کتاب کامل PDF
            </Button>
            <Button 
              onClick={onNewDream}
              variant="magic" 
              size="xl"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              ساخت داستان جدید
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            داستان شما شامل {story.chapters.length} فصل و {images.length} تصویر زیبا است
          </p>
        </CardContent>
      </Card>
    </div>
  );
}