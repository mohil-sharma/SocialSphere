import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Phone, 
  Calendar, 
  Briefcase, 
  Cake,
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  Heart,
  X as XIcon,
  Loader2,
  BookOpen
} from 'lucide-react';
import { AnimatedElement } from '@/components/AnimatedElement';
import PostCard from '@/components/PostCard';
import { toast } from '@/lib/toast';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  birthDate: string;
  image: string;
  address: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    postalCode: string;
    state: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
  university: string;
  gender: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await fetch(`https://dummyjson.com/users/${id}`);
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        setUser(userData);

        const postsResponse = await fetch(`https://dummyjson.com/posts/user/${id}`);
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
      } catch (err: any) {
        setError(err.message || 'Failed to load user profile');
        toast.error(err.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <CardTitle className="text-lg font-semibold mb-4">Error</CardTitle>
            <CardDescription className="text-muted-foreground">
              {error || 'User not found.'}
            </CardDescription>
            <Button variant="outline" className="mt-4" onClick={goBack}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <AnimatedElement animation="slide-up">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="p-6 flex items-center space-x-4">
            <Button variant="ghost" onClick={goBack} className="absolute top-4 left-4 group hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user.image} alt={user.firstName} />
              <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription className="text-muted-foreground">@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultvalue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Personal Information</h4>
                    <Separator className="mb-3" />
                    <div className="text-muted-foreground space-y-2">
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {user.email}</p>
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {user.phone}</p>
                      <p className="flex items-center gap-2"><Cake className="h-4 w-4" /> {new Date(user.birthDate).toLocaleDateString()}</p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {user.address.address}, {user.address.city}, {user.address.state} {user.address.postalCode}
                      </p>
                      <Separator className="my-3" />
                      <h4 className="font-semibold text-sm mb-2">Academics</h4>
                      <Separator className="mb-3" />
                      <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {user.university}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Company Details</h4>
                    <Separator className="mb-3" />
                    <div className="text-muted-foreground space-y-2">
                      <p className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {user.company.name}</p>
                      <p className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {user.company.title} ({user.company.department})
                      </p>
                    </div>
                    <Separator className="my-3" />
                    <h4 className="font-semibold text-sm mb-2">Socials</h4>
                    <Separator className="mb-3" />
                    <div className="flex gap-3">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="posts" className="space-y-4">
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post, index) => (
                      <AnimatedElement key={post.id} animation="fade-in" delay={index * 100}>
                        <PostCard post={post} onTagClick={() => {}} />
                      </AnimatedElement>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Heart className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
                    <p className="text-lg text-muted-foreground">No posts available for this user.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedElement>
    </div>
  );
};

export default UserProfile;
