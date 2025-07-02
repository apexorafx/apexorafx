
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LineChart as LineChartIcon, Star, Search, Loader2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts"
import { getMarketData, getMarketTabs } from '@/lib/data';
import Image from 'next/image';

interface Asset {
  id: string;
  name: string;
  price: number;
  change: string;
  changePercent: string;
  high: number;
  low: number;
  isUp: boolean;
  favorite: boolean;
  category: string;
}

const eurUsdHistoricalData = [
  { date: '2024-05-01', price: 1.0850 },
  { date: '2024-05-02', price: 1.0865 },
  { date: '2024-05-03', price: 1.0830 },
  { date: '2024-05-04', price: 1.0880 },
  { date: '2024-05-05', price: 1.0875 },
  { date: '2024-05-06', price: 1.0900 },
  { date: '2024-05-07', price: 1.0890 },
];

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function MarketsDashboardPage() {
  const [assets, setAssets] = useState<Record<string, Asset[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('forex');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const marketTabs = getMarketTabs();

  useEffect(() => {
    const rawMarketData = getMarketData();
    const processedAssets: Record<string, Asset[]> = {};

    Object.entries(rawMarketData).forEach(([category, categoryAssets]) => {
      processedAssets[category] = categoryAssets.map(asset => {
        const price = parseFloat(asset.price.replace(/,/g, ''));
        return {
          id: asset.instrument,
          name: asset.instrument,
          price: price,
          change: asset.change,
          changePercent: asset.changePercent,
          isUp: asset.isUp,
          high: price * 1.015, // Mock data: 1.5% higher than current price
          low: price * 0.985,  // Mock data: 1.5% lower than current price
          favorite: false, // Default to not favorite
          category,
        };
      });
    });

    setAssets(processedAssets);
    if (processedAssets.forex && processedAssets.forex.length > 0) {
      setSelectedAsset(processedAssets.forex[0]);
    }
    setIsLoading(false);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleFavorite = (assetId: string, assetCategory: string) => {
    setAssets(prevAssets => {
      const newAssets = { ...prevAssets };
      if (newAssets[assetCategory]) {
        newAssets[assetCategory] = newAssets[assetCategory].map(asset =>
          asset.id === assetId ? { ...asset, favorite: !asset.favorite } : asset
        );
      }
      return newAssets;
    });
    const asset = assets[assetCategory]?.find(a => a.id === assetId);
    if (asset) {
        toast({
            title: asset.favorite ? "Removed from Favorites" : "Added to Favorites",
            description: `${asset.name} has been ${asset.favorite ? 'removed from' : 'added to'} your favorites.`,
        });
    }
  };
  
  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };
  
  const filteredAssets = useMemo(() => {
    if (activeTab === 'favorites') {
      return Object.values(assets)
        .flat()
        .filter(asset => asset && asset.favorite && (
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.id.toLowerCase().includes(searchTerm.toLowerCase())
        )); 
    }
    
    const sourceAssets = assets[activeTab] || [];
    
    if (!searchTerm) return sourceAssets;
    
    return sourceAssets.filter(asset =>
      asset && (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [assets, activeTab, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <LineChartIcon className="mr-3 h-8 w-8" /> Markets Overview
        </h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search markets..." className="pl-8 w-full sm:w-64 md:w-80" onChange={handleSearchChange} value={searchTerm} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Explore Trading Instruments</CardTitle>
            <CardDescription>View different market categories and their assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="forex" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 mb-6 h-auto flex-wrap">
                  <TabsTrigger key="favorites" value="favorites">Favorites</TabsTrigger>
                {marketTabs.map(cat => (
                  <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                ))}
              </TabsList>
              
              <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading market data...</p>
                    </div>
                ) : (
                    (filteredAssets && filteredAssets.length > 0) ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right hidden sm:table-cell">Change</TableHead>
                              <TableHead className="text-center">Favorite</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredAssets.map(asset => (
                              <TableRow key={asset.id} onClick={() => handleViewAsset(asset)} className="cursor-pointer hover:bg-muted/50">
                                <TableCell className="font-medium py-3">{asset.name}</TableCell>
                                <TableCell className="text-right py-3 font-mono">${asset.price.toFixed(asset.id.toUpperCase().includes('JPY') ? 2 : 4)}</TableCell>
                                <TableCell className={`text-right py-3 font-mono hidden sm:table-cell ${asset.isUp ? 'text-financial-green' : 'text-financial-red'}`}>{asset.changePercent}</TableCell>
                                <TableCell className="text-center py-3">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={asset.favorite ? "text-accent hover:text-accent/80" : "text-muted-foreground hover:text-muted-foreground/80"}
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id, asset.category); }}
                                    aria-label={asset.favorite ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    <Star className={`h-5 w-5 ${asset.favorite ? 'fill-current' : ''}`} />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right py-3">
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewAsset(asset);}}>
                                    <Eye className="mr-1.5 h-4 w-4" /> View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                       <div className="text-center py-10 text-muted-foreground h-full flex flex-col justify-center items-center">
                         <Search className="h-10 w-10 mb-2 opacity-50" />
                         <p>{searchTerm ? `No assets found for "${searchTerm}".` : `No assets in this category.`}</p>
                       </div>
                    )
                )}
                </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg h-fit sticky top-20">
          <CardHeader>
            <CardTitle className="text-xl truncate">
              {selectedAsset ? `${selectedAsset.name} Details` : 'Asset Details'}
            </CardTitle>
            <CardDescription>
              {selectedAsset ? `Data for ${selectedAsset.id}` : 'Select an asset to view its chart and details.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAsset ? (
              <div className="space-y-4">
                {selectedAsset.id === 'EUR/USD' ? (
                   <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                    <LineChart accessibilityLayer data={eurUsdHistoricalData} margin={{ left: 12, right: 12, top: 5, bottom: 5, }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                       <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={6} domain={['auto', 'auto']} tickFormatter={(value) => `$${Number(value).toFixed(4)}`} />
                      <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
                      <Line dataKey="price" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Price" />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="aspect-video bg-muted/30 rounded-md flex items-center justify-center">
                    <Image 
                      src={`https://placehold.co/600x300.png`} 
                      alt={`${selectedAsset.name} Chart`}
                      data-ai-hint="market chart graph"
                      width={600} 
                      height={300}
                      className="opacity-70 rounded-md" 
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold text-lg font-mono">${selectedAsset.price.toFixed(selectedAsset.id.toUpperCase().includes('JPY') ? 2 : 4)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Change</p>
                        <p className={`font-semibold text-lg font-mono ${selectedAsset.isUp ? 'text-financial-green' : 'text-financial-red'}`}>{selectedAsset.changePercent}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">24h High</p>
                        <p className="font-semibold font-mono">${selectedAsset.high.toFixed(selectedAsset.id.toUpperCase().includes('JPY') ? 2 : 4)}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-muted-foreground">24h Low</p>
                        <p className="font-semibold font-mono">${selectedAsset.low.toFixed(selectedAsset.id.toUpperCase().includes('JPY') ? 2 : 4)}</p>
                    </div>
                </div>
                <Separator />
                 <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => toast({ title: "Trade Action (UI Demo)", description: `Initiating trade simulation for ${selectedAsset.name}...`})}
                >
                    Trade {selectedAsset.name}
                </Button>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground h-full flex flex-col items-center justify-center min-h-[400px]">
                <LineChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an asset from the list to view its chart and detailed information here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
