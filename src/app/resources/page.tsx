
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calendar, Mic, MonitorPlay, FileText, Code, Globe, Podcast, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageByContextTag } from "@/lib/actions";

const resourceSections = [
  {
    title: "Educational Material",
    description: "Expand your knowledge with our expert-led courses, tutorials, and publications.",
    items: [
      {
        title: "Trading for Beginners",
        type: "Course",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
        tag: "resource_course_beginners",
        description: "A comprehensive course covering the fundamentals of trading.",
        link: "#",
      },
      {
        title: "Advanced Technical Analysis",
        type: "Video",
        icon: <Video className="w-6 h-6 text-primary" />,
        tag: "resource_video_analysis",
        description: "Deep dive into chart patterns, indicators, and strategies.",
        link: "#",
      },
      {
        title: "Weekly Market Outlook",
        type: "Webinar",
        icon: <MonitorPlay className="w-6 h-6 text-primary" />,
        tag: "resource_webinar_outlook",
        description: "Join our experts live as they analyze upcoming market events.",
        link: "#",
      },
      {
        title: "The Trader's Mindset",
        type: "Podcast",
        icon: <Podcast className="w-6 h-6 text-primary" />,
        tag: "resource_podcast_mindset",
        description: "Listen to interviews with successful traders and psychologists.",
        link: "#",
      },
      {
        title: "Upcoming Trading Summit",
        type: "Event",
        icon: <Calendar className="w-6 h-6 text-primary" />,
        tag: "resource_event_summit",
        description: "Connect with fellow traders and learn from industry leaders.",
        link: "#",
      },
      {
        title: "Risk Management Guide",
        type: "E-book",
        icon: <FileText className="w-6 h-6 text-primary" />,
        tag: "resource_ebook_risk",
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
        tag: "resource_platform_webtrader",
        description: "Master our powerful, browser-based trading platform.",
        link: "#",
      },
      {
        title: "Apexora API Docs",
        type: "Tutorial",
        icon: <Code className="w-6 h-6 text-primary" />,
        tag: "resource_tutorial_api",
        description: "Build your own automated trading strategies with our API.",
        link: "#",
      },
       {
        title: "Trading Glossary",
        type: "Glossary",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
        tag: "resource_glossary",
        description: "Your guide to all the essential trading terminology.",
        link: "#",
      },
    ],
  },
];

export default async function ResourcesPage() {
  const allImageTags = resourceSections.flatMap(section => section.items.map(item => item.tag));
  const imageResults = await Promise.all(allImageTags.map(tag => getImageByContextTag(tag)));
  
  const images = allImageTags.reduce((acc, tag, index) => {
    acc[tag] = imageResults[index];
    return acc;
  }, {} as Record<string, { imageUrl: string; altText: string } | null>);

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
            {section.items.map((item) => {
              const image = images[item.tag];
              return (
                <Card key={item.title} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={image?.imageUrl || `https://placehold.co/600x400.png`}
                        alt={image?.altText || item.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                        data-ai-hint={item.tag.replace(/_/g, ' ')}
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
              )
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
