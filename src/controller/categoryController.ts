import db from "@/db/db.js"
import { categories } from "@/db/schema/Schema.js"
import { eq } from "drizzle-orm"

export const categoryController = async ({list, add, deleteId}: {list?: boolean, add?: string, deleteId?: number}) => {
  if (list) {
    const categoriesList = await db.select().from(categories)

    console.table(categoriesList)
  } else if (add) {
    const newCategory: typeof categories.$inferInsert = {
      name: add.trim().toLowerCase()
    }

    try {
      await db.insert(categories).values(newCategory).returning()
      console.log(`La categoria ${newCategory.name} ha sido agregada`)
    } catch (error) {
      console.log('Hubo problemas agregando la categoria')
    }
  } else if (deleteId) {
    try {
      const deletedCategory = await db.delete(categories).where(eq(categories.id, deleteId)).returning()
      console.log(`Categoria ${deletedCategory[0].name} borrada exitosamente`)
    } catch (error) {
      console.log('Hubo problemas borrando la categoria')
    }
  }
}