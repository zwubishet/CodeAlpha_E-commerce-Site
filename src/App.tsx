import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import CategoryFilter from './components/CategoryFilter';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const fetchProducts = async (search?: string) => {
    setLoading(true);
    try {
      const url = new URL('http://localhost:3001/api/products');
      if (search) {
        url.searchParams.append('search', search);
      }
      
      const response = await fetch(url.toString());
      const data = await response.json();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((product: Product) => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      fetchProducts(query);
    } else {
      fetchProducts();
    }
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header onSearch={handleSearch} />
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header onSearch={handleSearch} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-8 mb-8">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">Welcome to ShopHub</h1>
                <p className="text-xl text-blue-100">
                  Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, free shipping.
                </p>
              </div>
            </div>
            
            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </main>
          
          <ProductDetails
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;