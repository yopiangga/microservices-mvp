import express, { Application, Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

app.get("/orders", async (req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
});

app.get("/orders/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(order);
});

app.post("/orders", async (req, res) => {
  const order = await prisma.order.create({
    data: req.body,
  });
  res.json(order);
});

app.put("/orders/:id", async (req, res) => {
  const order = await prisma.order.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });
  res.json(order);
});

app.delete("/orders/:id", async (req, res) => {
  await prisma.order.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json({ message: "Order deleted" });
});

// add orders items
app.post("/orders/:id/items", async (req, res) => {
  const order = await prisma.orderItem.createMany({
    data: req.body.map((item: any) => ({
      ...item,
      orderId: parseInt(req.params.id),
    })),
  });
  res.json(order);
});

// get order items
app.get("/orders/:id/items", async (req, res) => {
  const order = await prisma.orderItem.findMany({
    where: {
      orderId: parseInt(req.params.id),
    },
  });
  res.json(order);
});

// add payment
app.post("/orders/:id/payments", async (req, res) => {
  const order = await prisma.payment.create({
    data: {
      ...req.body,
      orderId: parseInt(req.params.id),
    },
  });
  res.json(order);
});

// get payments
app.get("/orders/:id/payments", async (req, res) => {
  const order = await prisma.payment.findMany({
    where: {
      orderId: parseInt(req.params.id),
    },
    include: {
      paymentMethod: true,
    },
  });
  res.json(order);
});

app.listen(3003, () => {
  console.log("Order service listening on port 3003");
});
