
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { Search as SearchIcon, Filter, SortAsc, SortDesc, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchTerm, setSearchTerm] = useState(queryParams.get('q') || '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const postsPerPage = 10;
  
  useEffect(() => {
    // Extract search query from URL if present
    const queryParam = queryParams.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
      performSearch(queryParam);
    } else {
      // Fetch all posts if no search term
      fetchAllPosts();
    }
    
    // Fetch all available tags
    fetchAllTags();
  }, [location.search]);
  
  const fetchAllTags = async () => {
    try {
      // Fetch some posts to extract unique tags
      const response = await fetch('https://dummyjson.com/posts?limit=50');
      const data = await response.json();
      
      // Extract all unique tags
      const uniqueTags = Array.from(
        new Set(data.posts.flatMap((post: Post) => post.tags))
      );
      
      setAllTags(uniqueTags as string[]);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };
  
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * postsPerPage;
      const response = await fetch(
        `https://dummyjson.com/posts?limit=${postsPerPage}&skip=${skip}&select=id,title,body,userId,tags,reactions`
      );
      const data = await response.json();
      
      // Get user data for each post
      const postsWithUsers = await addUsersToPosts(data.posts);
      
      setPosts(postsWithUsers);
      setTotalResults(data.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };
  
  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      // Use the DummyJSON search endpoint
      const response = await fetch(`https://dummyjson.com/posts/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Get user data for each post
      const postsWithUsers = await addUsersToPosts(data.posts);
      
      setPosts(postsWithUsers);
      setTotalResults(data.total || data.posts.length);
    } catch (error) {
      console.error('Error searching posts:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };
  
  const addUsersToPosts = async (posts: Post[]) => {
    if (posts.length === 0) return [];
    
    // Get all unique user IDs
    const userIds = [...new Set(posts.map(post => post.userId))];
    
    // Fetch user data for all posts at once
    const userPromises = userIds.map(userId => 
      fetch(`https://dummyjson.com/users/${userId}`).then(res => res.json())
    );
    
    const users = await Promise.all(userPromises);
    
    // Add user data to each post
    return posts.map(post => {
      const user = users.find(user => user.id === post.userId);
      return { ...post, user };
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Update URL with search query
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    performSearch(searchTerm);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    let sortedPosts = [...posts];
    
    switch (value) {
      case 'reactions-desc':
        sortedPosts.sort((a, b) => b.reactions - a.reactions);
        break;
      case 'reactions-asc':
        sortedPosts.sort((a, b) => a.reactions - b.reactions);
        break;
      case 'title-asc':
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order
        break;
    }
    
    setPosts(sortedPosts);
  };
  
  // Filter posts based on selected tags
  const filteredPosts = selectedTags.length > 0
    ? posts.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      )
    : posts;
  
  const totalPages = Math.ceil(totalResults / postsPerPage);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Home
        </Button>
        <h1 className="text-2xl font-bold">Search</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar: Filters */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium flex items-center mb-3">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Tags
              </h2>
              <Separator className="mb-3" />
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              {selectedTags.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full mt-3"
                  onClick={() => setSelectedTags([])}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium flex items-center mb-3">
                {sortBy.includes('asc') ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Sort Results
              </h2>
              <Separator className="mb-3" />
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="reactions-desc">Most Popular</SelectItem>
                  <SelectItem value="reactions-asc">Least Popular</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content: Search and Results */}
        <div className="md:col-span-3">
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {totalResults > 0 ? (
                <>
                  Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
                  {searchTerm ? ` for "${searchTerm}"` : ''}
                  {selectedTags.length > 0 ? ` with tags: ${selectedTags.map(t => `#${t}`).join(', ')}` : ''}
                </>
              ) : (
                'No results found'
              )}
            </p>
          </div>
          
          {loading ? (
            // Loading skeletons
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 w-4/5 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-2/3 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card 
                      key={post.id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar 
                            className="cursor-pointer border border-border"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/${post.userId}`);
                            }}
                          >
                            <AvatarImage src={post.user?.image} />
                            <AvatarFallback>
                              {post.user?.firstName?.charAt(0)}
                              {post.user?.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p 
                              className="text-sm font-medium line-clamp-1 hover:underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/user/${post.userId}`);
                              }}
                            >
                              {post.user?.firstName} {post.user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">@{post.user?.username}</p>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-3">{post.body}</p>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="cursor-pointer hover:bg-secondary/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagToggle(tag);
                                }}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button onClick={() => {
                      setSearchTerm('');
                      setSelectedTags([]);
                      navigate('/search');
                      fetchAllPosts();
                    }}>
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Pagination */}
              {filteredPosts.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <Button 
                    variant="outline" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
