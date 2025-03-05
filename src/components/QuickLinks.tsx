
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Layout } from 'lucide-react';
import { AnimatedElement } from './AnimatedElement';

const QuickLinks = () => {
  const navigate = useNavigate();
  
  return (
    <AnimatedElement animation="fade-in" delay={200}>
      <Card className="transition-all duration-500 hover:shadow-md">
        <CardContent className="p-4">
          <h3 className="font-medium flex items-center mb-3">
            <Layout className="h-4 w-4 mr-2 text-primary" />
            Quick Links
          </h3>
          <Separator className="mb-3" />
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground group"
              onClick={() => navigate('/login')}
            >
              <span className="transition-transform group-hover:translate-x-1">Login</span>
              <ChevronRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground group"
              onClick={() => navigate('/search')}
            >
              <span className="transition-transform group-hover:translate-x-1">Advanced Search</span>
              <ChevronRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default QuickLinks;
