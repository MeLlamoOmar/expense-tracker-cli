import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const expensesTable = sqliteTable('expenses', {
  id: int().primaryKey({autoIncrement: true}),
  date: text().notNull(),
  description: text().notNull(),
  amount: int().notNull()
})
