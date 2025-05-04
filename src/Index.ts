#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { addExpense, deleteExpense, listExpenses, summaryExpenses } from "./controller/controller.js";
import { categoryController } from "./controller/categoryController.js";

const program = new Command();

program
  .name('expense-tracker')
  .description('Simple expense tracker to manage your finances.')
  .version('1.0.0')

program
  .command('list')
  .description('List all the transactions')
  .action(listExpenses)

program
  .command('add')
  .description('Users can add an expense with a description and amount.')
  .requiredOption('-d, --description <description>', 'Flag to add the description of the expense')
  .requiredOption('-a, --amount <amount>', 'Flag to add the amount of the expense')
  .option('-c, --category <category>', 'Flag to add a category to the expense')
  .action((options) => addExpense({...options, amount: Number(options.amount)}))

program
  .command('summary')
  .description('Users can view a summary of all expenses.')
  .option('-m, --month <month>', 'Users can view a summary of expenses for a specific month (of current year).')
  .option('-c, --category <category>', 'Allow users to filter expenses by category.')
  .action((options) => summaryExpenses({...options ,month: Number(options.month)}))

program
  .command('delete')
  .description('Users can delete an expense by id of expense.')
  .requiredOption('--id <id>', 'Flag to delete an expense by id.')
  .action(option => deleteExpense({...option, id: Number(option.id)}))

program
  .command('category')
  .option('-a, --add <addCategory>', 'Flag to add a category')
  .option('-l, --list', 'Flag to show all the categories')
  .option('-d, --delete <deleteId>', 'Flag to delete a category')
  .action(options => categoryController({...options, deleteId: Number(options.delete)}))

program.parse()