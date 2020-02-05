import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  user: any;

  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;
  @ViewChild("img", {static: false}) image: ElementRef;
  @ViewChild("dropBox", {static: false}) dropBox: ElementRef;
  @ViewChild("bar", {static: false}) bar: ElementRef;

  uploadFileError: string = null;
  uploading: boolean = false; // Upload status

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this._auth.userObserver.subscribe(user => {
      this.user = user;
    })
    this.user = this._auth.user;


    this.settingsForm = new FormGroup({
      name: new FormControl(this.user.name, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}),
      email: new FormControl(this.user.email, {validators: [Validators.required, Validators.email]}),
      website: new FormControl(this.user.website, {validators: [Validators.pattern("^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$")]}),
      bio: new FormControl(this.user.bio, {validators: [Validators.minLength(10), Validators.maxLength(200)]}),
      pic: new FormControl(null)
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
   * Submit the form to update the settings
   */
  updateSettings(){
    let value = this.settingsForm.value;
    let fd = new FormData();

    fd.append('name', value.name);
    fd.append('email', value.email);
    fd.append('website', value.website);
    fd.append('bio', value.bio);
    if(value.pic && !this.uploadFileError){
      fd.append('profile_pic', value.pic);
    }

    console.log(fd);

    this._auth.updateSettings(fd)
              .subscribe((event: any)=>{
                if(event.type == HttpEventType.UploadProgress){
                  this.uploading = true;
                  this.progressValue((event.loaded / event.total) * 100);
                } else if(event.type == HttpEventType.Response){
                    this._auth.updateUser(event.body.user);
                    this._auth.profile();
                  }
              }, console.error);
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
    this.uploadFileError = "";

    // Create url of the file
    let url = URL.createObjectURL(file);
    this.image.nativeElement.src = url;
  
    // Store the file on "pic" input
    this.settingsForm.get("pic").setValue(file);
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
    return this.settingsForm.get(inputName).invalid && this.settingsForm.get(inputName).touched;
  }

  getInputError(inputName: string, error: string){
    if(!this.settingsForm.get(inputName).touched) return false;

    if(this.settingsForm.get(inputName).errors == null) return false;

    return this.settingsForm.get(inputName).errors[error]; 
  }

}
