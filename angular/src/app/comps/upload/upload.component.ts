import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {

  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;
  @ViewChild("img", {static: false}) image: ElementRef;
  @ViewChild("dropBox", {static: false}) dropBox: ElementRef;

  uploadForm: FormGroup;
  
  uploadFileError: string = null;
  uploading: boolean = false; // Upload status

  constructor() { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      title: new FormControl(null),
      description: new FormControl(null),
      tags: new FormArray([
        new FormControl('natural'),
        new FormControl('dark')
      ]),
      image: new FormControl(null)
    });
    this.uploadForm.valueChanges.subscribe(console.log);
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
    
    // Create url of the file
    let url = URL.createObjectURL(file);
    this.image.nativeElement.src = url;
  
    // Store the file on "image" input
    this.uploadForm.get("image").setValue(file);
  }

}
