import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionsCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { FetchQuestionCommentUseCase } from './fetch-question-comments'

let sut: FetchQuestionCommentUseCase
let questionCommentsRepository: InMemoryQuestionsCommentRepository

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionsCommentRepository()
    sut = new FetchQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question answers', async () => {
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
