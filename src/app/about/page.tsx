
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Users, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { getImageByContextTag } from "@/lib/actions";

const values = [
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Our Mission",
    description: "To provide traders with a reliable, innovative, and secure trading environment, empowering them to achieve their financial goals with confidence.",
  },
  {
    icon: <Eye className="w-8 h-8 text-primary" />,
    title: "Our Vision",
    description: "To be the world's most trusted and sought-after trading partner, renowned for our cutting-edge technology and unwavering commitment to client success.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Our Team",
    description: "Our team consists of industry veterans, tech pioneers, and customer support specialists dedicated to delivering an exceptional trading experience.",
  },
];

export default async function AboutPage() {
  const storyImage = await getImageByContextTag('about_page_generic_promo');

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center bg-secondary/50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
            About <span className="text-primary">Apexora FX Hub</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are a leading-edge financial technology company dedicated to revolutionizing the way you trade the global markets.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-last md:order-first">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Story</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Founded by a team of passionate traders and financial experts, Apexora FX Hub was born from a desire to create a trading platform that we would want to use ourselves. We saw a need for a broker that combines state-of-the-art technology, transparent pricing, and unparalleled customer support.
              </p>
              <p className="mt-4 text-muted-foreground">
                Since our inception, we have been committed to breaking down the barriers to entry in the financial markets, offering powerful tools and educational resources to help traders of all levels succeed.
              </p>
            </div>
             <div className="mt-8 md:mt-0">
              <Image
                src={storyImage?.imageUrl || "https://placehold.co/600x400.png"}
                alt={storyImage?.altText || "About Apexora FX Hub"}
                data-ai-hint="modern office"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">What Drives Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">Our core values are the foundation of everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {value.icon}
                  </div>
                  <CardTitle className="font-headline mt-4">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Your Security is Our Priority</h2>
                    <p className="mt-4 text-lg text-muted-foreground">We understand the importance of security when it comes to your funds and personal data. That's why we employ the highest standards of safety and regulatory compliance.</p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-start">
                            <ShieldCheck className="w-6 h-6 text-financial-green mr-3 mt-1 flex-shrink-0" />
                            <span><span className="font-bold">Segregated Client Funds:</span> Client funds are held in separate accounts with top-tier banks.</span>
                        </li>
                        <li className="flex items-start">
                            <ShieldCheck className="w-6 h-6 text-financial-green mr-3 mt-1 flex-shrink-0" />
                            <span><span className="font-bold">Data Encryption:</span> All data transmission is secured with SSL encryption.</span>
                        </li>
                         <li className="flex items-start">
                            <ShieldCheck className="w-6 h-6 text-financial-green mr-3 mt-1 flex-shrink-0" />
                            <span><span className="font-bold">Regulatory Compliance:</span> We adhere to strict regulatory standards to ensure a fair trading environment.</span>
                        </li>
                    </ul>
                </div>
                <div className="mt-8 md:mt-0">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Security concept"
                        data-ai-hint="security shield"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl"
                    />
                </div>
            </div>
        </div>
    </section>
    </div>
  );
}
