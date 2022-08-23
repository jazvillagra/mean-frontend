import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from '../post.model';
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  constructor(public postService: PostService){}

  onAddPost(postForm: NgForm){
    if(postForm.invalid){
      return;
    }
    const post: Post = {
      id: postForm.value.id,
      title: postForm.value.title,
      content: postForm.value.content
    };
    this.postService.addPost(postForm.value.id, postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }
}
