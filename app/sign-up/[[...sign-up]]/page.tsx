import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#f9fafb]"> {/* Very light gray background */}
      
      {/* LEFT SIDE: Branding (Unchanged) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="relative z-10 text-white space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Join Dayflow.</h1>
          <p className="text-xl text-indigo-100 max-w-lg leading-relaxed">
            Create your account today and start streamlining your workforce management.
          </p>
        </div>
        <div className="absolute bottom-8 left-8">
           <div className="w-10 h-10 bg-indigo-950 rounded-full flex items-center justify-center text-white font-bold">D</div>
        </div>
      </div>

      {/* RIGHT SIDE: Light Theme Form (Exact Match) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignUp 
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{
            variables: {
              colorPrimary: "#1e293b", // Dark Slate (Matches the 'Continue' button)
              colorBackground: "#ffffff", // White Card
              colorText: "#111827", // Dark Text
              colorTextSecondary: "#6b7280", // Gray labels
              colorInputBackground: "#ffffff", // White inputs
              colorInputText: "#111827",
              borderRadius: "0.75rem", // Rounded corners
            },
            elements: {
              // 1. The Main Card (White with specific shadow)
              rootBox: "w-full max-w-md",
              card: "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-2xl p-8",
              
              // 2. Titles
              headerTitle: "text-2xl font-bold text-gray-900 text-center",
              headerSubtitle: "text-gray-500 text-center mb-6",
              
              // 3. Social Buttons (White with gray border)
              socialButtonsBlockButton: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium",
              
              // 4. Input Fields (White with gray border)
              formFieldInput: "bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-lg py-2.5 text-gray-900",
              formFieldLabel: "text-gray-700 font-medium mb-1.5",
              
              // 5. The Main 'Continue' Button (Dark Slate)
              formButtonPrimary: "bg-[#1e293b] hover:bg-[#0f172a] text-white normal-case font-bold py-3 rounded-lg shadow-sm transition-all",
              
              // 6. Footer Links
              footerActionLink: "text-indigo-600 hover:text-indigo-700 font-bold",
              identityPreviewText: "text-gray-600",
              formResendCodeLink: "text-indigo-600 hover:text-indigo-700 font-medium"
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: true // REQUIRED to show Name fields
            }
          }}
        />
      </div>
    </div>
  );
}