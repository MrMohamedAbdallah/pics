import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  image: any = null;
  index: number = null;
  showModal: boolean = false;
  user: any = null;
  @Output("delete") deleteEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _imageService: ImageService, private _http: HttpClient, private _auth: AuthService) { }

  ngOnInit() {
    this._imageService.showModal.subscribe(data => {
      this.image = data.img;
      this.index = data.index;
      this.showModal = true;
    });

    this.user = this._auth.getUser();
    this._auth.userObserver.subscribe((user)=>{
      this.user = user;
    });
  }
  
  hideModal(){
    this.showModal = false;
  }

  download(e){
    e.preventDefault();

    
      let a = document.createElement("a");
      let url = "http://pics.test/api/download/" + this.image.id
      a.href = url;
      a.download = url;
      // start download
      a.click();
    
  }

  /**
   * Delete an image
   */
  delete(){
    if(confirm("Are you sure you want to delete this image?")){
      /**
       * Get the access token
       * Send a delete request to the server
       * Delete the image from the view
       */
      
       let access_token = this._auth.access_token;
      
       let headers = new HttpHeaders().set("Accept", "application/json").set("Authorization", "Bearer " + access_token);

       this._http.delete("http://pics.test/api/images/" + this.image.id, {
         headers: headers
       }).subscribe(
         (data)=>{
           // Delete the image from the view
            this.deleteEmitter.emit(this.index);
            // Hide the modal
            this.hideModal();
         },
         (err)=>{
           console.error("Error while deleting the image");
         },
         ()=>{},
       );
       

    }
  }

}
