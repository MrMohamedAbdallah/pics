import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  showModal: EventEmitter<any> = new EventEmitter<any>(); 

  constructor() { }
}
