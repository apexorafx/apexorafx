import { AIInsightsForm } from './form';

export default function AIInsightsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
          AI-Powered Trading Insights
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Harness the power of AI to generate personalized trading strategies and market summaries based on real-time data and your preferences.
        </p>
      </div>
      <AIInsightsForm />
    </div>
  );
}
