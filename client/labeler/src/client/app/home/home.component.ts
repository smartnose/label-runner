import { 
  Component, 
  OnInit, 
  AfterViewChecked,
} from '@angular/core';
import { ParserService, LabelingService, SegmentedQuery, Chunk } from '../shared/index';
import { Subject } from "rxjs";


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  errorMessage: string;
  query: string = 'these violent delights have violent ending';

  /**
   * Creates an instance of the HomeService with the injected
   * NameListService.
   *
   * @param {ParserService} parserService - The injected ParserService.
   */
  constructor(public parserService: ParserService, private _labelingService: LabelingService) {                 
  }

  /**
   * Initializes
   */
  ngOnInit() {
    
  }
  ngAfterViewChecked() {
  }
  
  parse() {
    this.parserService.get(this.query)
      .subscribe(
        segmentedLine => { 
          this._labelingService.reset(segmentedLine);
        },
        error =>this.errorMessage = <any>error
      )
  }
}
