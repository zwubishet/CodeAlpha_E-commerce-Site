const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create sample products
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
      price: 199.99,
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
      category: "Electronics",
      stock: 50
    },
    {
      name: "Smartphone Stand",
      description: "Adjustable aluminum smartphone stand compatible with all devices.",
      price: 24.99,
      image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg",
      category: "Accessories",
      stock: 100
    },
    {
      name: "Laptop Backpack",
      description: "Water-resistant laptop backpack with multiple compartments and USB charging port.",
      price: 89.99,
      image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg",
      category: "Bags",
      stock: 30
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision sensor and long battery life.",
      price: 39.99,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg",
      category: "Electronics",
      stock: 75
    },
    {
      name: "Coffee Mug",
      description: "Ceramic coffee mug with heat-resistant design and comfortable handle.",
      price: 15.99,
      image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
      category: "Home",
      stock: 200
    },
    {
      name: "Desk Lamp",
      description: "LED desk lamp with adjustable brightness and USB charging port.",
      price: 49.99,
      image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
      category: "Home",
      stock: 40
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });