import 'dotenv/config';
import { eq } from 'drizzle-orm';

import { expensesTable } from '@/db/schema/Schema.js';
import db from '@/db/index.js';

async function main() {
  const transaction: typeof expensesTable.$inferInsert = {
    date: new Date(Date.now()).toString(),
    description: "Transaccion de prueba",
    amount: 100
  }
  await db.insert(expensesTable).values(transaction);
  console.log('New user created!')
  const transactions = await db.select().from(expensesTable);
  console.log('Getting all users from the database: ', transactions)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
  // await db.delete(expensesTable).where(eq(expensesTable.description, transaction.description));
  // console.log('User deleted!')
}
main();