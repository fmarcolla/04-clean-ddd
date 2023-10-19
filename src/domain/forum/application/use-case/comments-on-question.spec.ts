import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { QuestionCommentUseCase } from './comments-on-question'

let sut: QuestionCommentUseCase
let questionsRepository: InMemoryQuestionsRepository
let questionsCommentRepository: InMemoryQuestionsCommentRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Question Comment', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    questionsCommentRepository = new InMemoryQuestionsCommentRepository()

    sut = new QuestionCommentUseCase(
      questionsRepository,
      questionsCommentRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'New comment',
    })

    expect(questionsCommentRepository.items[0].content).toEqual('New comment')
  })
})
