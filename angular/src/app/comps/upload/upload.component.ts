import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {

  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;
  @ViewChild("img", {static: false}) image: ElementRef;
  @ViewChild("dropBox", {static: false}) dropBox: ElementRef;
  @ViewChild("tagInput", {static: false}) tagInput: ElementRef;
  @ViewChild("bar", {static: false}) bar: ElementRef;

  uploadForm: FormGroup;
  
  uploadFileError: string = null;
  tagsError: string = null;
  uploading: boolean = false; // Upload status

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]}),
      description: new FormControl(null,  {validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)]}),
      tags: new FormArray([],  {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)]}),
      image: new FormControl(null, {validators: [Validators.required]})
    });

  }
  
  ngAfterViewInit(){
    // File input change event
    this.fileInput.nativeElement.addEventListener("change", (e: any)=>{
      this.storeFileValue(this.fileInput.nativeElement.files[0]);
    });
    

    // DropBox events
    let box = this.dropBox.nativeElement;
    
    // Drop event
    box.addEventListener("drop", (e: any) =>{
      e.stopPropagation();
      e.preventDefault();
      
      this.storeFileValue(e.dataTransfer.files[0]);
    })
    // Drag over the element event
    box.addEventListener("dragover", (e: any) =>{
      e.stopPropagation();
      e.preventDefault();
      
      e.dataTransfer.dropEffect = "copy";
    })
    
  }



  /**
   * Click to the upload box event
   */
  boxClicked(){
    this.fileInput.nativeElement.click();
  }



  /**
   * Show the image
   * Store file object to the image input
   * @param file 
   */
  storeFileValue(file: File){
    
    //Validate file size
    let fileSize = file.size / 1024 / 1024;
    if(fileSize > 2){
      this.uploadFileError = "The file must be less than 2MB";
      return;
    }

    // Create url of the file
    let url = URL.createObjectURL(file);
    this.image.nativeElement.src = url;
  
    // Store the file on "image" input
    this.uploadForm.get("image").setValue(file);
  }

  /**
   * Add tag when user write space
   */
  tagValueChanges(){
    
    // Get input value
    let value = this.tagInput.nativeElement.value;
    

    
    if(value[value.length - 1] != ' ') return;
    
    if(value.length < 4){
      this.tagsError = "Tag can't be less than 3 characters long";
      return;
    }
    if(value.length > 11){
      this.tagsError = "Tag can't be more than 10 characters long";
      return;
    }

    // Remove spacing
    value = value.trim();
    let tags = value.split(' ');

    if(tags.length > 1) return;
    
    

    if((<FormArray>this.uploadForm.get("tags")).length >= 5 && tags.length){
      this.tagInput.nativeElement.value = "";
      this.tagsError = "Can't add more that 5 tags";
      return;
    }
    this.tagsError = "";




    
    (<FormArray>this.uploadForm.get("tags")).push(new FormControl(tags[0], {validators: [Validators.minLength(3), Validators.maxLength(10)]}));

    this.tagInput.nativeElement.value = "";
  }

  /**
   * Remove tag from the tags array
   * @param i 
   */
  removeTag(i: number){
    this.tagsError = "";
    (<FormArray>this.uploadForm.get("tags")).removeAt(i);
  }

  /**
   * Upload the image to the server
   */
  uploadImage(){
    let fd = new FormData();
    let values = this.uploadForm.value;

    fd.append("title", values.title);
    fd.append("description", values.description);
    fd.append("image", values.image);
    for(let i = 0; i < values.tags.length; i++){
      fd.append("tags[" + i + "]", values.tags[i]);
    }
    
    this._auth.uploadImage(fd).subscribe(
      ((event)=>{
        if(event.type == HttpEventType.UploadProgress){
          this.uploading = true;
          console.log(this);
          this.progressValue((event.loaded / event.total) * 100);
        } else if (event.type == HttpEventType.Response){
          this.uploading = false;
          // Redirect the user to the profile
          this._auth.profile();
        }
      }).bind(this),
      console.error
    );
  }

  
  /**
   * Set the progress bar value
   * 
   * @param value number
   */
  progressValue(value: number){
    console.log(value);
    this.bar.nativeElement.style.width = value + "%";
  }


  /**
   * Return if the input is valid or ont
   * @param inputName string
   */
  isNotValid(inputName: string){
    return this.uploadForm.get(inputName).invalid && this.uploadForm.get(inputName).touched;
  }


}
