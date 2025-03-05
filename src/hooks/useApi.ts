
import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: boolean;
  requiresAuth?: boolean;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: (params?: Record<string, string>) => Promise<T | null>;
}

function useApi<T>(url: string, options: ApiOptions = {}): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    fetchData: async () => null,
  });

  // Create the fetchData function
  const fetchData = async (params?: Record<string, string>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

      // Add authentication header if required
      if (options.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Add query parameters if provided
      let fetchUrl = url;
      if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        fetchUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }

      const requestOptions: RequestInit = {
        method: options.method || 'GET',
        headers,
      };

      if (options.body && options.method !== 'GET') {
        requestOptions.body = JSON.stringify(options.body);
      }

      console.log(`Fetching ${fetchUrl} with options:`, requestOptions);
      const response = await fetch(fetchUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setState(prev => ({ ...prev, data, loading: false, error: null }));
      return data;
    } catch (error) {
      if (error instanceof Error) {
        // Only handle non-abort errors
        if (error.name !== 'AbortError') {
          console.error('API request failed:', error);
          toast.error('Failed to fetch data');
          setState(prev => ({ ...prev, data: null, loading: false, error }));
        }
      }
      return null;
    }
  };

  // Initialize state with the fetchData function
  useEffect(() => {
    setState(prev => ({
      ...prev,
      fetchData,
    }));
  }, [url, options.method, options.cache]);

  return {
    ...state,
    fetchData,
  };
}

export default useApi;
