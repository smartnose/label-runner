import { 
  Component, 
  OnInit, 
  Input,
  AfterViewChecked,
} from '@angular/core';
import { LabelingService, SegmentedQuery, Chunk, Segment, SpanLike } from '../index';
import { Subject } from "rxjs";


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-labeling',
  templateUrl: 'labeling.component.html',
})
export class LabelingComponent {
  segmentedQuery: SegmentedQuery;
  private _lastSegment: Segment

  constructor(private _labelingService: LabelingService) {
    _labelingService.queryChanged.subscribe(q => this.segmentedQuery = q);
  }

  public onMouseDown(span: SpanLike) {
      if(span.isSegment) {
        this._lastSegment = span.segment;
      }
  }

  public onMouseUp(span: SpanLike) {
    if(span.isSegment && this._lastSegment) {
      this._labelingService.createChunk(this._lastSegment, span.segment);
      this._lastSegment = undefined;
    }
  }
}
