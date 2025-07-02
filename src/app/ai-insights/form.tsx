"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  generateTradingInsights,
  type GenerateTradingInsightsOutput,
} from "@/ai/flows/generate-trading-insights";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Lightbulb, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const formSchema = z.object({
  marketConditions: z.string().min(20, {
    message: "Please provide more detail on market conditions (at least 20 characters).",
  }),
  tradingPreferences: z.string().optional(),
  pastTrades: z.string().optional(),
});

export function AIInsightsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateTradingInsightsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketConditions: "The US dollar is showing strength against major currencies following recent inflation data. Tech stocks are volatile, and gold prices are consolidating near recent highs.",
      tradingPreferences: "Moderate risk tolerance, interested in short to medium-term trades on major FX pairs and large-cap US stocks.",
      pastTrades: "Successful long on NVDA, small loss on short EUR/USD.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const insights = await generateTradingInsights(values);
      setResult(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate AI insights. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-12">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="font-headline">Insight Generator</CardTitle>
          <CardDescription>Provide details to generate your report.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="marketConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Market Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., The stock market is bullish, crypto is volatile..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tradingPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Trading Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., High-risk, long-term, focus on tech stocks..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastTrades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Trades (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Long on AAPL, short on EUR/JPY..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="font-headline">Your Personalized Report</CardTitle>
            <CardDescription>AI-generated insights will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold">Analyzing the markets...</p>
                <p>Please wait while our AI crunches the numbers.</p>
              </div>
            )}
            {!loading && !result && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                <Bot className="h-16 w-16 mb-4" />
                <p className="text-lg font-semibold">Ready when you are</p>
                <p>Fill out the form to generate your trading report.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h3 className="text-xl font-bold font-headline mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                    Summary
                  </h3>
                  <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">{result.summary}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline mb-2 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                    Key Insights
                  </h3>
                  <ul className="space-y-3">
                    {result.insights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {result.disclaimer && (
                  <div className="mt-6 p-4 bg-amber-500/10 border-l-4 border-accent rounded-r-lg text-sm text-amber-700 dark:text-amber-400 flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                     <div>
                        <p><span className="font-bold">Disclaimer:</span> {result.disclaimer}</p>
                     </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
