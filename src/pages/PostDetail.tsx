import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageSquare, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AnimatedElement } from '@/components/AnimatedElement';

interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
  likes: number; // Added likes
  dislikes: number; // Added dislikes
  user?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    image: string;
  };
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    data: post, 
    isLoading: postLoading,
    error: postError
  } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/posts/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      try {
        const userResponse = await fetch(`https://dummyjson.com/users/${data.userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          return { ...data, user: userData };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      
      return data;
    }
  });

  const { 
    data: comments, 
    isLoading: commentsLoading,
    error: commentsError
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/comments/post/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const commentsWithUsers = await Promise.all(
        data.comments.map(async (comment: any) => {
          try {
            return {
              ...comment,
              user: {
                id: comment.user.id,
                username: comment.user.username,
                firstName: comment.user.username.split('_')[0],
                lastName: comment.user.username.split('_')[1] || '',
                image: `https://robohash.org/${comment.user.username}?set=set4`
              }
            };
          } catch (error) {
            console.error(`Failed to process comment ${comment.id}:`, error);
            return comment;
          }
        })
      );
      
      return commentsWithUsers;
    },
    enabled: !!id
  });

  const goBack = () => {
    navigate(-1);
  };

  const sharePost = () => {
    toast.info('Post link copied to clipboard!');
  };

  const likes = post ? post.likes : 0; // Fetch likes from API
  const dislikes = post ? post.dislikes : 0; // Fetch dislikes from API

  if (postLoading || commentsLoading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <AnimatedElement animation="fade-in" className="container mx-auto mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button variant="default" onClick={goBack}>Go back home</Button>
      </AnimatedElement>
    );
  }

  return (
    <div className="container mx-auto my-12">
      <AnimatedElement animation="slide-up">
        <Card className="max-w-2xl mx-auto shadow-lg transition-all hover:shadow-xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <Button variant="ghost" onClick={goBack} className="group hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </Button>
            </div>
            
            <AnimatedElement animation="fade-in" delay={100}>
              {post.user && (
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar 
                    className="cursor-pointer border border-border hover:ring-2 hover:ring-primary/40 transition-all"
                    onClick={() => navigate(`/user/${post.userId}`)}
                  >
                    <AvatarImage src={post.user.image} />
                    <AvatarFallback>
                      {post.user.firstName?.charAt(0)}
                      {post.user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p 
                      className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                      onClick={() => navigate(`/user/${post.userId}`)}
                    >
                      {post.user.firstName} {post.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">@{post.user.username}</p>
                  </div>
                </div>
              )}
              
              <CardTitle className="text-2xl font-bold mb-4">{post.title}</CardTitle>
              <CardDescription className="text-gray-500 mb-6 text-base leading-relaxed">{post.body}</CardDescription>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" delay={200}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4 text-gray-600">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto hover:text-primary">
                    <ThumbsUp className="h-5 w-5" />
                    <span>{likes} Likes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto hover:text-primary">
                    <ThumbsDown className="h-5 w-5" />
                    <span>{dislikes} Dislikes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto hover:text-primary" onClick={sharePost}>
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" delay={300}>
              <div className="mt-6">
                {post.tags && post.tags.map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="mr-2 mb-2 transition-colors hover:bg-primary/10 hover:border-primary/40"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </AnimatedElement>
            
            <Separator className="my-8" />
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-6">Comments ({comments?.length || 0})</h3>
              
              {commentsError ? (
                <p className="text-destructive">Error loading comments</p>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment: Comment, index: number) => (
                    <AnimatedElement 
                      key={comment.id} 
                      animation="slide-up" 
                      delay={index * 100}
                      className="bg-muted/50 rounded-lg p-4 transition-all hover:bg-muted"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar 
                          className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
                          onClick={() => navigate(`/user/${comment.user.id}`)}
                        >
                          <AvatarImage src={comment.user.image} />
                          <AvatarFallback>
                            {comment.user.firstName?.charAt(0) || ''}
                            {comment.user.lastName?.charAt(0) || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                              onClick={() => navigate(`/user/${comment.user.id}`)}
                            >
                              @{comment.user.username}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{comment.body}</p>
                        </div>
                      </div>
                    </AnimatedElement>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No comments yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </AnimatedElement>
    </div>
  );
};

export default PostDetail;
