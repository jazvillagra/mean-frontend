import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';

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
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOptions = [5, 10, 20, 100]
  private postsSub: Subscription = new Subscription();
  currentPage: number;

  constructor(public postsService: PostService) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, 1);
    this.isLoading = true;
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount:number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onDelete(id: string){
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });

  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
