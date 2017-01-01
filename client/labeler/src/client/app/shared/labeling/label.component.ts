import { Component, ElementRef, Input } from '@angular/core';
import { OffsetText } from '../position/position.service';
import { Segment, Chunk } from '../models';

@Component({
  selector: 'sd-label',
  moduleId: module.id,
  template: `<div class="label top" [ngStyle]="{top: offset.top, left: offset.left, display: block}">
        <div class="label-arrow"></div>
        <div class="label-inner">
            {{ content }}
        </div>
      </div>`,
  styleUrls: ['labeling.css']
})
export class LabelComponent {
    @Input() offset: OffsetText
    @Input() content: string;

    constructor(public elementRef:ElementRef) {
    }
}
