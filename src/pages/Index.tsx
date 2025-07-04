import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DreamInput } from "@/components/DreamInput";
import { StoryResult } from "@/components/StoryResult";

const Index = () => {
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDreamSubmit = async (dream: string) => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock story generation based on the dream
    const generatedStory = `در دنیایی پر از رمز و راز، ${dream}
    
آنجا که نور ماه بر زمین می‌تابید و ستاره‌ها راه را نشان می‌دهند، داستان شما آغاز می‌شود. هر قدم که برمی‌دارید، جهان اطراف‌تان تغییر می‌کند و رنگ‌های جدیدی به خود می‌گیرد.

صدای نسیم ملایم در گوش‌تان پچ‌پچ می‌کند و احساس آرامش عمیقی در وجود‌تان جاری می‌شود. این لحظه‌ای است که همه چیز ممکن به نظر می‌رسد و شما قهرمان داستان خودتان هستید.

در این سفر خیال‌انگیز، شما مرزهای واقعیت را پشت سر می‌گذارید و وارد دنیایی می‌شوید که فقط در خواب‌ها وجود دارد. جایی که قوانین طبیعت معنای دیگری دارند و عشق، امید و زیبایی در هر گوشه‌ای موج می‌زنند.

و اینگونه، خواب شما به داستانی جاودانه تبدیل می‌شود که هر بار که آن را می‌خوانید، حس تازه‌ای از شگفتی و الهام در شما زنده می‌کند.`;
    
    setStory(generatedStory);
    setIsLoading(false);
  };

  const handleNewDream = () => {
    setStory(null);
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
            <StoryResult story={story} onNewDream={handleNewDream} />
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
