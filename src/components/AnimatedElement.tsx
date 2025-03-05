
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'none';
  delay?: number;
}

export function AnimatedElement({
  children,
  animation = 'fade-in',
  delay = 0,
  className,
  ...props
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  const getAnimationClass = () => {
    if (animation === 'none') return '';
    
    switch (animation) {
      case 'fade-in':
        return isVisible ? 'opacity-100 transition-opacity duration-700' : 'opacity-0';
      case 'slide-up':
        return isVisible 
          ? 'opacity-100 translate-y-0 transition-all duration-700' 
          : 'opacity-0 translate-y-8';
      case 'scale-in':
        return isVisible 
          ? 'opacity-100 scale-100 transition-all duration-500' 
          : 'opacity-0 scale-95';
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(getAnimationClass(), className)}
      {...props}
    >
      {children}
    </div>
  );
}
