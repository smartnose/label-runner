import { Component, ElementRef, ChangeDetectorRef, NgZone, Input, OnChanges } from '@angular/core';
import { PositionService, BoundingBox, AbsolutePosition } from '../position/position.service';
import { Segment, Chunk } from '../models';

@Component({
  selector: 'sd-label',
  moduleId: module.id,
  template: `<div class="label top" [ngStyle]="{top: position.top, left: position.left, display: display, position:absolute}">
        <div class="label-arrow"></div>
        <div class="label-inner">
            {{ content }}
        </div>
      </div>`,
  providers: [PositionService],
  styleUrls: ['adorner.component.css']
})
export class LabelComponent implements OnChanges {
    @Input() position: AbsolutePosition
    content: string;
    display: string;
    private _boundingBox: BoundingBox;
    private _labelSection: Chunk;
    private segments: Segment[];

    constructor(public elementRef:ElementRef, 
                private _ngZone: NgZone,
                private _positionService:PositionService, 
                private _changeDetectionRef : ChangeDetectorRef) {
        this.display = 'block';
        this.content = 'hello world';
        console.log(elementRef);
        let self = this;
    }

    ngOnChanges() {
        console.log(this.position);
    }
}
