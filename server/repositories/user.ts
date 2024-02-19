import { users } from '@schemas'
import { RepositoryBase } from '@server/repositories/_repositoryBase'

export class UserRepository extends RepositoryBase {
  async getUsers() {
    return await this.drizzle.select().from(users).all()
  }
}
