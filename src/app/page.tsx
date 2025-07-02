
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageByContextTag } from "@/lib/actions";
import { tradingPlans } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { ArrowRight, Bot, BookOpen, Check, LineChart, ShieldCheck } from "lucide-react";
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
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Resource Center",
    description: "Educate yourself with our comprehensive library of learning materials.",
    link: "/resources",
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
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man portrait",
    text: "Apexora's platform is incredibly intuitive and their AI insights have given me a tangible edge in the market. Support is always responsive and helpful.",
  },
  {
    name: "Samantha Lee",
    title: "New Investor",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait",
    text: "As someone new to trading, the educational resources were a lifesaver. I felt confident making my first trades, and the low spreads are a huge plus.",
  },
  {
    name: "Michael Chen",
    title: "Crypto Enthusiast",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man glasses",
    text: "The variety of digital currencies available is fantastic. Fast execution and a clean interface make Apexora my go-to for crypto trading.",
  },
];

export default async function Home() {
  const platformImage = await getImageByContextTag('trading_platforms_overview_main');
  
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
                        <Link href="/resources">Explore Resources</Link>
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

        {/* Visual Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
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
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Find the Right Plan for You</h2>
              <p className="mt-4 text-lg text-muted-foreground">Transparent pricing for every level of trader. <Link href="/pricing" className="text-primary hover:underline">View all plans</Link>.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {tradingPlans.filter(p => [1,3,4].includes(p.id)).map((plan) => (
                <Card key={plan.id} className={cn(
                  "flex flex-col h-full relative",
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
                      <Link href="/signup">{plan.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
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
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
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
