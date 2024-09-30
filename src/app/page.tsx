"use client";
import { useState, useEffect } from "react";
import { signOut, useSession, signIn } from "next-auth/react";
import { Button } from "@mui/material";
import styles from "./page.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Transaction {
  _id: string;
  amount: string;
  note: string;
  type: string;
  date: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "_id">>({
    amount: "",
    date: "",
    type: "income",
    note: ""
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session) {
        await signIn();
        return;
      }
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    };

    fetchTransactions();
  }, [session]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set userId from session
    const transactionWithUserId = {
      ...newTransaction,
      userId: session?.user
    };

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionWithUserId),
    });

    if (res.ok) {
      const transaction = await res.json();
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        amount: "",
        date: "",
        type: "income",
        note: ""
      });
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const netBalance = totalIncome - totalExpense;

  const chartData = transactions.map(t => ({
    date: t.date,
    income: t.type === "income" ? parseFloat(t.amount) : 0,
    expense: t.type === "expense" ? parseFloat(t.amount) : 0,
  }));

  if (session) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Welcome, {session.user?.email}</h1>
        
        <Button variant="contained" onClick={() => signOut()}>
          Logout
        </Button>

        <form onSubmit={handleAddTransaction} className={styles.formdis}>
          <input
            className={styles.formin}
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            required
          />
          <input
            className={styles.formin}
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            required
          />
          <select
            className={styles.formin}
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            className={styles.formin}
            type="text"
            placeholder="Note"
            value={newTransaction.note}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, note: e.target.value })
            }
            required
          />
          <button type="submit" className={styles.formin}>Add Transaction</button>
        </form>

        <ul className={styles.ul}>
          {transactions.map((transaction) => (
            <li key={transaction._id} className={`${styles.ul} ${transaction.type === "income" ? styles.transactionTypeIncome : styles.transactionTypeExpense}`}>
              <span>{transaction.date}:</span> {transaction.type} - {transaction.amount} ({transaction.note})
            </li>
          ))}
        </ul>

        <div className={styles.financialSummary}>
          <h2 className={styles.subtitle}>Total Income: {totalIncome}</h2>
          <h2 className={styles.subtitle}>Total Expense: {totalExpense}</h2>
          <h2 className={styles.subtitle}>Net Balance: {netBalance}</h2>
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.subtitle}>Transaction Chart</h2>
          <LineChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" />
            <Line type="monotone" dataKey="expense" stroke="#ff0000" />
          </LineChart>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.page}>
        <Button variant="contained" href="/signin">
          Login
        </Button>
      </div>
    );
  }
}
