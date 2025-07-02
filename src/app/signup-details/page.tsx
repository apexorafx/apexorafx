import { SignupDetailsForm } from "./form";

export default function SignupDetailsPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-foreground">
              Complete Your Profile
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Please provide a few more details to set up your trading account.
            </p>
        </div>
        <SignupDetailsForm />
      </div>
    </div>
  );
}
