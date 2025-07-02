import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calendar, Mic, MonitorPlay, FileText, Code, Globe, Podcast, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const resourceSections = [
  {
    title: "Educational Material",
    description: "Expand your knowledge with our expert-led courses, tutorials, and publications.",
    items: [
      {
        title: "Trading for Beginners",
        type: "Course",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "books desk",
        description: "A comprehensive course covering the fundamentals of trading.",
        link: "#",
      },
      {
        title: "Advanced Technical Analysis",
        type: "Video",
        icon: <Video className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "chart screen",
        description: "Deep dive into chart patterns, indicators, and strategies.",
        link: "#",
      },
      {
        title: "Weekly Market Outlook",
        type: "Webinar",
        icon: <MonitorPlay className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "webinar presentation",
        description: "Join our experts live as they analyze upcoming market events.",
        link: "#",
      },
      {
        title: "The Trader's Mindset",
        type: "Podcast",
        icon: <Podcast className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "microphone audio",
        description: "Listen to interviews with successful traders and psychologists.",
        link: "#",
      },
      {
        title: "Upcoming Trading Summit",
        type: "Event",
        icon: <Calendar className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "conference stage",
        description: "Connect with fellow traders and learn from industry leaders.",
        link: "#",
      },
      {
        title: "Risk Management Guide",
        type: "E-book",
        icon: <FileText className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "ebook reader",
        description: "A practical guide to protecting your capital while trading.",
        link: "#",
      },
    ],
  },
  {
    title: "Platform Information",
    description: "Get the most out of Apexora with guides on our trading platforms and tools.",
    items: [
      {
        title: "Apexora WebTrader",
        type: "Platform",
        icon: <Globe className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "laptop desk",
        description: "Master our powerful, browser-based trading platform.",
        link: "#",
      },
      {
        title: "Apexora API Docs",
        type: "Tutorial",
        icon: <Code className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "code editor",
        description: "Build your own automated trading strategies with our API.",
        link: "#",
      },
       {
        title: "Trading Glossary",
        type: "Glossary",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
        image: "https://placehold.co/600x400.png",
        dataAiHint: "dictionary book",
        description: "Your guide to all the essential trading terminology.",
        link: "#",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
          Resources Center
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your comprehensive library for trading education, tools, and platform guides.
        </p>
      </div>

      {resourceSections.map((section) => (
        <section key={section.title} className="mt-16">
          <h2 className="text-3xl font-bold font-headline">{section.title}</h2>
          <p className="mt-2 text-muted-foreground">{section.description}</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {section.items.map((item) => (
              <Card key={item.title} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                      data-ai-hint={item.dataAiHint}
                    />
                     <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md flex items-center gap-2 text-sm">
                        {item.icon}
                        <span className="font-semibold">{item.type}</span>
                    </div>
                  </div>
                   <div className="p-6">
                    <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                    <CardDescription className="mt-2">{item.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto pt-0 p-6">
                  <Link href={item.link} className="font-semibold text-primary inline-flex items-center group">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
