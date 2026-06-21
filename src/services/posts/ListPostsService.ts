import { PostRepository } from '../../repositories/posts/PostRepository';

export class ListPostsService {
  constructor(private repository: PostRepository) {}

  async execute(groupId: string, page: number = 1, limit: number = 20) {
    return this.repository.findByGroupId(groupId, page, limit);
  }
}
