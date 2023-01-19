import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from '../post.model';
import { min } from "rxjs";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private mode = 'create';
  private postId: string = '';

  constructor(public postService: PostService, public route: ActivatedRoute){}

  ngOnInit(): void {
    //initialize form
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
    //get posts
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = this.getParam(paramMap, 'postId');
        // spinner start
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe(postData => this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content
          });
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          });
        //spinner end
        this.isLoading = false;
      } else {
        this.postId = '';
        this.mode = 'create';
      }
    });
  }
  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else if (this.mode === 'edit'){
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    //async task
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private getParam(paramMap: ParamMap, parameter: string): string {
    if (paramMap.has(parameter)) {
      if (paramMap.get(parameter) !== null) {
        return paramMap.get(parameter);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
