import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyInputProps {
  onKeysSubmit: (openaiKey: string) => void;
  isLoading: boolean;
}

export function ApiKeyInput({ onKeysSubmit, isLoading }: ApiKeyInputProps) {
  const [openaiKey, setOpenaiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openaiKey.trim()) {
      onKeysSubmit(openaiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-card/80 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-dream bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Key className="w-6 h-6" />
          تنظیمات API
        </CardTitle>
        <p className="text-muted-foreground">
          برای تولید داستان‌های هوشمند، کلید API خود را وارد کنید
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="openai-key" className="text-right block">
              کلید OpenAI API
            </Label>
            <div className="relative">
              <Input
                id="openai-key"
                type={showKey ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="text-left"
                dir="ltr"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              کلید API خود را از{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenAI Dashboard
              </a>
              {" "}دریافت کنید
            </p>
          </div>

          <Button 
            type="submit" 
            variant="dream" 
            size="xl" 
            className="w-full animate-float"
            disabled={!openaiKey.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                در حال تولید داستان و تصاویر...
              </div>
            ) : (
              "✨ شروع تولید داستان جادویی"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}