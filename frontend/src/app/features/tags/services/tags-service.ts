import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { ApiEndpoints } from '../../../core/consts/api-endpoints';
import { Observable } from 'rxjs';
import { Tag } from '../components/tag/tag';

@Service()
export class TagsService {
  public readonly data = computed(() => this.tags.value() ?? []);

  private readonly api = ApiEndpoints.tags;
  private readonly http = inject(HttpClient);

  public readonly tags = httpResource<Tag[]>(() => ({
    url: this.api,
    method: 'GET',
  }));

  public details(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.api}/${id}`);
  }
}
