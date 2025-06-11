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

// const products = [
//     new Product("A1B2C3D4E5", "iPhone 14 Pro", "assets/mobile.jpg", 999, "Apple", true, 12, "mobiles", 10, {color: "Deep Purple", storage: "128GB"}, "Latest Apple iPhone with A16 Bionic."),
//     new Product("F6G7H8I9J0", "Samsung Galaxy S23", "assets/mobile.jpg", 899, "Samsung", true, 15, "mobiles", 12, {color: "Phantom Black", storage: "256GB"}, "High-end Android with Snapdragon 8 Gen 2."),
//     new Product("K1L2M3N4O5", "OnePlus 11", "assets/mobile.jpg", 699, "OnePlus", true, 20, "mobiles", 5, {color: "Eternal Green", storage: "256GB"}, "Fast and smooth OxygenOS phone."),
//     new Product("P6Q7R8S9T0", "Google Pixel 8", "assets/mobile.jpg", 799, "Google", true, 10, "mobiles", 8, {color: "Obsidian", storage: "128GB"}, "Clean Android and amazing camera."),
//     new Product("U1V2W3X4Y5", "Xiaomi 13 Pro", "assets/mobile.jpg", 649, "Xiaomi", true, 18, "mobiles", 15, {color: "Ceramic White", storage: "512GB"}, "Flagship specs at affordable price."),
//     new Product("Z6A7B8C9D0", "Realme GT Neo 3", "assets/mobile.jpg", 499, "Realme", true, 25, "mobiles", 20, {color: "Nitro Blue", storage: "256GB"}, "Budget flagship killer."),
  
//     new Product("E1F2G3H4I5", "MacBook Pro M2", "assets/laptop.jpg", 1999, "Apple", true, 10, "laptops", 5, {ram: "16GB", storage: "512GB"}, "Powerful and efficient MacBook."),
//     new Product("J6K7L8M9N0", "Dell XPS 13", "assets/laptop.jpg", 1399, "Dell", true, 14, "laptops", 10, {ram: "16GB", processor: "Intel i7"}, "Compact ultrabook with top performance."),
//     new Product("O1P2Q3R4S5", "HP Spectre x360", "assets/laptop.jpg", 1299, "HP", true, 11, "laptops", 15, {ram: "16GB", type: "Convertible"}, "2-in-1 premium ultrabook."),
//     new Product("T6U7V8W9X0", "Asus ROG Strix", "assets/laptop.jpg", 1599, "Asus", true, 9, "laptops", 8, {gpu: "RTX 4060", ram: "16GB"}, "High-performance gaming laptop."),
//     new Product("Y1Z2A3B4C5", "Lenovo Legion 5", "assets/laptop.jpg", 1399, "Lenovo", true, 13, "laptops", 12, {gpu: "RTX 3060", display: "144Hz"}, "Affordable gaming beast."),
//     new Product("D6E7F8G9H0", "MSI Prestige 14", "assets/laptop.jpg", 1199, "MSI", true, 10, "laptops", 10, {color: "Carbon Gray"}, "Sleek productivity laptop."),
  
//     new Product("I1J2K3L4M5", "Sony WH-1000XM5", "assets/headphone.jpg", 399, "Sony", true, 18, "headphones", 10, {noiseCancelling: true, battery: "30h"}, "Top-tier ANC headphones."),
//     new Product("N6O7P8Q9R0", "Bose QC45", "assets/headphone.jpg", 329, "Bose", true, 15, "headphones", 8, {comfort: "high"}, "Comfortable with great sound."),
//     new Product("S1T2U3V4W5", "AirPods Pro 2", "assets/headphone.jpg", 249, "Apple", true, 20, "headphones", 5, {spatialAudio: true}, "Perfect for iPhone users."),
//     new Product("X6Y7Z8A9B0", "JBL Tune 760NC", "assets/headphone.jpg", 129, "JBL", true, 30, "headphones", 20, {color: "Black"}, "Budget ANC headphones."),
//     new Product("C1D2E3F4G5", "Sennheiser HD 450BT", "assets/headphone.jpg", 149, "Sennheiser", true, 25, "headphones", 15, {bluetooth: "5.0"}, "Reliable wireless headphones."),
//     new Product("H6I7J8K9L0", "Boat Rockerz 550", "assets/headphone.jpg", 49, "Boat", true, 40, "headphones", 25, {battery: "20h"}, "Affordable over-ear headphones."),
  
