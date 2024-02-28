import { describe, expect, jest, mock, test } from 'bun:test'
import { contextMock, postInputFixture, postRepositoryMock } from '@/__tests__'
import { faker } from '@faker-js/faker'
import { PostDomain } from './post'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// PostDomainの依存モジュールをモックする
mock.module('@/repositories/post', () => ({
  PostRepository: jest.fn().mockImplementation(() => postRepositoryMock),
}))
/**
 * =============================
 * テストケースの実装
 * =============================
 */
describe('#createPost', () => {
  const subject = new PostDomain(contextMock)
  const userId = faker.lorem.word()
  const input = postInputFixture.build()
  test('userIdとinputを引数にrepository.createPostがコールされること', async () => {
    await subject.createPost(userId, input)

    expect(postRepositoryMock.createPost).toHaveBeenCalledWith({
      id: expect.any(String),
      userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      ...input,
    })
  })
})

describe('#paginatePosts', () => {
  const subject = new PostDomain(contextMock)
  test('引数を指定しない場合、そのままrepository.paginatePostsがコールされること', async () => {
    await subject.pagenatePosts()

    expect(postRepositoryMock.paginatePosts).toHaveBeenCalled()
  })
  test('引数を指定した場合、それに応じてrepository.paginatePostsがコールされること', async () => {
    const pageInput = { limit: faker.number.int(), offset: faker.number.int() }

    await subject.pagenatePosts(pageInput)

    expect(postRepositoryMock.paginatePosts).toHaveBeenCalledWith(pageInput)
  })
})

describe('#paginatePostsByUserId', () => {
  const subject = new PostDomain(contextMock)
  const userId = faker.lorem.word()
  test('userIdのみを指定しない場合、userIdに応じたrepository.paginatePostsByUserIdがlimit=0,offset=0でコールされること', async () => {
    await subject.paginatePostsByUserId(userId)

    expect(postRepositoryMock.paginatePostsByUserId).toHaveBeenCalledWith(
      userId,
      {
        limit: 10,
        offset: 0,
      },
    )
  })
  test('userIdとページネーション引数を指定した場合、それに応じてrepository.paginatePostsByUserIdがコールされること', async () => {
    const pageInput = { limit: faker.number.int(), offset: faker.number.int() }

    await subject.paginatePostsByUserId(userId, pageInput)

    expect(postRepositoryMock.paginatePostsByUserId).toHaveBeenCalledWith(
      userId,
      pageInput,
    )
  })
})

describe('#getPost', () => {
  const subject = new PostDomain(contextMock)
  const postId = faker.lorem.word()
  test('IDを引数にrepository.getPostがコールされること', async () => {
    await subject.getPost(postId)

    expect(postRepositoryMock.getPost).toHaveBeenCalledWith(postId)
  })
})

describe('#deletePost', () => {
  const subject = new PostDomain(contextMock)
  const postId = faker.lorem.word()
  test('IDを引数にrepository.deletePostがコールされること', async () => {
    await subject.deletePost(postId)

    expect(postRepositoryMock.deletePost).toHaveBeenCalledWith(postId)
  })
})
