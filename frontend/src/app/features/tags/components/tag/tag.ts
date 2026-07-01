import { Component } from '@angular/core';
import { TagList } from '../tag-list/tag-list';

@Component({
  selector: 'app-tag',
  imports: [TagList],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
})
export class Tag {}
