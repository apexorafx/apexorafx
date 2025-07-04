
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageByContextTag } from "@/lib/actions";
import { mockTraders } from "@/lib/traders";
import { ArrowRight, Search, Copy, Repeat, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "1. Discover Traders",
    description: "Explore our community of verified top-performing traders. Filter by performance, risk level, market, and more to find the perfect match for your goals.",
  },
  {
    icon: <Copy className="w-8 h-8 text-primary" />,
    title: "2. Allocate Funds & Copy",
    description: "Decide how much you want to invest. With one click, you can start automatically copying all their trades in real-time, proportionally to your investment.",
  },
  {
    icon: <Repeat className="w-8 h-8 text-primary" />,
    title: "3. Monitor & Control",
    description: "Track your performance from your dashboard. You remain in full control and can pause copying, add funds, or close your position at any time.",
  },
]

export default async function CopyTradingPage() {
    const heroImage = await getImageByContextTag('copy_trading_hero', 'social trading network');
    const topTraders = mockTraders.filter(t => ['trader_001', 'trader_002', 'trader_007', 'trader_008'].includes(t.id));

    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-background text-foreground text-center">
                <div className="absolute inset-0">
                    <Image
                        src={heroImage?.imageUrl || "https://placehold.co/1920x1080.png"}
                        alt={heroImage?.altText || "Social trading network concept"}
                        data-ai-hint="social trading network"
                        fill
                        className="object-cover opacity-10 dark:opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
                        Trade Like a Pro with <span className="text-primary">Copy Trading</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Tap into the expertise of seasoned traders. Automatically replicate their strategies in your own portfolio and unlock your trading potential.
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg" className="font-bold">
                            <Link href="/signup">Start Copying Now</Link>
                        </Button>
                    </div>
                </div>
            </section>

             {/* How It Works Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Simple Steps to Success</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Start copy trading in just a few minutes.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <Card key={step.title} className="text-center border-t-4 border-primary/20 hover:border-primary transition-colors duration-300">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                                    {step.icon}
                                </div>
                                <CardTitle className="font-headline mt-4">{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>
            </section>

             {/* Top Traders Section */}
            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet Our Top Traders</h2>
                        <p className="mt-4 text-lg text-muted-foreground">A glimpse into our community of successful traders you can copy.</p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topTraders.map(trader => (
                             <Card 
                                key={trader.id} 
                                className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 bg-card"
                            >
                                <div className="relative h-40 w-full">
                                    <Image 
                                        src={trader.image}
                                        alt={`${trader.username} - Trading Activity`} 
                                        fill
                                        className="object-cover"
                                        data-ai-hint="abstract shape"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end">
                                        <h3 className="text-lg font-semibold text-white">{trader.username}</h3>
                                    </div>
                                </div>
                                <CardContent className="p-4 space-y-3 flex-grow">
                                    <div className="flex items-center justify-between">
                                        <Avatar className="h-12 w-12 border-2 border-primary">
                                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${trader.avatarSeed}`} alt={trader.username} />
                                            <AvatarFallback>{trader.avatarSeed}</AvatarFallback>
                                        </Avatar>
                                        <Badge variant={trader.risk === 'Low' ? 'secondary' : trader.risk === 'Medium' ? 'default' : 'destructive'} className="capitalize text-xs px-2 py-1">
                                            {trader.risk} Risk
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Market: {trader.market}</p>
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <div className="flex items-center gap-1 font-semibold">
                                            <TrendingUp className="w-4 h-4 text-financial-green"/>
                                            <span className="text-financial-green">{trader.profit}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Users className="w-4 h-4"/>
                                            <span>{trader.copiers.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 bg-muted/30 border-t mt-auto">
                                    <Button asChild className="w-full">
                                        <Link href="/login?redirect=/dashboard/copy-trading">Copy {trader.username}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Amplify Your Trading?</h2>
                    <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                    Join Apexora FX Hub to start copying the best traders, or even become a top trader that others can copy.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button asChild size="lg" variant="secondary" className="font-bold text-lg">
                            <Link href="/signup">Open a Free Account</Link>
                        </Button>
                         <Button asChild size="lg" variant="outline" className="font-bold border-primary-foreground/50 hover:bg-primary-foreground/10">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
