
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMarketData, getMarketTabs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getImageByContextTag } from "@/lib/actions";
import Image from "next/image";

export default async function MarketsPage() {
  const marketData = getMarketData();
  const marketTabs = getMarketTabs();
  const heroImage = await getImageByContextTag('markets_page_hero', 'stock market display');

  return (
    <>
      <section className="relative py-20 md:py-32 bg-background text-foreground text-center">
        <div className="absolute inset-0">
            <Image
                src={heroImage?.imageUrl || "https://placehold.co/1920x1080.png"}
                alt={heroImage?.altText || "Global stock market display"}
                data-ai-hint="stock market display"
                fill
                className="object-cover opacity-10 dark:opacity-20"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
            Global Markets Overview
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real-time data from financial markets around the world.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="mt-12">
          <CardContent className="p-0">
            <Tabs defaultValue="forex" className="w-full">
              <div className="border-b">
                <TabsList className="p-2 h-auto flex-wrap justify-start">
                  {marketTabs.map(tab => {
                      const Icon = tab.icon;
                      return (
                          <TabsTrigger key={tab.value} value={tab.value} className="flex gap-2 items-center">
                              <Icon className="h-4 w-4" />{tab.label}
                          </TabsTrigger>
                      )
                  })}
                </TabsList>
              </div>
              {marketTabs.map(tab => (
                  <TabsContent key={tab.value} value={tab.value}>
                      <div className="overflow-x-auto">
                          <Table>
                          <TableHeader>
                              <TableRow>
                              <TableHead>Instrument</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Change</TableHead>
                              <TableHead className="text-right">% Change</TableHead>
                              <TableHead className="text-right">Trend</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {marketData[tab.value as keyof typeof marketData].map((item) => (
                              <TableRow key={item.instrument}>
                                  <TableCell className="font-medium">{item.instrument}</TableCell>
                                  <TableCell className="text-right font-mono">{item.price}</TableCell>
                                  <TableCell className={cn("text-right font-mono", item.isUp ? "text-financial-green" : "text-financial-red")}>
                                  {item.change}
                                  </TableCell>
                                  <TableCell className="text-right">
                                  <Badge variant={item.isUp ? "default" : "destructive"} className={cn(item.isUp ? "bg-financial-green/20 text-financial-green border-financial-green/50" : "bg-financial-red/20 text-financial-red border-financial-red/50", "hover:opacity-80")}>
                                      {item.changePercent}
                                  </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                  {item.isUp ? <TrendingUp className="h-5 w-5 text-financial-green inline-block" /> : <TrendingDown className="h-5 w-5 text-financial-red inline-block" />}
                                  </TableCell>
                              </TableRow>
                              ))}
                          </TableBody>
                          </Table>
                      </div>
                  </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
