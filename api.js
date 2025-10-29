class Product {
    constructor(id, name, imgUrl, price, brand, available, inStock, category, discount, otherFeatures, description, ratings, numberOfRatings, reviews, specifications) {
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.price = price;
        this.brand = brand;
        this.available = available;
        this.inStock = inStock;
        this.category = category;
        this.discount = discount;
        this.otherFeatures = otherFeatures;
        this.description = description;
        this.ratings = ratings;
        this.numberOfRatings = numberOfRatings;
        this.reviews = reviews;
        this.specifications = specifications;
    }
}

class User {
    constructor(name, age, gender, address, phone, email, password, premium) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.premium = premium;
        this.cart = [];
        this.order = [];
        this.daily = [];
        this.wishlist = [];
    }
}

class CartItems {
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

class OrderItems {
    constructor(cartItem, address, delivery, status, payment, method){
        this.productId = cartItem.productId;
        this.quantity = cartItem.quantity;
        this.address = address;
        this.delivery = delivery;
        this.status = status;
        this.payment = payment;
        this.method = method;
    }
}

class DailyOrder {
    constructor(productId, quantity){
        this.productId = productId;
        this.defaultQuantity = quantity;
        this.nextDeliveryQuantity = quantity;
    }
}

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const users = [
    new User("Alice Smith", 28, "Female", "123 Maple Street, NY", 1234567890, "alice@example.com", 'changeme@123', true),
    new User("Bob Johnson", 34, "Male", "456 Oak Avenue, CA", 2345678901, "bob@example.com", 'changeme@123', false),
    new User("Charlie Ray", 22, "Male", "789 Pine Lane, TX", 3456789012, "charlie@example.com", 'changeme@123', true),
    new User("Diana Moore", 30, "Female", "321 Cedar Blvd, FL", 4567890123, "diana@example.com", 'changeme@123', false),
    new User("Ethan Lee", 40, "Male", "654 Birch Road, WA", 5678901234, "ethan.patel@example.com", 'changeme@123', true)
];

app.get('/user/:email/:phone', (req, res) => {
    let email = req.params.email;
    let phone = req.params.phone;
    user = users.find((val) => {return phone == val.phone || email == val.email});
    if(!user)
        return res.status(404).json({ message : "User not found" });
    res.status(200).json(user);
});

app.post('/user/create', (req, res) => {
    const { name, age, gender, address, phone, email, password, premium } = req.body;
    if(!name || !email || !phone || !password)
        return res.status(400).json({ message: 'Required fields are missing' });

    if(name.trim().length < 2)
        return res.status(400).json({ message: 'Invalid name' });
    if(!/^\d{10}$/.test(phone))
        return res.status(400).json({ message: 'Invalid phone number' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
        return res.status(400).json({ message: 'Invalid email address' });
    if(password.length < 6)
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    
    const existingUser = users.find((ele) => {return (ele.email == email || ele.phone == phone)});
    if(existingUser)
        return res.status(400).json({ message: "User already exists" });

    const newUser = new User(name, age, gender, address, phone, email, password, premium);
    users.push(newUser);
    res.status(201).json({ message: "User created", user: newUser });
});

app.post('/user/login', (req, res) => {
    let credentials = req.body;
    let logger = users.find((ele) => {return (ele.email == credentials.email || ele.phone == credentials.phone) && (ele.password == credentials.password)});
    if(logger)
        res.status(200).json(logger);
    else
        res.status(404).json();
});

// app.get('/products', (req, res) => {
//     if(req.query.category != undefined)
//         res.json(products.filter((product) => { return product.category == req.query.category}));
//     else if(req.query.filter != undefined){
//         filterText = req.query.filter.toLowerCase();
//         let category = new Set([]);
//         let brand = new Set([]);
//         let rating = new Set([]);
//         let discount = new Set([]);
//         let filteredProducts = products.filter((product) => Object.values(product).some(value => {
//             if(value?.toString().toLowerCase().includes(filterText)){
//                 brand.add(product.brand);
//                 category.add(product.category);
//                 if(product.ratings)
//                     rating.add(product.rating);
//                 if (typeof product.discount === 'number'){
//                     let bucketStart = Math.floor(product.discount / 10) * 10;
//                     let bucketEnd = bucketStart + 10;
//                     discount.add(`${bucketStart}% - ${bucketEnd}%`);
//                 }
//                 else
//                     discount.add('none');
//                 return value;
//             }
//         }));
//         let dynamicFilters = { 'rating': [...rating], 'discount': [...discount] };
//         res.json({products: filteredProducts, brand: [...brand], category: [...category], dynamicFilters: dynamicFilters});
//     }
//     else
//         res.json(products);
// });

app.get('/products', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let resultProducts = [];
    let totalProducts = 0;

    // Category filter
    if (req.query.category !== undefined && req.query.filter === undefined)
        return res.json({
            products: products.filter((product) => product.category == req.query.category).slice(startIndex, endIndex),
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        });

    // Text filter with dynamic filters
    else if (req.query.filter !== undefined) {
        let filterText = req.query.filter.toLowerCase();
        let category = new Set([]);
        let brand = new Set([]);
        let rating = new Set([]);
        let discount = new Set([]);
        let filteredProducts = products.filter((product) =>
            Object.values(product).some((value) => {
                if (value?.toString().toLowerCase().includes(filterText)){
                    brand.add(product.brand);
                    category.add(product.category);
                    if (product.ratings)
                        rating.add(product.rating);
                    if (typeof product.discount === "number"){
                        let bucketStart = Math.floor(product.discount / 10) * 10;
                        let bucketEnd = bucketStart + 10;
                        discount.add(`${bucketStart}% - ${bucketEnd}%`);
                    }
                    else
                        discount.add("none");
                    return true;
                }
                return false;
            })
        );
        totalProducts = filteredProducts.length;

        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        let dynamicFilters = {
            rating: [...rating],
            discount: [...discount],
        };
        return res.json({
            products: paginatedProducts,
            brand: [...brand],
            category: [...category],
            dynamicFilters: dynamicFilters,
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        });
    }
    // No filter — return all products
    else
        resultProducts = products;

    totalProducts = resultProducts.length;
    const paginatedProducts = resultProducts.slice(startIndex, endIndex);
    res.json({
        products: paginatedProducts,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
    });
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if(!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

app.post('/users/:email/cart', (req, res) => {
    const email = req.params.email;
    const { productId, quantity } = req.body;
    const user = users.find(user => user.email === email);
    const product = products.find(p => p.id === productId);
    if(!user || !product)
        return res.status(404).json({ message: "User or product not found" });

    const existingCartItemIndex = user.cart.findIndex(item => item.productId === productId);
    if(existingCartItemIndex !== -1){
        user.cart[existingCartItemIndex].quantity += quantity;
        if(user.cart[existingCartItemIndex].quantity < 1){
            user.cart.splice(existingCartItemIndex, 1);
            return res.status(200).json({ message: "Item removed from cart", cart: user.cart });
        }
        return res.status(200).json({ message: "Cart updated", cart: user.cart });
    }
    else if(quantity > 0)
        user.cart.push(new CartItems(product.id, quantity));
    res.status(200).json({ message: "Added to cart", cart: user.cart });
});

app.patch('/users/:email/cartItem', (req, res) => {
    const email = req.params.email;
    const { productId, quantity } = req.body;
    const user = users.find(user => user.email == email);
    if(!user)
        return res.status(404).json({ message: "User or product not found" });
    const item = user.cart.find(item => item.productId == productId);
    if(!item)
        return res.status(404).json({ message: "Product not found in cart" });
    if(quantity > 0)
        item.quantity = quantity;
    res.status(200).json({ message: "Cart updated" });
});

app.delete('/users/:email/cart/clear', (req, res) => {
    const user = users.find(u => u.email === req.params.email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    user.cart = [];
    res.status(200).send();
});

app.delete('/users/:email/cartItem/:id', (req, res) => {
    const user = users.find(u => u.email == req.params.email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    const id = req.params.id;
    const cartItemIndex = user.cart.findIndex(ci => ci.productId == id);
    if(cartItemIndex == -1)
        return res.status(404).json({ message: "Item not found in cart" });
    user.cart.splice(cartItemIndex, 1);
    user.cart = [];
    res.status(200).send({ message: "Item removed from cart", cart: user.cart});
});

app.get('/users/:email/cart', (req, res) => {
    const user = users.find(u => u.email === req.params.email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
});

app.post('/users/:email/order', (req, res) => {
    const { email } = req.params;
    const { address, date, payment ,method } = req.body;
    
    const user = users.find(u => u.email === email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    if(user.cart == undefined || user.cart.length == 0)
        return res.status(400).json({ message: 'Cart is empty' });

    products.forEach(product => {
        user.cart.forEach(item => {
            if(item.productId == product.id)
                product.quantity -= item.quantity;
        });
    });
    const orderItems = user.cart.map((item) => new OrderItems(item, address, date, 'Processing', payment, method));
    user.order.push(...orderItems);
    user.cart = [];
    res.status(200).json({ message: "Items ordered", order: user.order });
});

app.delete('/users/:email/order/:productId', (req, res) => {
    const { email, productId } = req.params;
    const user = users.find(u => u.email === email);

    if(!user)
        return res.status(404).json({ message: "User not found" });
    const orderIndex = user.order.findIndex(order => order.productId === productId);
    if(orderIndex === -1)
        return res.status(404).json({ message: "Order not found" });

    const product = products.find(product => product.id === productId);
    product.inStock += user.order[orderIndex].quantity;
    user.order.splice(orderIndex, 1);

    res.status(200).json({ message: "Order deleted successfully", order: user.order });
});

app.get('/users/:email/order', (req, res) => {
    const user = users.find(u => u.email === req.params.email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user.order);
});

app.post('/users/:email/daily', (req, res) => {
    const email = req.params.email;
    const { productId, quantity } = req.body;
    const user = users.find(u => u.email === email);
    const product = products.find(p => p.id === productId);
    if(!user || !product)
        return res.status(404).json({ message: "User or product not found" });
    const existingDailyItemIndex = user.daily.findIndex(ci => ci.productId === productId);
    if(existingDailyItemIndex !== -1)
        return res.status(200).json({ message: "Already in daily list", daily: user.daily });
    else if(quantity > 0)
        user.daily.push(new DailyOrder(product.id, quantity));
    res.status(200).json({ message: "Added to daily list", cart: user.daily });
});

app.get('/users/:email/daily', (req, res) => {
    const user = users.find(u => u.email === req.params.email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user.daily);
});

app.delete('/users/:email/daily/:productId', (req, res) => {
    const { email, productId } = req.params;
    const user = users.find(u => u.email === email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    const dailyIndex = user.daily.findIndex(val => val.productId === productId);
    if(dailyIndex === -1)
        return res.status(404).json({ message: "daily order not found" });
    user.daily.splice(dailyIndex, 1);
    res.status(200).json({ message: "Daily order deleted successfully", daily: user.daily });
});

app.patch('/users/:email/daily', (req, res) => {
    const email = req.params.email;
    const { productId, quantity, temporary } = req.body;
    const user = users.find(u => u.email === email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    const dailyIndex = user.daily.findIndex(val => val.productId === productId);
    if(dailyIndex === -1)
        return res.status(404).json({ message: "Daily order not found" });
    user.daily[dailyIndex].nextDeliveryQuantity = quantity;
    if(!temporary)
        user.daily[dailyIndex].defaultQuantity = quantity;
    res.status(200).json({ message: "Daily order updated successfully", daily: user.daily });
});

app.post('/users/:email/wishlist/', (req, res) => {
    const email = req.params.email;
    const productId = req.body.id;
    const user = users.find(val => val.email === email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    const index = user.wishlist.findIndex(val => val === productId);
    if(index != -1)
        return res.json({message: 'Already exist'});
    user.wishlist.push(productId);
    res.status(200).json({ message: "Added to wishlist" });
});

app.get('/users/:email/wishlist', (req, res) => {
    const email = req.params.email;
    const user = users.find(val => val.email === email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user.wishlist);
});

app.delete('/users/:email/wishlist/:productId', (req, res) => {
    const { email, productId } = req.params;
    const user = users.find(val => val.email === email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    const wishlistIndex = user.wishlist.findIndex(val => val === productId);
    if(wishlistIndex === -1)
        return res.status(404).json({ message: "Product not found in wishlist" });
    user.wishlist.splice(wishlistIndex, 1);
    res.status(200).json({ message: "Product removed from wishlist" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const products = [
    { id: "G1H2I3J4K5", name: "Tata Salt", imgUrl: "assets/salt.webp", price: 20, brand: "Tata", available: true, inStock: 50, category: "groceries", discount: 0, otherFeatures: { weight: "1kg" }, description: "Tata Salt is India's most trusted and popular iodized salt brand, ensuring purity and essential nutrients for everyday cooking.", ratings: 4.5, numberOfRatings: 220, reviews: [
        {
          name: "Amit Sharma",
          rating: 5,
          date: new Date("2024-12-01"),
          comment: "Consistently good quality and clean salt. My go-to choice!"
        },
        {
          name: "Rina Das",
          rating: 4,
          date: new Date("2025-02-10"),
          comment: "Affordable and reliable product for daily use."
        }
      ], specifications: [{ type: "Iodized", purity: "99%", packType: "Pouch" }] },
    { id: "L6M7N8O9P0", name: "Aashirvad Aata", imgUrl: "assets/aata.webp", price: 45, brand: "Aashirvaad", available: true, inStock: 30, category: "groceries", discount: 5, otherFeatures: { weight: "5kg" }, description: "Aashirvaad Whole Wheat Atta is made from the finest grains, ensuring soft and fluffy rotis every time. Contains natural fiber and nutrients.", ratings: 4.6, numberOfRatings: 150, reviews: [
        {
          name: "Neha Kapoor",
          rating: 5,
          date: new Date("2025-01-05"),
          comment: "Excellent texture and taste. Makes rotis very soft."
        }
      ], specifications: [{ type: "Whole Wheat", gluten: "Moderate", origin: "India" }] },
    { id: "Q1R2S3T4U5", name: "Amul Butter", imgUrl: "assets/butter.webp", price: 60, brand: "Amul", available: true, inStock: 20, category: "groceries", discount: 10, otherFeatures: { weight: "500g" }, description: "Amul Butter is made from pure milk fat and delivers a rich, creamy flavor that's perfect for spreading, cooking, and baking.", ratings: 4.8, numberOfRatings: 300, reviews: [
        {
          name: "Rohit Mehta",
          rating: 5,
          date: new Date("2024-11-15"),
          comment: "Iconic taste. Best butter in the market!"
        }
      ], specifications: [{ type: "Salted", fatContent: "82%", shelfLife: "6 months" }] },
    { id: "V6W7X8Y9Z0", name: "Britannia Biscuit", imgUrl: "assets/biscuit.webp", price: 25, brand: "Britannia", available: true, inStock: 100, category: "groceries", discount: 2, otherFeatures: { flavor: "Treat", weight: "200g" }, description: "Crunchy and delicious Treat biscuits from Britannia with a creamy center, ideal for snacks and tea time treats." },
    { id: "A2B3C4D5E6", name: "Nescafe Coffee", imgUrl: "assets/coffee.webp", price: 150, brand: "Nestlé", available: true, inStock: 40, category: "groceries", discount: 8, otherFeatures: { weight: "200g" }, description: "Nescafe Classic Instant Coffee delivers a rich aroma and smooth flavor in every cup, perfect for your daily caffeine fix.", ratings: 4.3, numberOfRatings: 180, reviews: [
        {
          name: "Priya Verma",
          rating: 4,
          date: new Date("2025-03-21"),
          comment: "Strong and aromatic coffee. Gives a good kickstart to the day."
        }
      ], specifications: [{ roast: "Medium", form: "Powder", caffeine: "Medium" }] },
    { id: "D1E2F3G4H5", name: "Dove Soap", imgUrl: "assets/soap.webp", price: 35, brand: "Dove", available: true, inStock: 50, category: "personal_care", discount: 5, otherFeatures: { weight: "100g" }, description: "Dove Beauty Bar is enriched with ¼ moisturizing cream and mild cleansers, helping your skin retain its natural moisture.", ratings: 4.7, numberOfRatings: 290, reviews: [
        {
          name: "Sneha Kulkarni",
          rating: 5,
          date: new Date("2025-04-08"),
          comment: "Leaves skin soft and smooth, unlike other soaps."
        }
      ], specifications: [{ type: "Moisturizing", pH: "Neutral", skinType: "All" }] },
    { id: "W1X2Y3Z4A5", name: "Ariel Detergent Powder", imgUrl: "assets/detergent.webp", price: 150, brand: "Ariel", available: true, inStock: 40, category: "household", discount: 10, otherFeatures: { weight: "1kg" }, description: "Ariel Matic provides brilliant cleaning on both whites and colored clothes while keeping fabrics bright and fresh.", ratings: 4.4, numberOfRatings: 175, reviews: [
        {
          name: "Kiran Rao",
          rating: 4,
          date: new Date("2025-01-18"),
          comment: "Great cleaning power. Smells fresh after wash."
        }
      ], specifications: [{ suitableFor: "Top Load", fragrance: "Fresh", format: "Powder" }] },
    { id: "S1T2U3V4W5", name: "Lay's Chips", imgUrl: "assets/chips.webp", price: 20, brand: "Lay's", available: true, inStock: 100, category: "snacks", discount: 10, otherFeatures: { flavor: "Classic Salted", weight: "50g" }, description: "Lay’s Classic Salted Chips offer light, crispy texture and irresistible flavor, perfect for any snacking moment.", ratings: 4.2, numberOfRatings: 90, reviews: [
        {
          name: "Rahul Jaiswal",
          rating: 4,
          date: new Date("2025-05-02"),
          comment: "Crunchy and addictive! Could use slightly less salt though."
        }
      ], specifications: [{ flavor: "Salted", packaging: "Single Pack", shelfLife: "6 months" }] },
    { id: "A1B2C3D4E5", name: "Bananas", imgUrl: "assets/bananas.webp", price: 40, brand: "Local", available: true, inStock: 200, category: "fruits", discount: 0, otherFeatures: { weight: "1kg" }, description: "Fresh, ripe bananas rich in potassium and perfect as a healthy snack or for smoothies, desserts, and cooking.", ratings: 4.1, numberOfRatings: 85, specifications: [{ type: "Cavendish", ripeness: "Ripe", origin: "India" }] },
    { id: "F6G7H8I9J0", name: "Tomatoes", imgUrl: "assets/tomatoes.webp", price: 30, brand: "Local", available: true, inStock: 150, category: "vegetables", discount: 5, otherFeatures: { weight: "1kg" }, description: "Juicy, fresh tomatoes packed with flavor and nutrients. Ideal for cooking and salads.", ratings: 4.3, numberOfRatings: 70, specifications: [{ type: "Roma", freshness: "High", origin: "India" }] },
    { id: "K1L2M3N4O5", name: "Potatoes", imgUrl: "assets/potatoes.webp", price: 25, brand: "Local", available: true, inStock: 180, category: "vegetables", discount: 10, otherFeatures: { weight: "1kg" }, description: "Firm, versatile potatoes perfect for boiling, frying, or baking with consistent texture.", ratings: 4.0, numberOfRatings: 60, reviews: [{ name: "Ajay Singh", rating: 4, date: new Date("2025-05-01"), comment: "Good quality and lasts well." }], specifications: [{ type: "Desi", skin: "Brown", origin: "Local Farms" }] },
    { id: "X6Y7Z8A9B0", name: "Pepsi Soft Drink", imgUrl: "assets/pepsi.webp", price: 40, brand: "Pepsi", available: true, inStock: 150, category: "beverages", discount: 5, otherFeatures: { volume: "600ml" }, description: "Pepsi is a bold cola beverage known for its refreshing taste and fizz. Great with snacks.", ratings: 4.1, numberOfRatings: 190, reviews: [{ name: "Sonia Verma", rating: 4, date: new Date("2025-04-15"), comment: "Classic taste, always enjoyable." }], specifications: [{ carbonation: "High", container: "PET Bottle", sugar: "Yes" }] },
    { id: "C1D2E3F4G5", name: "Britannia Cake", imgUrl: "assets/cake.webp", price: 30, brand: "Britannia", available: true, inStock: 80, category: "snacks", discount: 8, otherFeatures: { flavor: "Vanilla", weight: "150g" }, description: "Soft and moist vanilla sponge cake, a delicious snack option with tea or coffee.", ratings: 4.2, numberOfRatings: 120, specifications: [{ type: "Sponge", flavor: "Vanilla", packType: "Pouch" }] },
    { id: "D6E7F8G9H0", name: "Vaseline Lotion", imgUrl: "assets/lotion.webp", price: 90, brand: "Vaseline", available: true, inStock: 70, category: "personal_care", discount: 7, otherFeatures: { volume: "200ml" }, description: "Vaseline Deep Moisture lotion keeps skin hydrated and smooth for up to 24 hours.", ratings: 4.5, numberOfRatings: 210, reviews: [{ name: "Megha Iyer", rating: 5, date: new Date("2025-02-20"), comment: "Very effective for dry skin." }], specifications: [{ skinType: "Dry", ingredients: ["Glycerin", "Vaseline Jelly"], type: "Body Lotion" }] },
    { id: "I1J2K3L4M5", name: "Axe Deodorant", imgUrl: "assets/deodrant.webp", price: 150, brand: "Axe", available: true, inStock: 50, category: "personal_care", discount: 3, otherFeatures: { volume: "150ml" }, description: "Long-lasting deodorant with a strong masculine fragrance. Keeps you fresh all day.", ratings: 4.0, numberOfRatings: 135, specifications: [{ scent: "Dark Temptation", sprayType: "Body Spray", alcoholFree: false }] },
    { id: "M1N2O3P4Q5", name: "Maggi Hot & Sweet Sauce", imgUrl: "assets/sauce.webp", price: 50, brand: "Nestlé", available: true, inStock: 100, category: "beverages", discount: 15, otherFeatures: { volume: "200ml" }, description: "A unique blend of hot chili and sweet tomato sauce. Perfect for dipping and cooking.", ratings: 4.6, numberOfRatings: 160, reviews: [{ name: "Nikhil Rawat", rating: 5, date: new Date("2025-01-30"), comment: "Love the balance of spicy and sweet." }], specifications: [{ taste: "Tangy", spiceLevel: "Medium", container: "Glass Bottle" }] },
    { id: "W1X2Y3Z4A5", name: "Coca-Cola Soft Drink", imgUrl: "assets/coca-cola.webp", price: 40, brand: "Coca-Cola", available: true, inStock: 150, category: "beverages", discount: 10, otherFeatures: { volume: "600ml" }, description: "Coca-Cola is the world’s favorite cola, offering a bold taste and refreshing fizz anytime.", ratings: 4.4, numberOfRatings: 230, specifications: [{ carbonation: "High", container: "PET Bottle", chilled: true }] },
    { id: "G1H2I3J4K6", name: "Lizol Disinfectant", imgUrl: "assets/disinfectant.webp", price: 100, brand: "Lizol", available: true, inStock: 60, category: "household", discount: 8, otherFeatures: { volume: "500ml" }, description: "Lizol disinfectant surface cleaner kills 99.9% of germs and leaves behind a pleasant fragrance.", ratings: 4.5, numberOfRatings: 95, reviews: [{ name: "Alok Patil", rating: 4, date: new Date("2025-03-02"), comment: "Keeps the floor clean and smells good." }], specifications: [{ scent: "Citrus", form: "Liquid", usage: "Floor Cleaning" }] },
    new Product("R6S7T8U9V0", "Gillette Shaving Foam", "assets/shavingfoam.webp", 100, "Gillette", true, 60, "personal_care", 6, {volume: "200ml"}, "Smooth shaving experience."),
    new Product("B6C7D8E9F0", "Broom Stick", "assets/broomstick.webp", 40, "Generic", true, 150, "household", 0, {material: "Plastic"}, "Durable broom for cleaning."),
    new Product("H1H2I3J4K5", "Trash Bags", "assets/trashbags.webp", 20, "Generic", true, 200, "household", 5, {size: "Medium"}, "Strong and leak-proof."),
];