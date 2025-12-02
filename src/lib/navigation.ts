export interface NavigationItem {
  name: string;
  href: string;
  description?: string;
  icon?: string;
}

export const mainNavigation: NavigationItem[] = [
  { 
    name: 'Home', 
    href: '/',
    description: 'Back to homepage'
  },
  { 
    name: 'About', 
    href: '/about',
    description: 'Learn about Dinoverse'
  },
  { 
    name: 'Portfolio', 
    href: '/portfolio',
    description: 'View my projects and work'
  },
  { 
    name: 'Services', 
    href: '/services',
    description: 'Browse available services'
  },
  { 
    name: 'Blog', 
    href: '/blog',
    description: 'Read latest articles and insights'
  },
  { 
    name: 'Store', 
    href: '/store',
    description: 'Shop digital products'
  },
  { 
    name: 'Contact', 
    href: '/contact',
    description: 'Get in touch with me'
  },
];

export const adminNavigation: NavigationItem[] = [
  { 
    name: 'Admin', 
    href: '/admin',
    description: 'Admin dashboard'
  },
];

export const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/dinoverse',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/dinoverse',
    icon: 'linkedin',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/dinoverse',
    icon: 'twitter',
  },
];
