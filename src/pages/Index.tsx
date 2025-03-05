import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Search, SortAsc, Loader2 } from 'lucide-react';
import PostCard from '@/components/PostCard';
import TagsList from '@/components/TagsList';
import QuickLinks from '@/components/QuickLinks';
import { AnimatedElement } from '@/components/AnimatedElement';
import { toast } from '@/lib/toast';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
  user?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    image: string;
  };
}

interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

interface TagsResponse {
  tags: string[];
}

// Transform API reactions to the format our components expect
const transformPosts = (posts: Post[]) => {
  return posts.map(post => ({
    ...post,
    reactions: {
      likes: Math.ceil(post.reactions * 0.7), // 70% of reactions as likes
      dislikes: Math.floor(post.reactions * 0.3), // 30% of reactions as dislikes
    }
  }));
};

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'popularity'>('newest');
  const postsPerPage = 9;
  
  // Fetch all tags
  const { 
    data: tagsData,
    isLoading: tagsLoading,
    error: tagsError 
  } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('https://dummyjson.com/posts/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json() as TagsResponse;
      console.log('Tags fetched:', data); // Debug log
      return data;
    }
  });
  
  // Add useEffect to debug tags when they change
  useEffect(() => {
    console.log('Tags in state:', tagsData);
  }, [tagsData]);
  
  // Fetch posts with pagination and filtering
  const { 
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['posts', currentPage, selectedTag, sortBy, searchQuery],
    queryFn: async () => {
      let url = `https://dummyjson.com/posts`;
      
      // Handle search query
      if (searchQuery) {
        url = `https://dummyjson.com/posts/search?q=${searchQuery}`;
      }
      // Handle tag filtering
      else if (selectedTag) {
        url = `https://dummyjson.com/posts/tag/${selectedTag}`;
      }
      
      // Add pagination
      url += url.includes('?') ? 
        `&limit=${postsPerPage}&skip=${(currentPage - 1) * postsPerPage}` : 
        `?limit=${postsPerPage}&skip=${(currentPage - 1) * postsPerPage}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json() as PostsResponse;
      
      // Fetch user details for each post
      const postsWithUsers = await Promise.all(
        data.posts.map(async (post) => {
          try {
            const userResponse = await fetch(`https://dummyjson.com/users/${post.userId}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              return { ...post, user: userData };
            }
            return post;
          } catch (error) {
            console.error(`Failed to fetch user data for post ${post.id}:`, error);
            return post;
          }
        })
      );
      
      // Sort posts based on selected option
      let sortedPosts = [...postsWithUsers];
      
      if (sortBy === 'likes') {
        sortedPosts.sort((a, b) => b.reactions - a.reactions);
      } else if (sortBy === 'popularity') {
        // For this demo, we'll sort by a combination of reactions and userId
        sortedPosts.sort((a, b) => (b.reactions + b.userId) - (a.reactions + a.userId));
      }
      // 'newest' is the default from the API
      
      return {
        ...data,
        posts: sortedPosts
      };
    },
    enabled: true
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    refetchPosts();
  };
  
  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag); // Debug log
    if (selectedTag === tag) {
      setSelectedTag(null); // Deselect if already selected
    } else {
      setSelectedTag(tag);
      setSearchQuery(''); // Clear search when selecting a tag
      setCurrentPage(1); // Reset to first page on new tag
    }
  };
  
  const handleClearFilters = () => {
    setSelectedTag(null);
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };
  
  const totalPages = postsData ? Math.ceil(postsData.total / postsPerPage) : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedElement 
        animation="fade-in" 
        className="py-16 text-center relative overflow-hidden" 
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(var(--primary-rgb), 0.2) 0%, transparent 50%), 
                              radial-gradient(circle at 75% 75%, rgba(var(--primary-rgb), 0.2) 0%, transparent 50%)`,
          backgroundSize: "cover"
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Social<span className="text-primary">Sphere</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Discover interesting posts, connect with others, and join the conversation.
          </p>
          
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="transition-transform hover:scale-105">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </AnimatedElement>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <TagsList 
              tags={tagsData?.tags || []} 
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
            />
            
            <QuickLinks />
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">
                {selectedTag ? `Posts tagged with #${selectedTag}` : 
                  searchQuery ? `Search results for "${searchQuery}"` : 
                  "Latest Posts"}
              </h2>
              
              <div className="flex items-center gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as 'newest' | 'likes' | 'popularity')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
                
                {(selectedTag || searchQuery || sortBy !== 'newest') && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    <Filter className="h-4 w-4 mr-2" /> Clear
                  </Button>
                )}
              </div>
            </div>
            
            {(postsLoading || tagsLoading) && (
              <div className="flex justify-center my-12">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
              </div>
            )}
            
            {(postsError || tagsError) && (
              <div className="text-center my-12 p-6 border border-destructive/20 rounded-lg bg-destructive/10">
                <h3 className="text-xl font-medium text-destructive mb-2">Error Loading Data</h3>
                <p className="text-muted-foreground">
                  {postsError instanceof Error ? postsError.message : 
                    tagsError instanceof Error ? tagsError.message :
                    "An unexpected error occurred"}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => refetchPosts()}
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {postsData && postsData.posts.length === 0 && (
              <div className="text-center my-12 p-6 border rounded-lg">
                <h3 className="text-xl font-medium mb-2">No Posts Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? `No results found for "${searchQuery}"` : 
                    selectedTag ? `No posts tagged with #${selectedTag}` : 
                    "No posts available at this time"}
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}
            
            {postsData && postsData.posts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transformPosts(postsData.posts).map((post, index) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      onTagClick={handleTagClick}
                      delay={index * 100}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show 5 pages at most, centered around current page
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else {
                        const leftOffset = Math.min(Math.max(0, currentPage - 3), totalPages - 5);
                        pageToShow = i + 1 + leftOffset;
                      }
                      
                      return (
                        <Button
                          key={pageToShow}
                          variant={currentPage === pageToShow ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageToShow)}
                        >
                          {pageToShow}
                        </Button>
                      );
                    })}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
