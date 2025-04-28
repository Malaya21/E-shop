const db = require('./db')
const Product = require('./models/product')

const demoProducts = [
    {
        name: "Samsung Galaxy S23 Ultra",
        description: "Latest Samsung flagship with 200MP camera, S Pen support, and 5000mAh battery",
        price: 1199.99,
        category: "electronics",
        stock: 50,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        createdAt: new Date()
    },
    {
        name: "Apple MacBook Pro M2",
        description: "13-inch MacBook Pro with M2 chip, 8GB RAM, and 256GB SSD",
        price: 1299.99,
        category: "electronics",
        stock: 30,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        createdAt: new Date()
    },
    {
        name: "Sony WH-1000XM5",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
        price: 399.99,
        category: "electronics",
        stock: 25,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        createdAt: new Date()
    },
    {
        name: "Men's Classic Fit Suit",
        description: "Premium wool blend suit with modern cut and comfortable fit",
        price: 299.99,
        category: "clothing",
        stock: 40,
        image: "https://images.unsplash.com/photo-1593032465175-303817a4c3f7",
        createdAt: new Date()
    },
    {
        name: "Women's Winter Coat",
        description: "Waterproof winter coat with faux fur trim and multiple pockets",
        price: 199.99,
        category: "clothing",
        stock: 35,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        createdAt: new Date()
    },
    {
        name: "Unisex Running Shoes",
        description: "Lightweight running shoes with responsive cushioning and breathable mesh",
        price: 129.99,
        category: "clothing",
        stock: 60,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        createdAt: new Date()
    },
    {
        name: "Atomic Habits",
        description: "James Clear's best-selling book on building good habits and breaking bad ones",
        price: 19.99,
        category: "books",
        stock: 100,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        createdAt: new Date()
    },
    {
        name: "The Psychology of Money",
        description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel",
        price: 24.99,
        category: "books",
        stock: 75,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        createdAt: new Date()
    },
    {
        name: "Smart Home Security Camera",
        description: "1080p HD security camera with night vision and motion detection",
        price: 89.99,
        category: "electronics",
        stock: 45,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd",
        createdAt: new Date()
    },
    {
        name: "Designer Handbag",
        description: "Luxury leather handbag with multiple compartments and gold-tone hardware",
        price: 499.99,
        category: "other",
        stock: 15,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        createdAt: new Date()
    },
    {
        name: "Wireless Charging Pad",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices",
        price: 39.99,
        category: "electronics",
        stock: 80,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd",
        createdAt: new Date()
    },
    {
        name: "Premium Coffee Maker",
        description: "Programmable coffee maker with thermal carafe and built-in grinder",
        price: 199.99,
        category: "other",
        stock: 20,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd",
        createdAt: new Date()
    },
    {
        name: "DJI Mavic 3 Pro",
        description: "Professional drone with 4/3 CMOS Hasselblad camera and 46-minute flight time",
        price: 2199.99,
        category: "electronics",
        stock: 15,
        image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31",
        createdAt: new Date()
    },
    {
        name: "Gaming Laptop RTX 4080",
        description: "17-inch gaming laptop with RTX 4080, 32GB RAM, and 2TB SSD",
        price: 2499.99,
        category: "electronics",
        stock: 12,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
        createdAt: new Date()
    },
    {
        name: "Smart Watch Pro",
        description: "Advanced smartwatch with ECG, blood oxygen monitoring, and LTE connectivity",
        price: 349.99,
        category: "electronics",
        stock: 40,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
        createdAt: new Date()
    },
    {
        name: "Leather Jacket",
        description: "Premium genuine leather jacket with removable hood and multiple pockets",
        price: 399.99,
        category: "clothing",
        stock: 25,
        image: "https://media.istockphoto.com/id/1404654875/photo/various-vintage-jackets-on-clothing-rack-in-second-hand-store.jpg?s=1024x1024&w=is&k=20&c=mle4SUfvACu9SqC0DoyY7H6RprTv5C_YliUblBd9xdg=",
        createdAt: new Date()
    },
    {
        name: "Designer Jeans",
        description: "Premium denim jeans with unique wash and comfortable stretch",
        price: 189.99,
        category: "clothing",
        stock: 45,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
        createdAt: new Date()
    },
    {
        name: "Cashmere Sweater",
        description: "100% cashmere sweater with ribbed cuffs and crew neck",
        price: 249.99,
        category: "clothing",
        stock: 30,
        image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
        createdAt: new Date()
    },
    {
        name: "The Lean Startup",
        description: "Eric Ries's revolutionary approach to business and product development",
        price: 22.99,
        category: "books",
        stock: 85,
        image: "https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt: new Date()
    },
    {
        name: "Deep Work",
        description: "Rules for focused success in a distracted world by Cal Newport",
        price: 18.99,
        category: "books",
        stock: 65,
        image: "https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt: new Date()
    },
    {
        name: "The Art of War",
        description: "Sun Tzu's classic treatise on military strategy and tactics",
        price: 12.99,
        category: "books",
        stock: 120,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        createdAt: new Date()
    },
    {
        name: "Luxury Watch",
        description: "Automatic mechanical watch with sapphire crystal and leather strap",
        price: 899.99,
        category: "other",
        stock: 10,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
        createdAt: new Date()
    },
    {
        name: "Designer Sunglasses",
        description: "Premium polarized sunglasses with UV protection and metal frame",
        price: 299.99,
        category: "other",
        stock: 35,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666",
        createdAt: new Date()
    },
    {
        name: "Professional Camera Bag",
        description: "Waterproof camera bag with customizable compartments and laptop sleeve",
        price: 149.99,
        category: "other",
        stock: 28,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        createdAt: new Date()
    }
];

const uploadProducts = async () => {
    await Product.deleteMany({});
    await Product.insertMany(demoProducts)
    console.log('Products uploaded successfully')
}

uploadProducts()

