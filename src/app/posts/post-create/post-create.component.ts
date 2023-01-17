import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  private mode = 'create';
  private postId: string = '';

  constructor(public postService: PostService, public route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.postId = this.getParam(paramMap, 'postId');
        this.mode = 'edit';
        this.postService.getPost(this.postId)
          .subscribe(postData =>
              this.post = {
                id: postData._id,
                title: postData.title,
                content: postData.content
              }
          );
      } else {
        this.postId = '';
        this.mode = 'create';
      }
    });
  }
  onSavePost(postForm: NgForm){
    if(postForm.invalid){
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(postForm.value.title, postForm.value.content);
    } else if (this.mode === 'edit'){
      this.postService.updatePost(this.postId, postForm.value.title, postForm.value.content);
    }

    postForm.resetForm();
  }

  private getParam(paramMap: ParamMap, parameter: string): string {
    if (paramMap.has(parameter)) {
      if (paramMap.get(parameter) !== null) {
        return paramMap.get(parameter)!;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
