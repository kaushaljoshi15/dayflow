import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 flex-col justify-center px-16 relative overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-white space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Dayflow.</h1>
          <p className="text-xl text-indigo-100 max-w-lg leading-relaxed">
            The modern operating system for your workforce.
            <br />
            Manage attendance, payroll, and leave with ease.
          </p>
        </div>

        {/* Bottom Logo Badge */}
        <div className="absolute bottom-8 left-8">
           <div className="w-10 h-10 bg-indigo-950 rounded-full flex items-center justify-center text-white font-bold">
             D
           </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-none bg-transparent sm:shadow-lg sm:bg-white sm:rounded-2xl p-0 sm:p-8 w-full border-none",
              headerTitle: "text-2xl font-bold text-gray-900 text-center",
              headerSubtitle: "text-gray-500 text-center mb-6",
              socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 text-gray-600 font-medium",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white normal-case font-bold py-3",
              footerActionLink: "text-indigo-600 hover:text-indigo-700 font-medium",
              formFieldInput: "border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg py-2",
              formFieldLabel: "text-gray-700 font-medium mb-1"
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false
            }
          }}
        />
      </div>
    </div>
  );
}