

import {Component, ElementRef, Input, Output, OnChanges} from '@angular/core';
import {PositionService, BoundingBox, AbsolutePosition} from '../position/position.service';
import {Segment, Chunk} from '../models';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<sd-adorner *ngIf='adornerPosition' [position]=adornerPosition></sd-adorner>
            <sd-label *ngIf='labelPosition' [position]=labelPosition></sd-label>`,
  providers: [PositionService],
  styleUrls: ['adorner.component.css']
})
export class ChunkComponent implements OnChanges {
    @Input() chunk: Chunk;
    private adornerPosition: AbsolutePosition;
    private labelPosition: AbsolutePosition;
    private _nativeElement: any;
    private subscription: Subscription;

    constructor(private element:ElementRef, private positionService: PositionService) {
        this._nativeElement = element.nativeElement;
    }

    ngOnChanges() {
        console.log('data changes in sd-chunk');
        let boundingBox = this.chunk.boundingBoxChanged;
        if(boundingBox) {
            if(this.subscription) this.subscription.unsubscribe();
            this.subscription = boundingBox.subscribe((b) => {
                this.updatePositions(b);
            })
        }

        if(this.chunk.boundingBox) {
            this.updatePositions(this.chunk.boundingBox);
        }
    }

    private updatePositions(boundingBox: BoundingBox) {
        let relativeBox = this.positionService.convertDirectOffsetToRelative(boundingBox, this._nativeElement);
        this.adornerPosition = new AbsolutePosition(relativeBox);
        this.labelPosition = new AbsolutePosition(relativeBox);
    }
}