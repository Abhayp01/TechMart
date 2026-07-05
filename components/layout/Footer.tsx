import Link from "next/link";
import { storeConfig } from "@/lib/store-config";
import { Monitor, MapPin, Phone, Mail, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border pt-20 pb-10 mt-auto relative overflow-hidden">
      {/* Decorative top gradient border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-success" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Monitor className="h-4 w-4" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                B.K. Infotech
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
              Delhi's trusted IT partner since {storeConfig.established}. Sale and repair of laptops, desktops, printers, UPS, networking products, and accessories.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <address className="not-italic text-sm text-muted-foreground">
                  {storeConfig.footer.address}
                </address>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{storeConfig.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{storeConfig.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Products</h4>
            <ul className="space-y-3">
              {storeConfig.footer.links.products.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {storeConfig.footer.links.services.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">Support</h4>
            <ul className="space-y-3">
              {storeConfig.footer.links.support.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            {storeConfig.footer.text}
          </p>
          
          <div className="flex items-center gap-4">
            {storeConfig.footer.socials.map((social, i) => {
              const icons: Record<string, any> = {
                Instagram: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
                Facebook: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                YouTube: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2.3 5.4 3.1 4.6c1.1-1.1 2.4-1.1 3-1.2 4.2-.3 10.4-.3 10.4-.3s6.2 0 10.4.3c.6.1 1.9.1 3 1.2.8.8 1 2.5 1 2.5s.3 2 .3 4v1.8c0 2-.3 4-.3 4s-.2 1.7-1 2.5c-1.1 1.1-2.5 1-3.1 1.2-3.1.3-10.3.3-10.3.3s-6.2 0-10.4-.3c-.6-.1-1.9-.1-3-1.2-.8-.8-1-2.5-1-2.5s-.3-2-.3-4v-1.8c0-2 .3-4 .3-4z"/><polygon points="9.5,15.5 16,12 9.5,8.5"/></svg>,
                LinkedIn: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
                WhatsApp: <Send className="w-4 h-4" />
              };
              return (
                <Link 
                  key={i} 
                  href={social.url}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.platform}
                >
                  {icons[social.platform]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
