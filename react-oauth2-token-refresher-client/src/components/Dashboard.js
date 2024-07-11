import React, { useState, useEffect } from "react";

const Dashboard = ({ axiosInstance }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredResponse = await axiosInstance.get("/featured-products");
        const recommendedResponse = await axiosInstance.get(
          "/recommended-products"
        );
        const popularResponse = await axiosInstance.get("/popular-products");

        setFeaturedProducts(featuredResponse.data.products);
        setRecommendedProducts(recommendedResponse.data.products);
        setPopularProducts(popularResponse.data.products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [axiosInstance]);

  return (
    <div>
      <h2>Dashboard</h2>
      <section>
        <h3>Featured Products</h3>
        <ul>
          {featuredProducts.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Recommended Products</h3>
        <ul>
          {recommendedProducts.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Popular Products</h3>
        <ul>
          {popularProducts.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
