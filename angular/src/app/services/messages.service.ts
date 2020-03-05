import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private _toastr: ToastrService) { }

  /**
   * Display success message
   * @param msg string
   */
  success(title: string, subTitle: string = null){
    this._toastr.success(subTitle, title);
  }
}
