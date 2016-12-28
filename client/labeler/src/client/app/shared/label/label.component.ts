import { Component, ElementRef, ChangeDetectorRef, NgZone, Input } from '@angular/core';
import { PositionService, BoundingBox, AbsolutePosition } from '../position/position.service';
import { Segment, LabelSection } from '../models';

@Component({
  selector: 'sd-label',
  moduleId: module.id,
  template: `<div class="label top" [ngStyle]="{top: position.top, left: position.left, display: display}">
        <div class="label-arrow"></div>
        <div class="label-inner">
            {{ content }}
        </div>
      </div>`,
  providers: [PositionService],
  styleUrls: ['adorner.component.css']
})
export class LabelComponent {
    @Input() position: AbsolutePosition
    content: string;
    display: string;
    private _boundingBox: BoundingBox;
    private _labelSection: LabelSection;
    private segments: Segment[];

    constructor(public element:ElementRef, 
                private _ngZone: NgZone,
                private _positionService:PositionService, 
                private _changeDetectionRef : ChangeDetectorRef) {
        this.display = 'block';
        this.content = 'hello world';
        console.log(element);
        let self = this;
    }
}
