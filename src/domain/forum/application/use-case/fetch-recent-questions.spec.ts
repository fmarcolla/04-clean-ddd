import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentUseCase } from './fetch-recent-questions'

let sut: FetchRecentUseCase
let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchRecentUseCase(questionsRepository)
  })

  it('should be able to fetch recents questions', async () => {
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 9, 1),
      }),
    )
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 9, 2),
      }),
    )
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 9, 3),
      }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 9, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 2) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 1) }),
    ])
  })

  it('should be able to fetch paginated questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(2)
  })
})
