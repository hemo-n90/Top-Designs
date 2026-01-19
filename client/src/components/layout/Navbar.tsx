import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/catalog", label: "المنتجات" },
  { href: "/visit-request", label: "طلب معاينة" },
];

export function Navbar() {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-md border bg-white flex items-center justify-center">
              <img src="../logo.jpg" alt="قمة التصاميم" />
            </div>
            <span
              className="text-lg font-bold text-foreground hidden sm:inline-block"
              data-testid="text-brand-name"
            >
              قمة التصاميم
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* WhatsApp - Desktop only */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              asChild
              data-testid="button-whatsapp"
            >
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-5 w-5" />
              </a>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild
              data-testid="button-cart"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -left-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
                      ق
                    </div>
                    <span className="text-lg font-bold">قمة التصاميم</span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={`text-base font-medium py-2 transition-colors hover:text-primary ${
                            location === link.href
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                          data-testid={`link-mobile-nav-${link.href.replace("/", "") || "home"}`}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="pt-4 border-t">
                    <a
                      href="https://wa.me/966500000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base font-medium text-primary"
                    >
                      <Phone className="h-5 w-5" />
                      تواصل معنا
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
