import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  searchForm: FormGroup;
  
  constructor() { }

  ngOnInit() {

    this.searchForm = new FormGroup({
      query: new FormControl(null)
    });

    this.searchForm.valueChanges.subscribe(console.log);
    
  }

}
