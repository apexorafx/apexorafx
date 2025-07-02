
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function SetupPinPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold font-headline">Setup Your Trading PIN</CardTitle>
                <CardDescription>This feature is currently under construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    We are working hard to bring you a secure trading PIN feature. Please check back soon.
                    For now, you cannot access the dashboard until this step is implemented.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
