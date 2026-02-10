const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Pizza menu data
const pizzaMenu = [
  { id: 1, name: 'Margherita', price: 12.99, toppings: ['tomato', 'mozzarella', 'basil'] },
  { id: 2, name: 'Green Pizza', price: 15.99, toppings: ['pesto', 'spinach', 'arugula', 'mozzarella'] },
  { id: 3, name: 'Pepperoni', price: 14.99, toppings: ['tomato', 'mozzarella', 'pepperoni'] },
  { id: 4, name: 'Veggie Supreme', price: 13.99, toppings: ['tomato', 'bell peppers', 'mushrooms', 'olives'] }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/menu', (req, res) => {
  res.json({ pizzas: pizzaMenu });
});

app.get('/api/pizza/:id', (req, res) => {
  const pizza = pizzaMenu.find(p => p.id === parseInt(req.params.id));
  if (pizza) {
    res.json(pizza);
  } else {
    res.status(404).json({ error: 'Pizza not found' });
  }
});

app.post('/api/order', (req, res) => {
  const { pizzaId, quantity, customerName } = req.body;
  
  if (!pizzaId || !quantity || !customerName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const pizza = pizzaMenu.find(p => p.id === parseInt(pizzaId));
  if (!pizza) {
    return res.status(404).json({ error: 'Pizza not found' });
  }
  
  const order = {
    orderId: Math.random().toString(36).substr(2, 9),
    pizza: pizza.name,
    quantity,
    customerName,
    totalPrice: pizza.price * quantity,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  };
  
  res.json(order);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🍕 Green Pizza server running on port ${PORT}`);
});

module.exports = { app, server };
