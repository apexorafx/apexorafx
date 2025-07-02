// src/ai/flows/generate-trading-insights.ts
'use server';

/**
 * @fileOverview AI-powered trading insights and summaries flow.
 *
 * - generateTradingInsights - A function that generates personalized trading insights.
 * - GenerateTradingInsightsInput - The input type for the generateTradingInsights function.
 * - GenerateTradingInsightsOutput - The return type for the generateTradingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingInsightsInputSchema = z.object({
  marketConditions: z
    .string()
    .describe('The current market conditions and trends.'),
  tradingPreferences: z
    .string()
    .optional()
    .describe('The user\u2019s trading preferences, risk tolerance, and preferred instruments.'),
  pastTrades: z.string().optional().describe('The user past trades, for insight personalization'),
});
export type GenerateTradingInsightsInput = z.infer<
  typeof GenerateTradingInsightsInputSchema
>;

const GenerateTradingInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of potential trading opportunities and risks.'),
  insights: z.array(z.string()).describe('A list of key insights based on market conditions and user preferences.'),
  disclaimer: z
    .string()
    .optional()
    .describe('Important disclaimer to display to the user about AI-generated content.'),
});
export type GenerateTradingInsightsOutput = z.infer<
  typeof GenerateTradingInsightsOutputSchema
>;

export async function generateTradingInsights(
  input: GenerateTradingInsightsInput
): Promise<GenerateTradingInsightsOutput> {
  return generateTradingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingInsightsPrompt',
  input: {schema: GenerateTradingInsightsInputSchema},
  output: {schema: GenerateTradingInsightsOutputSchema},
  prompt: `You are an AI-powered trading insights generator. Your goal is to provide traders with personalized insights and summaries based on current market conditions and their trading preferences.

Market Conditions: {{{marketConditions}}}
Trading Preferences: {{#if tradingPreferences}}{{{tradingPreferences}}}{{else}}No specific preferences provided.{{/if}}
Past Trades: {{#if pastTrades}}{{{pastTrades}}}{{else}}No past trades provided.{{/if}}

Provide a concise summary of potential trading opportunities and risks, and a list of key insights.

Format your output as a JSON object with 'summary' and 'insights' fields. 

Include a disclaimer stating that the insights are AI-generated and not financial advice.
`,
});

const generateTradingInsightsFlow = ai.defineFlow(
  {
    name: 'generateTradingInsightsFlow',
    inputSchema: GenerateTradingInsightsInputSchema,
    outputSchema: GenerateTradingInsightsOutputSchema,
  },
  async input => {
    const {
      output,
    } = await prompt({
      ...input,
    });
    return output!;
  }
);
