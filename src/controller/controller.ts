import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';

import { expensesTable } from '@/db/schema/Schema.js';
import db from '@/db/db.js';

export const listExpenses = async (): Promise<void> => {
  const transactions = await db.select().from(expensesTable)
  const modifiedTransactions = transactions.map((transaction) => {return {...transaction, date: dayjs(transaction.date).format('D-MM-YYYY')}})
  console.table(modifiedTransactions)
}

export const addExpense = async ({description, amount}: {description: string; amount: number}) => {
  const newExpense: typeof expensesTable.$inferInsert = {
    date: new Date(Date.now()).toString(),
    description: description,
    amount
  }

  try {
    const addedExpense = await db.insert(expensesTable).values(newExpense)
    console.log(`Expense added successfully (ID: ${addedExpense.lastInsertRowid})`)
  } catch {
    console.log('Expense not added')
  }
}

export const summaryExpenses = async ({month}: {month?: number}) => {
  const expenses = await db.select().from(expensesTable)
  let summary: number

  if (month) {
    const monthString = dayjs().month(month - 1)
    summary = expenses.reduce((prevExp, currentExp) => {
      const currentDate = dayjs(currentExp.date)
      if (currentDate.month() === month - 1) {
        return prevExp + currentExp.amount
      }
      return prevExp
    }, 0)

    console.log(`Total expenses for ${monthString.format('MMMM')}: $${summary}`)
  } else {
    summary = expenses.reduce((prevExp, currentExp) => prevExp + currentExp.amount, 0)

    console.log(`Total expenses: $${summary}`)
  }
}

export const deleteExpense = async ({id}: {id: number}) => {
  try {
    await db.delete(expensesTable).where(eq(expensesTable.id, id))
    console.log('Expense deleted successfully')
  } catch {
    console.log('Expense not deleted')
  }
}