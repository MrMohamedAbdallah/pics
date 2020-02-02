import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;

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
  }

  /**
   * Click to the upload box event
   */
  boxClicked(){
    this.fileInput.nativeElement.click();
  }

}
