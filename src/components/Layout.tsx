import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Calendar, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Layout = ({ children, activeSection = "dashboard", onSectionChange }: LayoutProps) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "essay", label: "Essay Assistant", icon: Brain },
    { id: "schedule", label: "Study Planner", icon: Calendar },
    { id: "topics", label: "Learning Hub", icon: BookOpen },
  ];

  const NavContent = () => (
    <div className="flex flex-col space-y-2 p-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className="justify-start gap-3"
            onClick={() => onSectionChange?.(item.id)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:flex lg:flex-col lg:bg-card lg:border-r lg:shadow-card">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EduPlatform AI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your intelligent study companion
          </p>
        </div>
        <NavContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
            EduPlatform AI
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b">
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  EduPlatform AI
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your intelligent study companion
                </p>
              </div>
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;