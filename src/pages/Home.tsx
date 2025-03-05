
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/PostCard';

const Home = () => {
  const navigate = useNavigate();
  
  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${tag}`);
  };
  
  // This is a placeholder component, actual Home functionality is in Index.tsx
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is a redirect to Index page</p>
    </div>
  );
};

export default Home;
