import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswersCommentRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { FetchAnswerCommentUseCase } from './fetch-answer-comments'

let sut: FetchAnswerCommentUseCase
let answerCommentsRepository: InMemoryAnswersCommentRepository

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswersCommentRepository()
    sut = new FetchAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
