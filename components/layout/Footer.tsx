import Link from 'next/link';
import { Zap, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const LINKS = {
  Shop: [
    { label: 'Mobiles', href: '/products?category=mobile' },
    { label: 'Laptops', href: '/products?category=laptop' },
    { label: 'Headphones', href: '/products?category=headphone' },
    { label: 'All Products', href: '/products' },
  ],
  Account: [
    { label: 'Login', href: '/auth/login' },
    { label: 'Register', href: '/auth/register' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Cart', href: '/cart' },
  ],
  Support: [
    { label: 'FAQ', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Warranty', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">Electro<span className="text-blue-400">Hub</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-5 max-w-xs">
              Bangladesh's trusted electronics destination. Premium products, authentic brands, fast delivery.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@electrohub.com.bd</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold mb-4">{heading}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ElectroHub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Payment powered by</span>
            <span className="font-semibold text-slate-400">SSLCommerz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
