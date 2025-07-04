
import { AIInsightsForm } from './form';
import { getImageByContextTag } from "@/lib/actions";
import Image from "next/image";

export default async function AIInsightsPage() {
  const heroImage = await getImageByContextTag('ai_insights_hero', 'artificial intelligence data');
  return (
    <>
      <section className="relative py-20 md:py-32 bg-background text-foreground text-center">
        <div className="absolute inset-0">
            <Image
                src={heroImage?.imageUrl || "https://placehold.co/1920x1080.png"}
                alt={heroImage?.altText || "AI powered trading insights"}
                data-ai-hint="artificial intelligence data"
                fill
                className="object-cover opacity-10 dark:opacity-20"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
              AI-Powered Trading Insights
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Harness the power of AI to generate personalized trading strategies and market summaries based on real-time data and your preferences.
            </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <AIInsightsForm />
      </div>
    </>
  );
}
