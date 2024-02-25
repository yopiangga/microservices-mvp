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

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(product);
});

app.post("/products", async (req, res) => {
  const product = await prisma.product.create({
    data: req.body,
  });
  res.json(product);
});

app.put("/products/:id", async (req, res) => {
  const product = await prisma.product.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });
  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  await prisma.product.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json({ message: "Product deleted successfully" });
});

app.listen(3002, () => {
  console.log("Product service listening on port 3002");
});
