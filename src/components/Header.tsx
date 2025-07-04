import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-dream rounded-full flex items-center justify-center animate-glow">
            <span className="text-white text-xl">🌙</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-dream bg-clip-text text-transparent">
              رویاپرداز
            </h1>
            <p className="text-sm text-muted-foreground">خواب‌ها را به داستان تبدیل کن</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm">
            📚 کتابخانه داستان‌ها
          </Button>
          <Button variant="ghost" size="sm">
            💫 نمونه‌ها
          </Button>
          <Button variant="magic" size="sm">
            🚀 شروع کنید
          </Button>
        </nav>
      </div>
    </header>
  );
}