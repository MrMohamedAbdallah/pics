import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  image: any = null;
  showModal: boolean = false;
  constructor(private _imageService: ImageService, private _http: HttpClient) { }

  ngOnInit() {
    this._imageService.showModal.subscribe(img => {
      this.image = img;
      this.showModal = true;
    });
  }
  
  hideModal(){
    this.showModal = false;
  }

  download(e){
    e.preventDefault();

    this._http.get(this.image.image, {
      responseType: 'blob'
    }).subscribe((res: any)=>{
          let a = document.createElement("a");
          a.href = URL.createObjectURL(res.blob());
          a.download = this.image.image;
          // start download
          a.click();
    }, ()=>{
      console.log("sadf");
    });
  }

}
