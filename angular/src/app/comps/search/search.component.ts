import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  
  query: string = null;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.query = this._activatedRoute.snapshot.paramMap.get("query");
  }

}
