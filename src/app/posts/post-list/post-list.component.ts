import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   { title: 'This is the first title',
  //     content: 'This is the first description'},
  //   { title: 'This is the second title',
  //     content: 'This is the second description'},
  //   { title: 'This is the third title',
  //     content: 'This is the third description'},
  // ];

  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();

  constructor(public postsService: PostService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(id: string){
    this.postsService.deletePost(id);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
