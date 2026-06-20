import { PostRepository } from '../../repositories/posts/PostRepository';

export class ListPostsService {
  constructor(private repository: PostRepository) {}

  async execute(groupId: string) {
    return this.repository.findByGroupId(groupId);
  }
}
