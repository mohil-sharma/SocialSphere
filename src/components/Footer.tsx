
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Github, Mail, Twitter, Instagram, Facebook, Home, User, Search, BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-muted-foreground text-sm">
              A community-driven platform where you can share thoughts, ideas, and connect with like-minded individuals.
            </p>
            <div className="flex mt-4 space-x-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>123 Social Street</p>
              <p>Social City, SC 12345</p>
              <p className="mt-2">Email: info@socialapp.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Stay updated with our latest features and posts.
            </p>
            <div className="flex">
              <Input 
                placeholder="Your email" 
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0" 
              />
              <Button className="rounded-l-none">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SocialSphere. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
