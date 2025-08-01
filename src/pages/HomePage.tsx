import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageContent from '../components/PageContent.tsx';
import Button from '../components/Button.tsx';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Product[]>('https://fakestoreapi.com/products?limit=6');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <PageContent title="Welcome to Plant Paradise!" products={products}>
      <p className="text-lg mb-6">
        Discover a wide variety of plants, seeds, and gardening supplies to bring your green dreams to life.
        Whether you're a seasoned gardener or just starting, we have everything you need.
      </p>
      <Button>Explore Products</Button>
      {loading && <p className="mt-4">Loading products...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </PageContent>
  );
};

export default HomePage;
