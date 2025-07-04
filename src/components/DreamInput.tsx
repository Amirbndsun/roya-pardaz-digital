import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isLoading: boolean;
}

export function DreamInput({ onSubmit, isLoading }: DreamInputProps) {
  const [dream, setDream] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim()) {
      onSubmit(dream.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-card/80 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-dream bg-clip-text text-transparent">
          خواب خود را تعریف کنید
        </CardTitle>
        <p className="text-muted-foreground">
          خواب‌تان را با جزئیات بنویسید تا آن را به داستانی جادویی تبدیل کنیم
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="مثلاً: من در خوابم دیدم که در جنگلی پر از درختان رنگارنگ قدم می‌زنم و ناگهان..."
              className="min-h-32 text-right resize-none border-primary/20 focus:border-primary"
              dir="rtl"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            variant="dream" 
            size="xl" 
            className="w-full animate-float"
            disabled={!dream.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                در حال ساخت داستان...
              </div>
            ) : (
              "✨ تبدیل به داستان جادویی"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}