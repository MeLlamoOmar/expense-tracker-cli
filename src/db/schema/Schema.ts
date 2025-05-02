import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const expenses = sqliteTable('expenses', {
  id: int().primaryKey({autoIncrement: true}),
  date: text().notNull(),
  description: text().notNull(),
  amount: int().notNull(),
  categoryId: int('category_id').notNull()
})

export const categories = sqliteTable('categories', {
  id: int().primaryKey(),
  name: text().notNull()
})

export const expenseRelation = relations(expenses, ({ one }) => ({
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id]
  })
}))

export const categoryRelation = relations(categories, ({ many }) => ({
  expenses: many(expenses)
}))