//     new Product("M1N2O3P4Q5", "Apple Watch Series 9", "assets/watch.jpg", 399, "Apple", true, 14, "watches", 5, {gps: true, size: "44mm"}, "Advanced health tracking."),
//     new Product("R6S7T8U9V0", "Samsung Galaxy Watch 6", "assets/watch.jpg", 349, "Samsung", true, 13, "watches", 8, {ecg: true}, "Great for Android users."),
//     new Product("W1X2Y3Z4A5", "Fossil Gen 6", "assets/watch.jpg", 299, "Fossil", true, 16, "watches", 10, {os: "WearOS"}, "Stylish smartwatch."),
//     new Product("B6C7D8E9F0", "Fitbit Versa 4", "assets/watch.jpg", 199, "Fitbit", true, 22, "watches", 20, {fitnessTracking: true}, "Ideal for fitness tracking."),
//     new Product("G1H2I3J4K5", "Garmin Forerunner 255", "assets/watch.jpg", 349, "Garmin", true, 9, "watches", 12, {gps: true}, "For serious athletes."),
//     new Product("L6M7N8O9P0", "Noise ColorFit Pro 4", "assets/watch.jpg", 79, "Noise", true, 35, "watches", 30, {display: "AMOLED"}, "Budget smartwatch with AMOLED.")
// ];
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

