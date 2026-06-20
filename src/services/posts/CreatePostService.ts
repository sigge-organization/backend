import { PostRepository, CreatePostDTO } from '../../repositories/posts/PostRepository';

export class CreatePostService {
  constructor(private repository: PostRepository) {}

  async execute(data: CreatePostDTO) {
    if (!data.content) {
      throw new Error("Content is required");
    }
    return this.repository.create(data);
  }
}
