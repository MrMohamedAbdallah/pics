import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @ViewChild("img", {static: true}) img: ElementRef;
  @ViewChild("gridItem", {static: true}) gridItem: ElementRef;
  @Input("image") image: any;
  @Output("loaded") loaded: EventEmitter<any> = new EventEmitter<any>();
  imgLoaded: boolean = false;
  constructor(private _elem: ElementRef, private _imageService: ImageService) { }

  ngOnInit() {
    this.image.image_small = "http://pics.test/" + this.image.image_small;
    this.image.image = "http://pics.test/" + this.image.image;

    this.image.user.profile_pic_small = this.image.user.profile_pic_small ? "http://pics.test/" + this.image.user.profile_pic_small : "/assets/images/user.png";

    this.img.nativeElement.onload = ()=>{
      this.loaded.emit(this._elem.nativeElement);
      this.imgLoaded = true;
    }
  }

  imgClicked(){
    this._imageService.showModal.emit(this.image);
  }

}
