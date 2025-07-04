
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tradingPlans } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";
import Link from "next/link";
import { getImageByContextTag } from "@/lib/actions";
import Image from "next/image";

type PricingData = {
  instrument: string;
  minSpread: string;
  avgSpread: string;
  swapLong: string;
  swapShort: string;
  tradingHours: string;
};

const pricingData: PricingData[] = [
  { instrument: 'EUR/USD', minSpread: '0.1 pips', avgSpread: '0.2 pips', swapLong: '-8.56', swapShort: '+4.52', tradingHours: '24/5' },
  { instrument: 'GBP/USD', minSpread: '0.3 pips', avgSpread: '0.5 pips', swapLong: '-6.21', swapShort: '+2.11', tradingHours: '24/5' },
  { instrument: 'USD/JPY', minSpread: '0.1 pips', avgSpread: '0.3 pips', swapLong: '+15.40', swapShort: '-22.80', tradingHours: '24/5' },
  { instrument: 'Gold (XAU/USD)', minSpread: '1.5 pips', avgSpread: '2.5 pips', swapLong: '-35.10', swapShort: '+15.80', tradingHours: '23/5' },
  { instrument: 'S&P 500', minSpread: '0.4 pts', avgSpread: '0.6 pts', swapLong: '-3.20', swapShort: '-3.80', tradingHours: '23/5' },
  { instrument: 'Bitcoin (BTC)', minSpread: '10.0', avgSpread: '15.0', swapLong: '-0.075%', swapShort: '-0.075%', tradingHours: '24/7' },
  { instrument: 'AAPL', minSpread: '0.02', avgSpread: '0.05', swapLong: 'N/A', swapShort: 'N/A', tradingHours: '16:30-23:00' },
];

export default async function PricingPage() {
  const heroImage = await getImageByContextTag('pricing_page_hero', 'financial charts');
  return (
    <>
      <section className="relative py-20 md:py-32 bg-background text-foreground text-center">
          <div className="absolute inset-0">
              <Image
                  src={heroImage?.imageUrl || "https://placehold.co/1920x1080.png"}
                  alt={heroImage?.altText || "Financial charts and graphs"}
                  data-ai-hint="financial charts"
                  fill
                  className="object-cover opacity-10 dark:opacity-20"
                  priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
                  Transparent Pricing & Plans
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choose the account that's right for you. Competitive spreads, clear swap rates, and no hidden fees.
              </p>
          </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Account Plans Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {tradingPlans.map((plan) => (
              <Card key={plan.id} className={cn(
                "flex flex-col",
                plan.isPopular ? "border-2 border-primary shadow-2xl" : ""
              )}>
                {plan.isPopular && (
                  <Badge className="w-fit self-center -mt-3">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold">{plan.price}</p>
                    <p className="text-muted-foreground mt-1">{plan.priceDescription}</p>
                  </div>
                  <ul className="space-y-4 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-financial-green mr-3 flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-bold" variant={plan.isPopular ? "default" : "outline"}>
                    <Link href="/signup">{plan.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Trading Conditions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Trading Conditions</CardTitle>
            <CardDescription>
              Key details on spreads, swap rates, and trading hours for our most popular instruments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Min. Spread</TableHead>
                    <TableHead>Avg. Spread</TableHead>
                    <TableHead>Swap Long</TableHead>
                    <TableHead>Swap Short</TableHead>
                    <TableHead>Trading Hours (GMT+3)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingData.map((item) => (
                    <TableRow key={item.instrument}>
                      <TableCell className="font-medium">{item.instrument}</TableCell>
                      <TableCell>{item.minSpread}</TableCell>
                      <TableCell>{item.avgSpread}</TableCell>
                      <TableCell className="text-financial-red">{item.swapLong}</TableCell>
                      <TableCell className="text-financial-green">{item.swapShort}</TableCell>
                      <TableCell>{item.tradingHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg text-sm text-muted-foreground flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p><span className="font-semibold">Disclaimer:</span> The values shown are for informational purposes only and may vary. Spreads can widen during volatile market conditions. Swap rates are updated daily.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
