import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';

import { categories, expenses } from '@/db/schema/Schema.js';
import db from '@/db/db.js';

export const listExpenses = async (): Promise<void> => {
  const expensesList = await db.select().from(expenses).leftJoin(categories, eq(expenses.categoryId, categories.id))
  const modifiedExpensesList = expensesList.map((transaction) => {
    transaction.expenses.date = dayjs(transaction.expenses.date).format('D-MM-YYYY')
    return {
      id: transaction.expenses.id,
      date: transaction.expenses.date,
      description: transaction.expenses.description,
      amount: transaction.expenses.amount,
      category: transaction.categories?.name
    }
  })
  console.table(modifiedExpensesList)
}

export const addExpense = async ({description, amount, category}: {description: string; amount: number, category?: string}) => {
  let categoryId: number
  const categoryToUse = category?.trim().toLocaleLowerCase() || 'otros'

  const existingCategory = await db.select().from(categories).where(eq(categories.name, categoryToUse)).limit(1).execute().then((res) => res[0])
  if (existingCategory) {
    categoryId = existingCategory.id
    console.log(`Categoria encontrada: ${categoryToUse} (ID: ${categoryId.toString().toUpperCase()})`)
  } else {
    const newCategory = await db.insert(categories).values({name: categoryToUse}).returning({ id: categories.id }).execute()
    categoryId = newCategory[0].id
    console.log(`Categoria creada: ${categoryToUse} (ID: ${categoryId.toString().toUpperCase()})`)
  }

  
  const newExpense: typeof expenses.$inferInsert = {
    date: new Date(Date.now()).toString(),
    description: description,
    amount,
    categoryId: categoryId
  }

  try {
    const addedExpense = await db.insert(expenses).values(newExpense)
    console.log(`Expense added successfully (ID: ${addedExpense.lastInsertRowid})`)
  } catch {
    console.log('Expense not added')
  }
}

export const summaryExpenses = async ({month, category}: {month?: number, category?: string}) => {
  const expensesList = await db.select().from(expenses).leftJoin(categories, eq(expenses.categoryId, categories.id))
  let summary: number

  if (month && !category) {
    const monthString = dayjs().month(month - 1)
    summary = expensesList.reduce((prevExpAmount, currentExp) => {
      const currentDate = dayjs(currentExp.expenses.date)
      if (currentDate.month() === month - 1) {
        return prevExpAmount + currentExp.expenses.amount
      }
      return prevExpAmount
    }, 0)

    console.log(`Total expenses for ${monthString.format('MMMM')}: $${summary}`)
  } else if (!month && category) {
    summary = expensesList.reduce((prevExpAmount, currentExp) => {
      if (currentExp.categories?.name === category.toLowerCase()) {
        return prevExpAmount + currentExp.expenses.amount
      }
      return prevExpAmount
    }, 0)

    console.log(`Total expenses for the category ${category}: $${summary}`)
  } else if (month && category) {
    const monthString = dayjs().month(month - 1)
    summary = expensesList.reduce((prevExpAmount, currentExp) => {
      const currentDate = dayjs(currentExp.expenses.date)
      if (currentDate.month() === month - 1) {
        return prevExpAmount + currentExp.expenses.amount
      }
      return prevExpAmount
    }, 0)

    console.log(`Total expenses for ${monthString.format('MMMM')}: $${summary}`)
  } else {
    summary = expensesList.reduce((prevExpAmount, currentExp) => prevExpAmount + currentExp.expenses.amount, 0)

    console.log(`Total expenses: $${summary}`)
  }
}

export const deleteExpense = async ({id}: {id: number}) => {
  try {
    await db.delete(expenses).where(eq(expenses.id, id))
    console.log('Expense deleted successfully')
  } catch {
    console.log('Expense not deleted')
  }
}