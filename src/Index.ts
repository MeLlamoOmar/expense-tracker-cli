#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { addExpense, deleteExpense, listExpenses, summaryExpenses } from "./controller/controller.js";

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
  .requiredOption('--description <description>', 'Flag to add the description of the expense')
  .requiredOption('--amount <amount>', 'Flag to add the amount of the expense')
  .action((options) => addExpense({...options, amount: Number(options.amount)}))

program
  .command('sumary')
  .description('Users can view a summary of all expenses.')
  .option('-m, --month <month>', 'Users can view a summary of expenses for a specific month (of current year).')
  .action((option) => summaryExpenses({month: Number(option.month)}))

program
  .command('delete')
  .description('Users can delete an expense by id of expense.')
  .requiredOption('--id <id>', 'Flag to delete an expense by id.')
  .action(option => deleteExpense({...option, id: Number(option.id)}))

program.parse()