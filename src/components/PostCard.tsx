import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { AnimatedElement } from './AnimatedElement';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    user?: {
      id: number;
      username: string;
      firstName: string;
      lastName: string;
      image: string;
    };
  };
  onTagClick: (tag: string) => void;
  delay?: number;
}

const PostCard = ({ post, onTagClick, delay = 0 }: PostCardProps) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const gotoPostDetail = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const gotoUserProfile = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/posts/${post.id}`);
        const data = await response.json();
        setLikes(data.reactions.likes);
        setDislikes(data.reactions.dislikes);
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactions();
  }, [post.id]);

  return (
    <AnimatedElement 
      animation="slide-up" 
      delay={delay} 
      className="transition-all duration-300"
    >
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border-transparent hover:border-primary/40"
        onClick={() => gotoPostDetail(post.id)}
      >
        <CardContent className="p-4">
          {post.user && (
            <div className="flex items-center space-x-3 mb-3">
              <Avatar 
                className="cursor-pointer border border-border hover:ring-2 hover:ring-primary/40 transition-all"
                onClick={(e) => gotoUserProfile(post.userId, e)}
              >
                <AvatarImage src={post.user?.image} alt={`${post.user?.firstName} ${post.user?.lastName}`} />
                <AvatarFallback>
                  {post.user?.firstName?.charAt(0)}
                  {post.user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => gotoUserProfile(post.userId, e)}
                >
                  {post.user?.firstName} {post.user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">@{post.user?.username}</p>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mb-3">{post.body}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center hover:text-primary transition-colors">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{likes}</span>
            </span>
            <span className="flex items-center hover:text-primary transition-colors">
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span>{dislikes}</span>
            </span>
            <span className="flex items-center hover:text-primary transition-colors ml-auto">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Comments</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default PostCard;
