import { prisma, Prisma } from '@repo/product-db';
import { Request, Response } from 'express';

export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategotyCreateInput = req.body;
  const category = await prisma.categoty.create({ data });
  res.status(201).json({ category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.CategotyUpdateInput = req.body;
  const category = await prisma.categoty.update({
    where: { id: Number(id) },
    data,
  });
  return res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await prisma.categoty.delete({
    where: { id: Number(id) },
  });
  return res.status(200).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.categoty.findMany({});
  return res.status(200).json(categories);
};