app.post('/user/signup', (req, res) => {
    const { name, age, gender, address, phone, email, password, premium } = req.body;
    if(!name || !email || !phone || !password)
        return res.status(400).json({ message: 'Required fields are missing' });
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

app.get('/products', (req, res) => {
    if(req.query.category != undefined)
        res.json(products.filter((product) => { return product.category == req.query.category}));
    else if(req.query.filter != undefined){
        filterText = req.query.filter.toLowerCase();
        res.json(products.filter((product) => Object.values(product).some(value => {return value?.toString().toLowerCase().includes(filterText);})));
    }
    else
        res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if(!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

app.post('/users/:email/cart', (req, res) => {
    const email = req.params.email;
    const { productId, quantity } = req.body;
    const user = users.find(u => u.email === email);
    const product = products.find(p => p.id === productId);
    if(!user || !product)
        return res.status(404).json({ message: "User or product not found" });

    const existingCartItemIndex = user.cart.findIndex(ci => ci.productId === productId);
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

app.delete('/users/:email/cart/clear', (req, res) => {
    const user = users.find(u => u.email === req.params.email);
    if(!user)
        return res.status(404).json({ message: "User not found" });
    user.cart = [];
    res.status(200).send();
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
        return res.status(404).json({ message: "daily order not found" });
    user.daily[dailyIndex].nextDeliveryQuantity = quantity;
    if(!temporary)
        user.daily[dailyIndex].defaultQuantity = quantity;
    res.status(200).json({ message: "Daily order updated successfully", daily: user.daily });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


const products = [
    { id: "G1H2I3J4K5", name: "Tata Salt", imgUrl: "assets/salt.jpg", price: 20, brand: "Tata", available: true, inStock: 50, category: "groceries", discount: 0, otherFeatures: { weight: "1kg" }, description: "Tata Salt is India's most trusted and popular iodized salt brand, ensuring purity and essential nutrients for everyday cooking.", ratings: 4.5, numberOfRatings: 220, reviews: [
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
    { id: "L6M7N8O9P0", name: "Aashirvaad Atta", imgUrl: "assets/aata.jpg", price: 45, brand: "Aashirvaad", available: true, inStock: 30, category: "groceries", discount: 5, otherFeatures: { weight: "5kg" }, description: "Aashirvaad Whole Wheat Atta is made from the finest grains, ensuring soft and fluffy rotis every time. Contains natural fiber and nutrients.", ratings: 4.6, numberOfRatings: 150, reviews: [
        {
          name: "Neha Kapoor",
          rating: 5,
          date: new Date("2025-01-05"),
          comment: "Excellent texture and taste. Makes rotis very soft."
        }
      ], specifications: [{ type: "Whole Wheat", gluten: "Moderate", origin: "India" }] },
    { id: "Q1R2S3T4U5", name: "Amul Butter", imgUrl: "assets/butter.jpg", price: 60, brand: "Amul", available: true, inStock: 20, category: "groceries", discount: 10, otherFeatures: { weight: "500g" }, description: "Amul Butter is made from pure milk fat and delivers a rich, creamy flavor that's perfect for spreading, cooking, and baking.", ratings: 4.8, numberOfRatings: 300, reviews: [
        {
          name: "Rohit Mehta",
          rating: 5,
          date: new Date("2024-11-15"),
          comment: "Iconic taste. Best butter in the market!"
        }
      ], specifications: [{ type: "Salted", fatContent: "82%", shelfLife: "6 months" }] },
    { id: "V6W7X8Y9Z0", name: "Britannia Biscuit", imgUrl: "assets/biscuit.jpg", price: 25, brand: "Britannia", available: true, inStock: 100, category: "groceries", discount: 2, otherFeatures: { flavor: "Treat", weight: "200g" }, description: "Crunchy and delicious Treat biscuits from Britannia with a creamy center, ideal for snacks and tea time treats." },
    { id: "A2B3C4D5E6", name: "Nescafe Coffee", imgUrl: "assets/coffee.jpg", price: 150, brand: "Nestlé", available: true, inStock: 40, category: "groceries", discount: 8, otherFeatures: { weight: "200g" }, description: "Nescafe Classic Instant Coffee delivers a rich aroma and smooth flavor in every cup, perfect for your daily caffeine fix.", ratings: 4.3, numberOfRatings: 180, reviews: [
        {
          name: "Priya Verma",
          rating: 4,
          date: new Date("2025-03-21"),
          comment: "Strong and aromatic coffee. Gives a good kickstart to the day."
        }
      ], specifications: [{ roast: "Medium", form: "Powder", caffeine: "Medium" }] },
    { id: "D1E2F3G4H5", name: "Dove Soap", imgUrl: "assets/soap.jpg", price: 35, brand: "Dove", available: true, inStock: 50, category: "personal_care", discount: 5, otherFeatures: { weight: "100g" }, description: "Dove Beauty Bar is enriched with ¼ moisturizing cream and mild cleansers, helping your skin retain its natural moisture.", ratings: 4.7, numberOfRatings: 290, reviews: [
        {
          name: "Sneha Kulkarni",
          rating: 5,
          date: new Date("2025-04-08"),
          comment: "Leaves skin soft and smooth, unlike other soaps."
        }
      ], specifications: [{ type: "Moisturizing", pH: "Neutral", skinType: "All" }] },
    { id: "W1X2Y3Z4A5", name: "Ariel Detergent Powder", imgUrl: "assets/detergent.jpg", price: 150, brand: "Ariel", available: true, inStock: 40, category: "household", discount: 10, otherFeatures: { weight: "1kg" }, description: "Ariel Matic provides brilliant cleaning on both whites and colored clothes while keeping fabrics bright and fresh.", ratings: 4.4, numberOfRatings: 175, reviews: [
        {
          name: "Kiran Rao",
          rating: 4,
          date: new Date("2025-01-18"),
          comment: "Great cleaning power. Smells fresh after wash."
        }
      ], specifications: [{ suitableFor: "Top Load", fragrance: "Fresh", format: "Powder" }] },
    { id: "S1T2U3V4W5", name: "Lay's Chips", imgUrl: "assets/chips.jpg", price: 20, brand: "Lay's", available: true, inStock: 100, category: "snacks", discount: 10, otherFeatures: { flavor: "Classic Salted", weight: "50g" }, description: "Lay’s Classic Salted Chips offer light, crispy texture and irresistible flavor, perfect for any snacking moment.", ratings: 4.2, numberOfRatings: 90, reviews: [
        {
          name: "Rahul Jaiswal",
          rating: 4,
          date: new Date("2025-05-02"),
          comment: "Crunchy and addictive! Could use slightly less salt though."
        }
      ], specifications: [{ flavor: "Salted", packaging: "Single Pack", shelfLife: "6 months" }] },
    { id: "A1B2C3D4E5", name: "Bananas", imgUrl: "assets/bananas.jpg", price: 40, brand: "Local", available: true, inStock: 200, category: "fruits", discount: 0, otherFeatures: { weight: "1kg" }, description: "Fresh, ripe bananas rich in potassium and perfect as a healthy snack or for smoothies, desserts, and cooking.", ratings: 4.1, numberOfRatings: 85, specifications: [{ type: "Cavendish", ripeness: "Ripe", origin: "India" }] },
    { id: "F6G7H8I9J0", name: "Tomatoes", imgUrl: "assets/tomatoes.jpg", price: 30, brand: "Local", available: true, inStock: 150, category: "vegetables", discount: 5, otherFeatures: { weight: "1kg" }, description: "Juicy, fresh tomatoes packed with flavor and nutrients. Ideal for cooking and salads.", ratings: 4.3, numberOfRatings: 70, specifications: [{ type: "Roma", freshness: "High", origin: "India" }] },
    { id: "K1L2M3N4O5", name: "Potatoes", imgUrl: "assets/potatoes.jpg", price: 25, brand: "Local", available: true, inStock: 180, category: "vegetables", discount: 10, otherFeatures: { weight: "1kg" }, description: "Firm, versatile potatoes perfect for boiling, frying, or baking with consistent texture.", ratings: 4.0, numberOfRatings: 60, reviews: [{ name: "Ajay Singh", rating: 4, date: new Date("2025-05-01"), comment: "Good quality and lasts well." }], specifications: [{ type: "Desi", skin: "Brown", origin: "Local Farms" }] },
    { id: "X6Y7Z8A9B0", name: "Pepsi Soft Drink", imgUrl: "assets/pepsi.jpg", price: 40, brand: "Pepsi", available: true, inStock: 150, category: "beverages", discount: 5, otherFeatures: { volume: "600ml" }, description: "Pepsi is a bold cola beverage known for its refreshing taste and fizz. Great with snacks.", ratings: 4.1, numberOfRatings: 190, reviews: [{ name: "Sonia Verma", rating: 4, date: new Date("2025-04-15"), comment: "Classic taste, always enjoyable." }], specifications: [{ carbonation: "High", container: "PET Bottle", sugar: "Yes" }] },
    { id: "C1D2E3F4G5", name: "Britannia Cake", imgUrl: "assets/cake.jpg", price: 30, brand: "Britannia", available: true, inStock: 80, category: "snacks", discount: 8, otherFeatures: { flavor: "Vanilla", weight: "150g" }, description: "Soft and moist vanilla sponge cake, a delicious snack option with tea or coffee.", ratings: 4.2, numberOfRatings: 120, specifications: [{ type: "Sponge", flavor: "Vanilla", packType: "Pouch" }] },
    { id: "D6E7F8G9H0", name: "Vaseline Lotion", imgUrl: "assets/lotion.jpg", price: 90, brand: "Vaseline", available: true, inStock: 70, category: "personal_care", discount: 7, otherFeatures: { volume: "200ml" }, description: "Vaseline Deep Moisture lotion keeps skin hydrated and smooth for up to 24 hours.", ratings: 4.5, numberOfRatings: 210, reviews: [{ name: "Megha Iyer", rating: 5, date: new Date("2025-02-20"), comment: "Very effective for dry skin." }], specifications: [{ skinType: "Dry", ingredients: ["Glycerin", "Vaseline Jelly"], type: "Body Lotion" }] },
    { id: "I1J2K3L4M5", name: "Axe Deodorant", imgUrl: "assets/deodrant.jpg", price: 150, brand: "Axe", available: true, inStock: 50, category: "personal_care", discount: 3, otherFeatures: { volume: "150ml" }, description: "Long-lasting deodorant with a strong masculine fragrance. Keeps you fresh all day.", ratings: 4.0, numberOfRatings: 135, specifications: [{ scent: "Dark Temptation", sprayType: "Body Spray", alcoholFree: false }] },
    { id: "M1N2O3P4Q5", name: "Maggi Hot & Sweet Sauce", imgUrl: "assets/sauce.jpg", price: 50, brand: "Nestlé", available: true, inStock: 100, category: "beverages", discount: 15, otherFeatures: { volume: "200ml" }, description: "A unique blend of hot chili and sweet tomato sauce. Perfect for dipping and cooking.", ratings: 4.6, numberOfRatings: 160, reviews: [{ name: "Nikhil Rawat", rating: 5, date: new Date("2025-01-30"), comment: "Love the balance of spicy and sweet." }], specifications: [{ taste: "Tangy", spiceLevel: "Medium", container: "Glass Bottle" }] },
    { id: "W1X2Y3Z4A5", name: "Coca-Cola Soft Drink", imgUrl: "assets/coca-cola.jpg", price: 40, brand: "Coca-Cola", available: true, inStock: 150, category: "beverages", discount: 10, otherFeatures: { volume: "600ml" }, description: "Coca-Cola is the world’s favorite cola, offering a bold taste and refreshing fizz anytime.", ratings: 4.4, numberOfRatings: 230, specifications: [{ carbonation: "High", container: "PET Bottle", chilled: true }] },
    { id: "G1H2I3J4K6", name: "Lizol Disinfectant", imgUrl: "assets/disinfectant.jpg", price: 100, brand: "Lizol", available: true, inStock: 60, category: "household", discount: 8, otherFeatures: { volume: "500ml" }, description: "Lizol disinfectant surface cleaner kills 99.9% of germs and leaves behind a pleasant fragrance.", ratings: 4.5, numberOfRatings: 95, reviews: [{ name: "Alok Patil", rating: 4, date: new Date("2025-03-02"), comment: "Keeps the floor clean and smells good." }], specifications: [{ scent: "Citrus", form: "Liquid", usage: "Floor Cleaning" }] },
    new Product("R6S7T8U9V0", "Gillette Shaving Foam", "assets/shavingfoam.jpg", 100, "Gillette", true, 60, "personal_care", 6, {volume: "200ml"}, "Smooth shaving experience."),
    new Product("B6C7D8E9F0", "Broom Stick", "assets/broomstick.jpg", 40, "Generic", true, 150, "household", 0, {material: "Plastic"}, "Durable broom for cleaning."),
    new Product("H1H2I3J4K5", "Trash Bags", "assets/trashbags.jpg", 20, "Generic", true, 200, "household", 5, {size: "Medium"}, "Strong and leak-proof."),
];

/*
const products = [
    // **Groceries**
    new Product("G1H2I3J4K5", "Tata Salt", "assets/salt.jpg", 20, "Tata", true, 50, "groceries", 0, {weight: "1kg"}, "Refined iodized salt."),
    new Product("L6M7N8O9P0", "Aashirvaad Atta", "assets/atta.jpg", 45, "Aashirvaad", true, 30, "groceries", 5, {weight: "5kg"}, "Whole wheat flour for soft rotis."),
    new Product("Q1R2S3T4U5", "Amul Butter", "assets/butter.jpg", 60, "Amul", true, 20, "groceries", 10, {weight: "500g"}, "Creamy and rich butter."),
    new Product("V6W7X8Y9Z0", "Britannia Biscuit", "assets/biscuit.jpg", 25, "Britannia", true, 100, "groceries", 2, {flavor: "Treat", weight: "200g"}, "Crunchy and delicious."),
    new Product("A2B3C4D5E6", "Nescafe Coffee", "assets/coffee.jpg", 150, "Nestlé", true, 40, "groceries", 8, {weight: "200g"}, "Instant coffee powder."),
    new Product("F7G8H9I0J1", "Tata Tea", "assets/tea.jpg", 100, "Tata", true, 60, "groceries", 5, {weight: "500g"}, "Strong and aromatic tea."),
    new Product("K2L3M4N5O6", "Maggi Noodles", "assets/noodles.jpg", 12, "Nestlé", true, 200, "groceries", 15, {flavor: "Masala", weight: "70g"}, "Quick and tasty noodles."),
    new Product("P7Q8R9S0T1", "Parle-G Biscuit", "assets/biscuit.jpg", 10, "Parle", true, 150, "groceries", 0, {weight: "100g"}, "Classic glucose biscuits."),

    // **Personal Care**
    new Product("D1E2F3G4H5", "Dove Soap", "assets/soap.jpg", 35, "Dove", true, 50, "personal_care", 5, {weight: "100g"}, "Moisturizing soap for soft skin."),
    new Product("J6K7L8M9N0", "Colgate Toothpaste", "assets/toothpaste.jpg", 50, "Colgate", true, 80, "personal_care", 10, {weight: "150g"}, "Provides cavity protection."),
    new Product("O1P2Q3R4S5", "Head & Shoulders Shampoo", "assets/shampoo.jpg", 120, "Head & Shoulders", true, 30, "personal_care", 8, {volume: "200ml"}, "Anti-dandruff shampoo."),
    new Product("T6U7V8W9X0", "Nivea Cream", "assets/cream.jpg", 80, "Nivea", true, 60, "personal_care", 5, {weight: "100g"}, "Rich moisturizing cream."),
    new Product("Y1Z2A3B4C5", "L'Oréal Paris Shampoo", "assets/shampoo.jpg", 150, "L'Oréal", true, 40, "personal_care", 12, {volume: "200ml"}, "Shampoo for smooth hair."),
    new Product("D6E7F8G9H0", "Vaseline Lotion", "assets/lotion.jpg", 90, "Vaseline", true, 70, "personal_care", 7, {volume: "200ml"}, "Deep moisture lotion."),
    new Product("I1J2K3L4M5", "Axe Deodorant", "assets/deodorant.jpg", 150, "Axe", true, 50, "personal_care", 3, {volume: "150ml"}, "Long-lasting fragrance."),
    new Product("R6S7T8U9V0", "Gillette Shaving Foam", "assets/shavingfoam.jpg", 100, "Gillette", true, 60, "personal_care", 6, {volume: "200ml"}, "Smooth shaving experience."),

    // **Household Items**
    new Product("W1X2Y3Z4A5", "Ariel Detergent Powder", "assets/detergent.jpg", 150, "Ariel", true, 40, "household", 10, {weight: "1kg"}, "Powerful stain removal."),
    new Product("B6C7D8E9F0", "Harpic Toilet Cleaner", "assets/toiletcleaner.jpg", 50, "Harpic", true, 70, "household", 5, {volume: "500ml"}, "Kills germs and removes stains."),
    new Product("G1H2I3J4K5", "Lizol Disinfectant", "assets/disinfectant.jpg", 100, "Lizol", true, 60, "household", 8, {volume: "500ml"}, "Disinfects and deodorizes."),
    new Product("M1N2O3P4Q5", "Scotch-Brite Scrub Pad", "assets/scrubpad.jpg", 30, "Scotch-Brite", true, 100, "household", 12, {size: "Medium"}, "Durable cleaning pad."),
    new Product("R6S7T8U9V0", "Colgate Toilet Cleaner", "assets/toiletcleaner.jpg", 60, "Colgate", true, 50, "household", 7, {volume: "500ml"}, "Cleans and freshens toilet."),
    new Product("W1X2Y3Z4A5", "Odonil Air Freshener", "assets/airfreshener.jpg", 75, "Odonil", true, 80, "household", 10, {scent: "Lavender"}, "Long-lasting fragrance."),
    new Product("B6C7D8E9F0", "Broom Stick", "assets/broomstick.jpg", 40, "Generic", true, 150, "household", 0, {material: "Plastic"}, "Durable broom for cleaning."),
    new Product("G1H2I3J4K5", "Trash Bags", "assets/trashbags.jpg", 20, "Generic", true, 200, "household", 5, {size: "Medium"}, "Strong and leak-proof."),

    // **Snacks & Beverages**
    new Product("S1T2U3V4W5", "Lay's Chips", "assets/chips.jpg", 20, "Lay's", true, 100, "snacks & beverages", 10, {flavor: "Classic Salted", weight: "50g"}, "Crispy and tasty chips."),
    new Product("X6Y7Z8A9B0", "Pepsi Soft Drink", "assets/pepsi.jpg", 40, "Pepsi", true, 150, "snacks & beverages", 5, {volume: "600ml"}, "Refreshing cola drink."),
    new Product("C1D2E3F4G5", "Britannia Cake", "assets/cake.jpg", 30, "Britannia", true, 80, "snacks & beverages", 8, {flavor: "Vanilla", weight: "150g"}, "Soft and spongy cake."),
    new Product("H6I7J8K9L0", "Tata Tea Gold", "assets/tea.jpg", 120, "Tata", true, 60, "snacks & beverages", 12, {weight: "500g"}, "Premium tea leaves."),
    new Product("M1N2O3P4Q5", "Maggi Hot & Sweet Sauce", "assets/sauce.jpg", 50, "Nestlé", true, 100, "snacks & beverages", 15, {volume: "200ml"}, "Tangy and spicy sauce."),
    new Product("R6S7T8U9V0", "Britannia Rusk", "assets/rusk.jpg", 25, "Britannia", true, 120, "snacks & beverages", 5, {weight: "200g"}, "Crispy and crunchy rusk."),
    new Product("W1X2Y3Z4A5", "Coca-Cola Soft Drink", "assets/coca-cola.jpg", 40, "Coca-Cola", true, 150, "snacks & beverages", 10, {volume: "600ml"}, "Classic cola taste."),
    new Product("B6C7D8E9F0", "Kurkure Snacks", "assets/kurkure.jpg", 20, "Kurkure", true, 100, "snacks & beverages", 8, {flavor: "Masala Munch", weight: "60g"}, "Crunchy and spicy snacks."),

    // **Fruits & Vegetables**
    new Product("A1B2C3D4E5", "Bananas", "assets/bananas.jpg", 40, "Local", true, 200, "fruits & vegetables", 0, {weight: "1kg"}, "Fresh and ripe bananas."),
    new Product("F6G7H8I9J0", "Tomatoes", "assets/tomatoes.jpg", 30, "Local", true, 150, "fruits & vegetables", 5, {weight: "1kg"}, "Juicy and red tomatoes."),
    new Product("K1L2M3N4O5", "Potatoes", "assets/potatoes.jpg", 25, "Local", true, 180, "fruits & vegetables", 10, {weight: "1kg"}, "Fresh and firm potatoes."),
]
 

*/