import { Directive, Output, HostListener, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appBottom]'
})
export class BottomDirective {

  @Output("appBottom") trigger: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private _elementRef: ElementRef) { }

  @HostListener("window:scroll", ["$event"])
  public onscroll(){
    if(window.scrollY + window.innerHeight > this._elementRef.nativeElement.offsetTop){
      this.trigger.emit(true);
    }
  }

}
