
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // If using demo credentials, auto-succeed
      if (username === 'kminchelle' && password === '0lelplR') {
        // Simulate a delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create mock user data
        const userData = {
          id: 1,
          username: 'kminchelle',
          email: 'kminchelle@example.com',
          firstName: 'Jeanne',
          lastName: 'Halvorson',
          gender: 'female',
          image: 'https://robohash.org/kminchelle',
          token: 'mock-jwt-token-for-demo'
        };
        
        // Store the token in localStorage
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Login successful!');
        
        // Redirect to home page
        navigate('/');
        return;
      }
      
      // For all other credentials, attempt real API login
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('Login successful!');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Add demo login hint
  const loginSampleUser = () => {
    setUsername('kminchelle');
    setPassword('0lelplR');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to Social<span className="text-primary">Sphere</span>
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>
                For demo purposes, you can use the following credentials:
              </p>
              <p className="font-medium mt-1">
                Username: kminchelle, Password: 0lelplR
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="p-0 h-auto mt-1 text-primary"
                onClick={loginSampleUser}
              >
                Use sample login
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <span>Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-primary"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
              <span className="mx-2">or</span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-primary"
                onClick={() => navigate('/')}
              >
                Continue as guest
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
