import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logged: boolean = false;   // Logged state indicator

  @ViewChild('navbar', {static: false}) navbar: ElementRef;  // Navbar element

  constructor() { }

  ngOnInit() {
 
  }

  /**
   * Show & hide navbar menu in small devices
   */
  toggleMenu(){
    let navbar = this.navbar.nativeElement;
    console.log("HERE");

    if(navbar.classList.contains("show")){
      navbar.classList.remove("show");
    } else {
      navbar.classList.add("show");
    }
  }


}
