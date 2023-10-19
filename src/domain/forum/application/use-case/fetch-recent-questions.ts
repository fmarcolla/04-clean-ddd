import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentUseCaseRequest {
  page: number
}

type FetchRecentUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentUseCaseRequest): Promise<FetchRecentUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecents({ page })

    return right({ questions })
  }
}
