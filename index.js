const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_51Q2vFdKPAodQ0QN0QqE7l7ZFXbJvKkpLwHUcDSSELx3lTpCLEzMg8MREAMyHRBGl4y4JPF0gMWm4yD0YRSq36hpT00pUnpe0jR');
const app = express();
const port = 5000;

app.use(cors()); 

app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb+srv://rkraushan0303:0Mgj5EjPS3kH02Tm@cluster0.gayqh.mongodb.net/porduct', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discountPercentage: { type: Number },
  imageUrl: { type: String, required: true },
  highlights: [{ type: String }],
  specifications: [
    {
      featureName: String,
      featureValue: String,
    }
  ],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalReviews: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 0, max: 5, required: true },
      reviewTitle: String,
      reviewBody: String,
      reviewDate: { type: Date, default: Date.now },
      images: [{ type: String }],
      helpfulCount: { type: Number, default: 0 },
    }
  ],
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  availableFor: [{ type: String }],
  deliveryCharge: { type: Number, default: 0 },
  deliveryOptions: [
    {
      method: String,
      estimatedDelivery: String,
    }
  ],
  warranty: { type: String, default: 'No warranty' },
  returnPolicy: { type: String, default: 'No returns accepted' },
  brand: { type: String },
  category: { type: String },
  seller: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);


const seedProducts = async () => {
  try {
    await Product.deleteMany({});

    const initialProducts = [
      {
        name: "Samsung Galaxy S21",
        description: "Flagship smartphone with powerful performance.",
        color: "Phantom Black",
        size: "128GB",
        currentPrice: 79999,
        originalPrice: 99999,
        discountPercentage: 20,
        imageUrl: "https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
        highlights: [
          "8GB RAM",
          "Exynos 2100",
          "Dynamic AMOLED 2X",
          "5G enabled"
        ],
        specifications: [
          { featureName: "RAM", featureValue: "8GB" },
          { featureName: "Battery", featureValue: "4000mAh" },
          { featureName: "Display", featureValue: "6.2 inches" }
        ],
        rating: 4.5,
        totalReviews: 1567,
        inStock: true,
        stockCount: 50,
        deliveryCharge: 0,
        warranty: "1 year manufacturer warranty",
        returnPolicy: "10 days replacement only",
        brand: "Samsung",
        category: "Mobile Phones",
        seller: "Samsung Official Store",
      },
      {
        name: "Apple iPhone 13",
        description: "Latest model with advanced features.",
        color: "Starlight",
        size: "256GB",
        currentPrice: 89999,
        originalPrice: 99999,
        discountPercentage: 10,
        imageUrl: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwcGxlfGVufDB8fDB8fHww",
        highlights: [
          "Super Retina XDR Display",
          "A15 Bionic chip",
          "5G capable",
          "12MP Dual camera system"
        ],
        specifications: [
          { featureName: "RAM", featureValue: "4GB" },
          { featureName: "Battery", featureValue: "3095mAh" },
          { featureName: "Display", featureValue: "6.1 inches" }
        ],
        rating: 4.7,
        totalReviews: 2000,
        inStock: true,
        stockCount: 30,
        deliveryCharge: 0,
        warranty: "1 year manufacturer warranty",
        returnPolicy: "14 days return accepted",
        brand: "Apple",
        category: "Mobile Phones",
        seller: "Apple Official Store",
      },
      {
        name: "OnePlus 9",
        description: "Performance and photography combined.",
        color: "Morning Mist",
        size: "128GB",
        currentPrice: 49999,
        originalPrice: 62999,
        discountPercentage: 20,
        imageUrl: "https://images.unsplash.com/photo-1527747471697-174c755627dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b25lcGx1c3xlbnwwfHwwfHx8MA%3D%3D",
        highlights: [
          "Snapdragon 888",
          "120Hz Fluid Display",
          "Hasselblad Camera",
          "65W fast charging"
        ],
        specifications: [
          { featureName: "RAM", featureValue: "8GB" },
          { featureName: "Battery", featureValue: "4500mAh" },
          { featureName: "Display", featureValue: "6.55 inches" }
        ],
        rating: 4.5,
        totalReviews: 1500,
        inStock: true,
        stockCount: 45,
        deliveryCharge: 0,
        warranty: "1 year manufacturer warranty",
        returnPolicy: "15 days return accepted",
        brand: "OnePlus",
        category: "Mobile Phones",
        seller: "OnePlus Official Store",
      }
    ];

  
    await Product.insertMany(initialProducts);
    console.log('Products seeded to database');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

seedProducts();

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // add to cart route

app.post('/api/cart/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log("products id",productId)

    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });

   
    let cart = await Cart.findOne({}); 

    if (cart) {
     
      const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
      
      if (productIndex > -1) {
   
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        products: [{ product: productId, quantity }],
        totalAmount: 0
      });
    }

    cart.totalAmount = cart.products.reduce((total, item) => {
      return total + (item.quantity * product.currentPrice);
    }, 0);

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update from the cart (increment or decrement item quantity)
app.post('/api/cart/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({});
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
      cart.totalAmount = cart.products.reduce((total, item) => {
        const price = item.product?.currentPrice;
        const quantity = item.quantity;
        if (typeof price === 'number' && typeof quantity === 'number') {
          return total + (quantity * price);
        }
        return total; 
      }, 0);

      await cart.save();
      res.status(200).json({ message: 'Cart updated', cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Remove a product from the cart
app.post('/api/cart/remove', async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({});
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalAmount = cart.products.reduce((total, item) => {
        const price = item.product.currentPrice || 0; 
        return total + (item.quantity * price); 
      }, 0).toFixed(2); 

      await cart.save();
      res.status(200).json({ message: 'Product removed from cart', cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Proceed to payment


app.post('/api/cart/checkout', async (req, res) => {
  try {
    // Fetch the cart and populate product details
    const cart = await Cart.findOne({}).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // Calculate total amount
    const totalAmount = cart.products.reduce((total, item) => {
      return total + item.quantity * item.product.currentPrice;
    }, 0);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert amount to cents
      currency: 'usd', // Use the desired currency
    });

    // Here, you should send the client secret back to the frontend
    res.status(200).json({ 
      message: 'Payment intent created', 
      clientSecret: paymentIntent.client_secret, // Send the client secret to the frontend
      totalAmount 
    });

    // If payment is successful (handled on the frontend), clear the cart
    // You should implement a webhook to listen for payment success events and clear the cart there
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    let cart = await Cart.findOne({});
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart = await Cart.findById(cart._id).populate('products.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
