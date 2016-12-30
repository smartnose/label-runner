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
import { ParserService, PositionService, SegmentedQuery, Chunk, LabelComponent, AdornerComponent } from '../shared/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  entryComponents: [LabelComponent, AdornerComponent]
})
export class HomeComponent implements OnInit, AfterViewChecked {
  errorMessage: string;
  query: string = '';
  segmentedLine: SegmentedQuery;
  temp: string;
  private childIndex: number;
  private labelComponents:Promise<ComponentRef<any>>[];
  private adornerComponents:Promise<ComponentRef<any>>[];
  private labelSections: Chunk[];
  private _labelComponentFactory: ComponentFactory<LabelComponent>;
  private _adonerComponentFacotry: ComponentFactory<AdornerComponent>;

  /**
   * Creates an instance of the HomeService with the injected
   * NameListService.
   *
   * @param {ParserService} parserService - The injected ParserService.
   */
  constructor(private _viewContainerRef: ViewContainerRef, 
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _injector: Injector,
              private _ngZone: NgZone,
              private _positionService: PositionService,
              public parserService: ParserService) {
                  this._labelComponentFactory = _componentFactoryResolver.resolveComponentFactory<LabelComponent>(LabelComponent);
                  this._adonerComponentFacotry = _componentFactoryResolver.resolveComponentFactory<AdornerComponent>(AdornerComponent);
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
          this.temp = JSON.stringify(segmentedLine);
          this.labelSections = [];
          this.labelSections.push(new Chunk(0, 0, "label", this.segmentedLine, this._positionService));
        },
        error =>this.errorMessage = <any>error
      )
  }
}
