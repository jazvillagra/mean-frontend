import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Post } from "./post.model";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      })).subscribe((transformedPost) => {
        this.posts = transformedPost.posts;
        this.postsUpdated.next([...this.posts])
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(id: string, title: string, content: string) {
    const post: Post = {id: '', title: title, content: content};
    this.http.post('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log('Response data: ', responseData);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
