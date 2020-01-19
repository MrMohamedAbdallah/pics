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
      this.nextURL = res.next_page_url;
      let imagesArray: any[] = res.data;
  
      this.imagesArray.concat(imagesArray);
  
      for(let iamge of imagesArray){
        this.addImage("http://pics.test" + iamge.image_small);
      }
    }, ()=>{
      this.loading = false;
    });
  }

  // Loading next page images
  loadNext(){
    this.loadImages(this.nextURL);
  }
 


  addImage(url){
      // Create image element with lazy load "loading in the background first"
      let div = document.createElement("div");  // Container for the iamge
      div.className = "grid-item";  
      let img = document.createElement("img");  // Image element 
      // Will trigger after the image is loaded in the background
      img.onload = ()=>{
        div.appendChild(img);
        this.colc.append(div);  // Appending the image container to the grid
      };
      img.src = url;  // Assign the source of the image to the url
  }
}
