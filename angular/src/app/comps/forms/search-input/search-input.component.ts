import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  searchForm: FormGroup;
  
  constructor(private _router: Router) { 

    this._router.routeReuseStrategy.shouldReuseRoute = ()=> false;
  }

  ngOnInit() {

    this.searchForm = new FormGroup({
      query: new FormControl(null)
    });
  }

  submitSearch(){
    if(this.searchForm.value.query.trim()){
      this._router.navigate(['/search', this.searchForm.value.query]);
    }
  }

}
