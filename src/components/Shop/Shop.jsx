import React, { useEffect, useState } from "react";
// import { GrPrevious,GrNext } from 'react-icons/gr';
import { FcNext, FcPrevious } from "react-icons/fc";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  // const cart = useLoaderData()
  // pagination starts =================================================================
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  // const { count } = useLoaderData();
  // console.log(count); //76
  // const itemsPerPage = 10;
  const numberOfPages = Math.ceil(count / itemsPerPage); //8

  /* const pages = []
for(let i=0; i<numberOfPages;i++){
  pages.push(i)
}
console.log(pages); */

  // or short cut

  const pages = [...Array(numberOfPages).keys()]; //[0, 1, 2, 3, 4, 5, 6, 7]
  // console.log(pages);

  const handleItemsPerPage = (e) => {
    // console.log(e.target.value);
    const val = parseInt(e.target.value);
    // console.log(val);
    setItemsPerPage(val);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  // console.log(currentPage);
  /***
   * DONE 1 :get the total number of products
   * DONE 2: number of items per page dynamic
   * TODo 3: get the current page
   */

  useEffect(() => {
    fetch("https://ema-john-pagination-server-starter.vercel.app/productsCount")
      .then((response) => response.json())
      .then((data) => setCount(data.count));
  }, []);

  useEffect(() => {
    fetch(
      `https://ema-john-pagination-server-starter.vercel.app/products?page=${currentPage}&&size=${itemsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemsPerPage]);

  /*   useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]); */

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p>Current page : {currentPage}</p>

        <button onClick={handlePrevPage}>
          <FcPrevious></FcPrevious>
        </button>

        {pages.map((page) => (
          <button
            className={currentPage === page ? "selected" : undefined}
            onClick={() => setCurrentPage(page)}
            key={page}
          >
            {page}
          </button>
        ))}

        <button onClick={handleNextPage}>
          <FcNext></FcNext>
        </button>

        <select
          value={itemsPerPage}
          onChange={handleItemsPerPage}
          name=""
          id="select-btn"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
