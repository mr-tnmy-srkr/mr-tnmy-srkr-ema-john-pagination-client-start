import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async () => {
  // if cart data is in database, you have to use async await
  const storedCart = getShoppingCart();
  const storedCartIds = Object.keys(storedCart);
  // console.log(storedCart);
  console.log(storedCartIds);

  const loadedProducts = await fetch(
    "https://ema-john-pagination-server-starter.vercel.app/productByIds",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storedCartIds),
    }
  );
  const products = await loadedProducts.json();

  const savedCart = [];

  for (const id in storedCart) {
    const addedProduct = products.find((pd) => pd._id === id);
    if (addedProduct) {
      const quantity = storedCart[id];
      addedProduct.quantity = quantity;
      savedCart.push(addedProduct);
    }
  }

  // if you need to send two things
  // return [products, savedCart]
  // another options
  // return { products, cart: savedCart }

  return savedCart;
};

export default cartProductsLoader;
