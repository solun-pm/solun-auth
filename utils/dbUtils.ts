import { Model, Document } from 'mongoose';

export async function findOneDocument<T extends Document>(
  model: Model<T>,
  query: object
): Promise<T | null> {
  const document = await model.findOne(query).exec();
  return document;
}

export async function deleteOneDocument<T extends Document>(
  model: Model<T>,
  query: object
): Promise<number> {
  const result = await model.deleteOne(query).exec();
  return result.deletedCount;
}