
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageByContextTag } from "@/lib/actions";
import { tradingPlans } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { ArrowRight, Bot, Users, Check, LineChart, ShieldCheck, Globe, Landmark, Coins, Wheat, BarChartHorizontal, UserPlus, DollarSign, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <LineChart className="w-8 h-8 text-primary" />,
    title: "Diverse Markets",
    description: "Access Forex, Shares, Indices, and more from a single platform.",
    link: "/markets",
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "AI-Powered Insights",
    description: "Leverage artificial intelligence to get personalized trading insights.",
    link: "/ai-insights",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Copy Trading",
    description: "Replicate the strategies of top traders automatically in your own portfolio.",
    link: "/copy-trading",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Secure & Regulated",
    description: "Trade with confidence on a secure platform with robust protection.",
    link: "/pricing",
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    title: "Seasoned Trader",
    avatarSeed: "Alex",
    text: "Apexora's platform is incredibly intuitive and their AI insights have given me a tangible edge in the market. Support is always responsive and helpful.",
  },
  {
    name: "Samantha Lee",
    title: "New Investor",
    avatarSeed: "Samantha",
    text: "As someone new to trading, the educational resources were a lifesaver. I felt confident making my first trades, and the low spreads are a huge plus.",
  },
  {
    name: "Michael Chen",
    title: "Crypto Enthusiast",
    avatarSeed: "Michael",
    text: "The variety of digital currencies available is fantastic. Fast execution and a clean interface make Apexora my go-to for crypto trading.",
  },
  {
    name: "David Rodriguez",
    title: "Day Trader",
    avatarSeed: "David",
    text: "Execution speed is critical for my strategy, and Apexora delivers. The platform is stable and fast, which is exactly what I need for day trading.",
  },
  {
    name: "Jessica Williams",
    title: "Mobile-First User",
    avatarSeed: "Jessica",
    text: "I do most of my trading on the go, and the mobile experience is seamless. It's powerful enough to do proper analysis but simple enough to use anywhere.",
  },
];

const markets = [
    { name: "Forex", icon: <Globe className="w-10 h-10 text-primary"/> },
    { name: "Stocks", icon: <Landmark className="w-10 h-10 text-primary"/> },
    { name: "Crypto", icon: <Coins className="w-10 h-10 text-primary"/> },
    { name: "Commodities", icon: <Wheat className="w-10 h-10 text-primary"/> },
    { name: "Indices", icon: <BarChartHorizontal className="w-10 h-10 text-primary"/> },
];

const getStartedSteps = [
    {
        icon: <UserPlus className="w-10 h-10 text-primary" />,
        title: "1. Create Account",
        description: "Complete our quick and secure registration form to get started in minutes.",
    },
    {
        icon: <DollarSign className="w-10 h-10 text-primary" />,
        title: "2. Fund Your Account",
        description: "Choose from various secure deposit methods to fund your trading account.",
    },
    {
        icon: <TrendingUp className="w-10 h-10 text-primary" />,
        title: "3. Start Trading",
        description: "Access the global markets, utilize our tools, and begin your trading journey.",
    },
];

export default async function Home() {
  const platformImage = await getImageByContextTag('trading_platforms_overview_main', 'trading dashboard');
  
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-background">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] dark:bg-grid-slate-400/[0.05]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
                    Navigate the Global Markets with <span className="text-primary">Confidence</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Apexora FX Hub offers a powerful, intuitive platform with AI-driven insights to help you trade smarter across Forex, Stocks, Crypto, and more.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild size="lg" className="font-bold">
                        <Link href="/signup">Start Trading Now</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="font-bold">
                        <Link href="/copy-trading">Explore Copy Trading</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Apexora?</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to master the markets in one place.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Button asChild variant="link" className="mt-4 font-bold text-primary">
                      <Link href={feature.link}>Learn More <ArrowRight className="ml-2 w-4 h-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Markets Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">A World of Markets at Your Fingertips</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Trade on a wide range of instruments with competitive conditions.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {markets.map(market => (
                        <div key={market.name} className="flex flex-col items-center gap-4 text-center">
                            <div className="bg-background p-5 rounded-full shadow-md">
                                {market.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{market.name}</h3>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/markets">Explore All Instruments</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Visual Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">One Platform, Infinite Possibilities</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Our state-of-the-art trading platform provides you with all the tools you need for success. Enjoy fast execution, advanced charting, and a user-friendly interface designed for both beginners and experts.</p>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start">
                                <ShieldCheck className="w-6 h-6 text-financial-green mr-3 mt-1 flex-shrink-0" />
                                <span><span className="font-bold">Advanced Charting Tools:</span> Analyze market trends with dozens of indicators and drawing tools.</span>
                            </li>
                            <li className="flex items-start">
                                <ShieldCheck className="w-6 h-6 text-financial-green mr-3 mt-1 flex-shrink-0" />
                                <span><span className="font-bold">Real-Time Data:</span> Get up-to-the-second market data to make informed decisions.</span>
                            </li>
                             <li className="flex items-start">
                                <ShieldCheck className="w-6 h-6 text-financial-green mr-3 mt-1 flex-shrink-0" />
                                <span><span className="font-bold">Cross-Device Sync:</span> Trade seamlessly on web, desktop, and mobile devices.</span>
                            </li>
                        </ul>
                        <Button asChild size="lg" className="mt-8 font-bold">
                            <Link href="/markets">Discover Our Platform</Link>
                        </Button>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <Image
                            src={platformImage?.imageUrl || "https://placehold.co/600x400.png"}
                            alt={platformImage?.altText || "Apexora trading platform interface"}
                            data-ai-hint="trading dashboard"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Trading Plans Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Find the Right Plan for You</h2>
              <p className="mt-4 text-lg text-muted-foreground">Transparent pricing for every level of trader. <Link href="/pricing" className="text-primary hover:underline">View all plans</Link>.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {tradingPlans.map((plan) => (
                <Card key={plan.id} className={cn(
                  "flex flex-col h-full",
                  plan.isPopular ? "border-primary shadow-2xl scale-105" : "hover:shadow-xl transition-shadow"
                )}>
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
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
                      <Link href={plan.name.toLowerCase().includes('contact') ? '/contact' : '/signup'}>{plan.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Trusted by Traders Worldwide</h2>
              <p className="mt-4 text-lg text-muted-foreground">Hear what our clients have to say about their experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col">
                  <CardContent className="pt-6 flex-grow">
                    <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  </CardContent>
                  <CardHeader className="flex-row items-center gap-4 pt-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${testimonial.avatarSeed}`} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-bold font-headline">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Get Started Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Get Started in 3 Simple Steps</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Begin your journey to the financial markets today.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {getStartedSteps.map((step) => (
                        <div key={step.title} className="flex flex-col items-center">
                            <div className="bg-primary/10 p-5 rounded-full mb-4">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2">{step.title}</h3>
                            <p className="text-muted-foreground max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Elevate Your Trading?</h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of successful traders and access the tools and insights you need to thrive in today's markets.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="font-bold text-lg">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
