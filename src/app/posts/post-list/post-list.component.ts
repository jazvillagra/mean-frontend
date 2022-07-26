import { Component, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  // posts = [
  //   { title: 'This is the first title',
  //     content: 'This is the first description'},
  //   { title: 'This is the second title',
  //     content: 'This is the second description'},
  //   { title: 'This is the third title',
  //     content: 'This is the third description'},
  // ];
  @Input() posts: Post[] = [];
}
