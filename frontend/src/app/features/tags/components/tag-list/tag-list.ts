import { Component, inject } from '@angular/core';
import { TagsService } from '../../services/tags-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tag-list',
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.scss',
})
export class TagList {
  public readonly displayedColumns: string[] = ['label', 'color', 'type'];
  public readonly tagsService = inject(TagsService);
}
