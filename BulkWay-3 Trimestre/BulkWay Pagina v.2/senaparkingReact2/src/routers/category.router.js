// routers/category.routers.js

import { Router } from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

const router = Router();

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;