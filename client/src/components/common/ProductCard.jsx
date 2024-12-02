// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/product/${product._id}`}
      className="overflow-hidden transition-shadow bg-white border rounded-lg hover:shadow-lg group"
    >
      {/* Product Image */}
      <div className="relative aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        {product.salePrice && (
          <div className="absolute px-2 py-1 text-xs text-white bg-red-500 rounded top-2 right-2">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="mb-2 font-medium text-gray-800 line-clamp-2 group-hover:text-blue-500">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <>
                <span className="font-bold text-red-500">${product.salePrice}</span>
                <span className="ml-2 text-gray-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="font-bold text-gray-900">${product.price}</span>
            )}
          </div>
          <button 
            className="p-2 text-gray-500 transition-colors hover:text-blue-500"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;