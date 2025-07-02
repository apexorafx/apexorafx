
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMarketData, getMarketTabs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";


export default async function MarketsPage() {
  const marketData = getMarketData();
  const marketTabs = getMarketTabs();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
          Global Markets Overview
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore real-time data from financial markets around the world.
        </p>
      </div>

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
  );
}
