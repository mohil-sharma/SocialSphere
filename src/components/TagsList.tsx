import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tag, X } from 'lucide-react';
import { AnimatedElement } from './AnimatedElement';

interface TagsListProps {
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
}

const TagsList = ({ selectedTag, onTagClick }: TagsListProps) => {
  // Predefined tags for social networking app
  const tags = [
    'history', 'american', 'crime', 'french', 'fiction', 
    'english', 'magical', 'mystery', 'love', 'classic'
  ];

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
    onTagClick(tag);
  };

  return (
    <AnimatedElement animation="fade-in" delay={100}>
      <Card className="transition-all duration-500 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              Popular Tags
            </h3>
            
            {selectedTag && (
              <Badge 
                variant="outline"
                className="bg-destructive/10 hover:bg-destructive/20 cursor-pointer flex items-center gap-1"
                onClick={() => handleTagClick(selectedTag)} // Clicking will toggle it off
              >
                Clear <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <Separator className="mb-3" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedTag === tag 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default TagsList;