

import {Component, ElementRef, Input, Output, OnChanges} from '@angular/core';
import {PositionService, BoundingBox, AbsolutePosition} from '../position/position.service';
import {Segment, LabelSection} from '../models';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<sd-adorner [position]=adornerPosition></sd-adorner><sd-label [position]=labelPosition></sd-label>`,
  providers: [PositionService],
  styleUrls: ['adorner.component.css']
})
export class ChunkComponent implements OnChanges {
    @Input() chunk: LabelSection;
    private adornerPosition: AbsolutePosition;
    private labelPosition: AbsolutePosition;
    private _nativeElement: any;

    constructor(private element:ElementRef, private positionService: PositionService) {
        this._nativeElement = element.nativeElement;
    }

    ngOnChanges() {
        console.log('data changes in sd-chunk');
        let boundingBox = this.chunk.boundingBox;
        if(!boundingBox) {
            boundingBox = {
                top : 0,
                left: 0,
                width: 50,
                height: 50
            }
        }

        console.log('bounding box before convertion');
        console.log(boundingBox)
        let relativeBox = this.positionService.convertDirectOffsetToRelative(boundingBox, this._nativeElement);
        this.adornerPosition = new AbsolutePosition(relativeBox);
        this.labelPosition = new AbsolutePosition(relativeBox);
    }
}