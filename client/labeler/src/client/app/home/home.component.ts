import { 
  Component, 
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver,
  OnInit, 
  AfterViewChecked,
  Injector,
  NgZone,
  ViewContainerRef 
} from '@angular/core';
import { ParserService, PositionService, SegmentedQuery, Chunk } from '../shared/index';


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
  segmentedLine: SegmentedQuery;
  private childIndex: number;
  private labelComponents:Promise<ComponentRef<any>>[];
  private adornerComponents:Promise<ComponentRef<any>>[];
  private chunks: Chunk[];

  /**
   * Creates an instance of the HomeService with the injected
   * NameListService.
   *
   * @param {ParserService} parserService - The injected ParserService.
   */
  constructor(public parserService: ParserService) {                 
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
          this.segmentedLine = segmentedLine;
          this.chunks = [];
          this.segmentedLine.createChunk(0, 1, "first label");
        },
        error =>this.errorMessage = <any>error
      )
  }
}
