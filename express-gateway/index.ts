import express, { Application, Response, Request, NextFunction } from "express";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";

const userBaseUrl = "http://localhost:3001/users";
const productBaseUrl = "http://localhost:3002/products";
const orderBaseUrl = "http://localhost:3003/orders";

const app = express();
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Gateway service" });
});

// User API

app.get("/users", async (req, res) => {
  try {
    const users = await axios.get(userBaseUrl);
    res.json(users.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await axios.get(`${userBaseUrl}/${req.params.id}`);
    res.json(user.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Product API

app.get("/products", async (req, res) => {
  try {
    const products = await axios.get(productBaseUrl);
    res.json(products.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await axios.get(`${productBaseUrl}/${req.params.id}`);
    res.json(product.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Order API

app.get("/orders", async (req, res) => {
  try {
    const orders = await axios.get(orderBaseUrl);
    res.json(orders.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const order = await axios.get(`${orderBaseUrl}/${req.params.id}`);
    const orderItems = await axios.get(
      `${orderBaseUrl}/${req.params.id}/items`
    );
    const payment = await axios.get(
      `${orderBaseUrl}/${req.params.id}/payments`
    );
    order.data.items = orderItems.data;
    order.data.payment = payment.data;
    res.json(order.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order" });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const order = await axios.post(orderBaseUrl, {
      userId: req.body.userId,
      orderDate: req.body.orderDate,
    });
    const orderItems = await axios.post(
      orderBaseUrl + `/${order.data.id}/items`,
      req.body.items
    );
    const payment = await axios.post(
      orderBaseUrl + `/${order.data.id}/payments`,
      req.body.payment
    );
    order.data.items = orderItems.data;
    order.data.payment = payment.data;
    res.json(order.data);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
});

app.listen(3000, () => {
  console.log("Gateway service listening on port 3000");
});
