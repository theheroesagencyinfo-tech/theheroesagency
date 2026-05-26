import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { label: "Services", href: "#services", type: "section" as const },
  { label: "Process", href: "#process", type: "section" as const },
  { label: "Portfolio", href: "/portfolio", type: "route" as const },
  { label: "About", href: "/about", type: "route" as const },
  { label: "Testimonials", href: "#testimonials", type: "section" as const },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: (typeof navLinks)[number]) => {
    setIsMobileMenuOpen(false);
    if (link.type === "route") {
      navigate(link.href);
      return;
    }
    const id = link.href.replace("#", "");
    if (location.pathname !== "/") {
      navigate(`/${link.href}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const handleContact = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/#contact");
      return;
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass border-b border-white/5 py-4" : "bg-transparent py-6"}`}
      >
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl md:text-2xl font-bold text-gradient">
              THE HEROES AGENCY
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Button
                onClick={handleContact}
                className="gradient-gold text-primary-foreground font-semibold hover:scale-105 transition-transform duration-300"
              >
                Let's Talk
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 glass pt-24"
        >
          <nav className="container px-4 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="text-xl font-medium text-foreground text-left py-2"
              >
                {link.label}
              </button>
            ))}
            <Button onClick={handleContact} className="gradient-gold text-primary-foreground font-semibold mt-4">
              Let's Talk
            </Button>
          </nav>
        </motion.div>
      )}
    </>
  );
}
