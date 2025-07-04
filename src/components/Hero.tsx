export function Hero() {
  return (
    <section className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-dream bg-clip-text text-transparent leading-tight">
            رویاهایتان را
            <br />
            به داستان‌های جادویی تبدیل کنید
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" dir="rtl">
            با قدرت هوش مصنوعی، خواب‌های شما را به داستان‌های جذاب و تصاویر زیبا تبدیل می‌کنیم
            و آن‌ها را در قالب PDF برای شما آماده می‌کنیم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-soft border border-primary/10">
            <div className="text-4xl animate-float">🌙</div>
            <h3 className="font-semibold text-primary">خواب را بنویسید</h3>
            <p className="text-sm text-muted-foreground" dir="rtl">
              خواب خود را با جزئیات تعریف کنید
            </p>
          </div>
          
          <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-soft border border-primary/10">
            <div className="text-4xl animate-float" style={{ animationDelay: '1s' }}>✨</div>
            <h3 className="font-semibold text-primary">تبدیل به داستان</h3>
            <p className="text-sm text-muted-foreground" dir="rtl">
              هوش مصنوعی داستان جادویی می‌سازد
            </p>
          </div>
          
          <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-soft border border-primary/10">
            <div className="text-4xl animate-float" style={{ animationDelay: '2s' }}>📚</div>
            <h3 className="font-semibold text-primary">دریافت PDF</h3>
            <p className="text-sm text-muted-foreground" dir="rtl">
              داستان و تصویر را در PDF دانلود کنید
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}