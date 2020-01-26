import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as Colcade from "colcade";

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, AfterViewInit {

  @ViewChild("grid", { static: false }) grid: ElementRef;
  @Input("url") url: string;
  nextURL: string = "";
  imagesArray: string[] = [];
  colc: Colcade;
  loading: boolean = false; // Loading images state
  searched: boolean = false;

  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.colc = new Colcade(this.grid.nativeElement, {
      columns: '.grid-col',
      items: '.grid-item'
    });

    this.loadImages(this.url);
    
  }


  /**
   * Load images
   */
  loadImages(url){
    if(this.loading == true)  return;

    this.loading = true;

    // API call
    this._http.get(url).subscribe((res: any)=>{
      this.loading = false;
      this.searched = true;

      this.nextURL = res.next_page_url;
      let imagesArray: any[] = res.data;
      
      this.imagesArray = this.imagesArray.concat(imagesArray);

      for(let image of imagesArray){
        // this.addImage(image);
      }
    }, ()=>{
      this.loading = false;
      this.searched = true;
    });
  }

  // Loading next page images
  loadNext(){
    this.loadImages(this.nextURL);
  }
 


  addImage(image: any){
      /*

        <div class="card-info">
          <div class="user-info">
            <img src="/images/user.jpg"/>
            <a href="#">John Doe</a>
          </div>
          <div class="download-btn">
            <i class="fas fa-arrow-down"></i>
          </div>
        </div>
      */
      // Create image element with lazy load "loading in the background first"
      let div = this.createDiv("grid-item img-card");  // Container for the iamge
  
      let img = document.createElement("img");  // Image element
      let cardInfo = this.createDiv("card-info");
      let userInfo = this.createDiv("card-info");
      let downBtn = this.createDiv("download-btn");
      let userImage = document.createElement("img");
      userImage.src = image.user.profile_pic_small ? image.user.profile_pic_small : '/assets/images/user.png';
      
      // Will trigger after the image is loaded in the background
      img.onload = ()=>{
        div.appendChild(img);
        this.colc.append(div);  // Appending the image container to the grid
      };
      img.src = "http://pics.test/" + image.image_small;  // Assign the source of the image to the url
  }

  createDiv(className = ""){
    let div = document.createElement("div");
    div.className = className;
    return div;
  }

  load(div: any){
    // console.log(div);
    this.colc.append(div);
  }

}