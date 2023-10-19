import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswersCommentRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let sut: DeleteAnswerCommentUseCase
let answersCommentRepository: InMemoryAnswersCommentRepository

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    answersCommentRepository = new InMemoryAnswersCommentRepository()

    sut = new DeleteAnswerCommentUseCase(answersCommentRepository)
  })

  it('should be able to delete comment on answer', async () => {
    const answerComment = makeAnswerComment()
    await answersCommentRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(answersCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await answersCommentRepository.create(answerComment)

    const reponse = await sut.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    })

    expect(reponse.isLeft()).toBe(true)
    expect(reponse.value).toBeInstanceOf(NotAllowedError)
  })
})
