import { Component, OnInit } from '@angular/core';
import { ParserService, SegmentedQuery } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  errorMessage: string;
  query: string = '';
  segmentedLine: SegmentedQuery;
  temp: string;

  /**
   * Creates an instance of the HomeService with the injected
   * NameListService.
   *
   * @param {ParserService} parserService - The injected ParserService.
   */
  constructor(public parserService: ParserService) {}

  /**
   * Initializes
   */
  ngOnInit() {
    
  }
  
  parse() {
    this.parserService.get(this.query)
      .subscribe(
        segmentedLine => { 
          this.segmentedLine = segmentedLine;
          this.temp = JSON.stringify(segmentedLine) 
        },
        error =>this.errorMessage = <any>error
      )
  }
}
