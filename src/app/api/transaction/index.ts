import connectMongo from '../../../../lib/mongodb';
import Transaction from "../../../../models/transaction";
import { getSession } from 'next-auth/react'; 
import { NextApiRequest, NextApiResponse } from 'next';

interface User {
  id: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  await connectMongo();

  switch (req.method) {
    case 'POST':
      return await createTransaction(req, res, session.user as User);
    case 'GET':
      return await getTransactions(res, session.user as User);
    case 'PUT':
      return await updateTransaction(req, res);
    case 'DELETE':
      return await deleteTransaction(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const createTransaction = async (req: NextApiRequest, res: NextApiResponse, user: User) => {
  try {
    const { amount, date, type, note } = req.body;
    const transaction = new Transaction({ userId: user.id, amount, date, type, note });
    await transaction.save();
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message || "Something went wrong" });
  }
};

const getTransactions = async (res: NextApiResponse, user: User) => {
  try {
    const transactions = await Transaction.find({ userId: user.id });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Something went wrong" });
  }
};

const updateTransaction = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { _id, ...updateData } = req.body; // Destructure _id from the request body
    const transaction = await Transaction.findByIdAndUpdate(_id, updateData, { new: true });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message || "Something went wrong" });
  }
};

const deleteTransaction = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { _id } = req.body; // Expecting _id in the request body
    const transaction = await Transaction.findByIdAndDelete(_id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message || "Something went wrong" });
  }
};