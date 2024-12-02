import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../../features/product/productApi';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { data: products, isLoading } = useGetProductsQuery({ page: 1, limit: 8 });
  console.log(products);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-100">
        <div className="absolute inset-0">
          <img
            src="/hero-image.jpg"
            alt="Hero"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="container relative flex items-center h-full px-4 mx-auto">
          <div className="max-w-xl text-white">
            <h1 className="mb-4 text-5xl font-light">New Collection</h1>
            <p className="mb-8 text-xl">Discover our latest products</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3 text-gray-900 bg-white hover:bg-gray-100"
            >
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Our Products</h2>
            <Link 
              to="/shop" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {(products?.data || []).map((product) => (
                <Link 
                  key={product._id}
                  to={`/product/${product._id}`} 
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
                    />
                    {product.salePrice && (
                      <span className="absolute px-2 py-1 text-xs text-white bg-red-500 top-2 right-2">
                        SALE
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-gray-900 transition-colors group-hover:text-gray-600">
                      {product?.name || ""}
                    </h3>
                    <div className="mt-1">
                      {product?.salePrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500">${product.salePrice}</span>
                          <span className="text-gray-500 line-through">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-gray-900">${product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { title: 'Free Shipping', text: 'On orders over $50' },
              { title: 'Easy Returns', text: '30-day return policy' },
              { title: 'Secure Payments', text: 'Safe & Fast' },
              { title: 'Support', text: 'Always here to help' }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <h3 className="mb-2 text-xl font-light">{feature.title}</h3>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;