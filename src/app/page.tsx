import { UserWelcome } from "@/components/auth/user-welcome";
import { FeaturesSection } from "@/components/features/features-section";

export default function HomePage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* User Welcome Section */}
        <UserWelcome />
      </div>
      
      {/* Features Section */}
      <FeaturesSection />
    </>
  );
}
