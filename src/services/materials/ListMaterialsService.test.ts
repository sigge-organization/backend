import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListMaterialsService } from './ListMaterialsService';
import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

const fakeMaterials = [
  {
    id: 'material-1',
    title: 'Apostila de Cálculo',
    external_url: 'https://example.com/apostila.pdf',
    deleted_at: null,
    uploadedBy: { id: 'user-1', name: 'João', email: 'joao@mail.com' },
  },
  {
    id: 'material-2',
    title: 'Lista de Exercícios',
    external_url: 'https://example.com/lista.pdf',
    deleted_at: null,
    uploadedBy: { id: 'user-2', name: 'Maria', email: 'maria@mail.com' },
  },
];

describe('ListMaterialsService', () => {
  let repository: MaterialRepository;
  let service: ListMaterialsService;

  beforeEach(() => {
    vi.clearAllMocks();

    repository = {
      findByGroupId: vi.fn(),
    } as unknown as MaterialRepository;

    service = new ListMaterialsService(repository);
  });

  it('deve retornar os materiais do grupo', async () => {
    vi.mocked(repository.findByGroupId).mockResolvedValue(fakeMaterials as any);

    const result = await service.execute('group-1');

    expect(result).toEqual(fakeMaterials);
  });

  it('deve chamar o repository com o groupId correto', async () => {
    vi.mocked(repository.findByGroupId).mockResolvedValue(fakeMaterials as any);

    await service.execute('group-abc');

    expect(repository.findByGroupId).toHaveBeenCalledWith('group-abc');
    expect(repository.findByGroupId).toHaveBeenCalledOnce();
  });

  it('deve retornar lista vazia quando o grupo não tem materiais', async () => {
    vi.mocked(repository.findByGroupId).mockResolvedValue([]);

    const result = await service.execute('group-vazio');

    expect(result).toEqual([]);
  });
});
