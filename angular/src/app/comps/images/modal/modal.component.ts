import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  image: any = null;
  showModal: boolean = false;
  constructor(private _imageService: ImageService) { }

  ngOnInit() {
    this._imageService.showModal.subscribe(img => {
      this.image = img;
      this.showModal = true;
    });
  }
  
  hideModal(){
    this.showModal = false;
  }

}
