import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApexoraLogo } from "@/components/icons";
import { Github, Twitter, Linkedin } from "lucide-react";

const sections = [
  {
    title: "Markets",
    links: [
      { label: "Forex", href: "/markets" },
      { label: "Shares", href: "/markets" },
      { label: "Commodities", href: "/markets" },
      { label: "Indices", href: "/markets" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "AI Insights", href: "/ai-insights" },
      { label: "Courses", href: "/resources" },
      { label: "Webinars", href: "/resources" },
      { label: "E-books", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact Us", href: "/contact" },
      { label: "Customer Feedback", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Risk Disclosure", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <ApexoraLogo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">Apexora</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Your gateway to global financial markets.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-headline font-semibold tracking-wider text-foreground">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <h3 className="font-headline font-semibold tracking-wider text-foreground">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Get the latest market insights and updates from Apexora.
            </p>
            <form className="mt-4 flex gap-2">
              <Input type="email" placeholder="Enter your email" aria-label="Email for newsletter"/>
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Apexora FX Hub. All rights
            reserved.
          </p>
          <p className="mt-2">
            This is a fictional application built for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
