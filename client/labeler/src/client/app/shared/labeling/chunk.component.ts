

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {PositionService, Offset, OffsetText} from '../position/position.service';
import {Segment, Chunk} from '../models';
import {LabelComponent} from './label.component';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<sd-adorner [offset]=adornerOffset></sd-adorner>
            <sd-label [offset]=labelOffset [content]=chunk.label></sd-label>`,
  providers: [PositionService],
  styleUrls: ['labeling.css']
})
export class ChunkComponent implements AfterViewInit, AfterViewChecked {
    @Input() chunk: Chunk;
    private adornerOffset: OffsetText = { top: '0px', left: '0px', width: '50px', height: '50px' };
    private labelOffset: OffsetText = { top: '0px', left: '0px', width: '50px', height: '50px' };
    private _nativeElement: any;
    private subscription: Subscription;
    
    @ViewChild(LabelComponent) labelComponent: LabelComponent;

    constructor(private element:ElementRef, private positionService: PositionService, private _changeDetect: ChangeDetectorRef) {
        this._nativeElement = element.nativeElement;
    }

    ngAfterViewInit() {
        this.updatePositions();
    }

    ngAfterViewChecked() {
        this.updatePositions();
    }
    private updatePositions() {
        if(!this.chunk.offset)
            return;

        this.adornerOffset = this.positionService.shiftToParent(this.chunk.offset, this.positionService.parentOffsetEl(this._nativeElement));

        if(this.labelComponent) {

            let labelNativeElement = this.labelComponent.elementRef.nativeElement;
            let labelEl = Array.from(labelNativeElement.querySelectorAll('.label.top'))[0];

            let labelBoundingBox = this.positionService.boundingBox([labelEl]);
            console.log("label bounding box width:");
            console.log(labelBoundingBox.width);
            let newBoundingBox = this.positionService.alignOnTop(labelBoundingBox, this.chunk.offset);
            this.labelOffset = this.positionService.shiftToParent(newBoundingBox, this.getOffsetParent(this.chunk));
            this._changeDetect.detectChanges();
        }
    }

    private getOffsetParent(chunk: Chunk): any {
        if(chunk.segments[0].elementRef) {
            let nativeElement = chunk.segments[0].elementRef.getValue().nativeElement;
            return this.positionService.parentOffsetEl(nativeElement);
        }

        return undefined;
    }
}