
import { useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { ModeToggle } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  
  // Update page title based on the current route
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    let title = 'SocialSphere';
    
    if (pathSegments.length > 0) {
      // Capitalize the first segment of the path
      const mainPath = pathSegments[0];
      title = `${mainPath.charAt(0).toUpperCase() + mainPath.slice(1)} | SocialSphere`;
    }
    
    document.title = title;
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link 
            to="/"
            className="mr-6 flex items-center space-x-2"
          >
            <span className="font-bold text-lg">
              Social<span className="text-primary">Sphere</span>
            </span>
          </Link>
          
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className={cn(
        "border-t",
        "py-6 md:py-0",
        "bg-background",
      )}>
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 SocialSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
