import { drizzle } from 'drizzle-orm/d1'

export abstract class RepositoryBase {
  protected readonly drizzle

  constructor(DB: D1Database) {
    this.drizzle = drizzle(DB)
  }
}
