import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { BookOpen, Home, PlusCircle, User, List } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/reviews", label: "All Reviews", icon: List },
  { path: "/my-reviews", label: "My Reviews", icon: BookOpen },
  { path: "/submit-review", label: "Submit Review", icon: PlusCircle },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
      <Link to="/" className="flex items-center gap-3 mb-8">
        <img src="/logo.svg" alt="Review Hub" className="size-10" />
        <span className="text-xl font-bold">Review Hub</span>
      </Link>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground glow-primary"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
