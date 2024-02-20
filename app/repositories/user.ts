import { RepositoryBase } from '@/repositories/_repositoryBase'
import { users } from '@/schemas'

export class UserRepository extends RepositoryBase {
  async getUsers() {
    return await this.drizzle.select().from(users).all()
  }
}
