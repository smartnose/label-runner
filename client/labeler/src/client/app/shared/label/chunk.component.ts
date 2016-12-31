

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {PositionService, BoundingBox, AbsolutePosition} from '../position/position.service';
import {Segment, Chunk} from '../models';
import {LabelComponent} from './label.component';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<sd-adorner *ngIf='adornerPosition' #adorner [position]=adornerPosition></sd-adorner>
            <sd-label [position]=labelPosition></sd-label>`,
  providers: [PositionService],
  styleUrls: ['adorner.component.css']
})
export class ChunkComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() chunk: Chunk;
    private adornerPosition: AbsolutePosition = { top: '0px', left: '0px', width: '50px', height: '50px' };
    private labelPosition: AbsolutePosition = { top: '0px', left: '0px', width: '50px', height: '50px' };
    private _nativeElement: any;
    private subscription: Subscription;
    
    @ViewChild(LabelComponent) labelComponent: LabelComponent;

    constructor(private element:ElementRef, private positionService: PositionService, private _changeDetect: ChangeDetectorRef) {
        this._nativeElement = element.nativeElement;
    }

    ngOnChanges() {
        console.log('data changes in sd-chunk');
        let boundingBox = this.chunk.boundingBoxChanged;
        if(this.subscription) this.subscription.unsubscribe();

        this.subscription = boundingBox.subscribe((b) => {
            this.updatePositions(b);
        })  
            
        this.updatePositions(this.chunk.boundingBox);
    }

    ngAfterViewInit() {
        this.updatePositions(this.chunk.boundingBox);
    }

    ngAfterViewChecked() {
        this.updatePositions(this.chunk.boundingBox);
    }
    private updatePositions(boundingBox: BoundingBox) {
        if(!boundingBox)
            return;

        let relativeBox = this.positionService.shiftToParent(boundingBox, this._nativeElement);

        this.adornerPosition = new AbsolutePosition(relativeBox);

        if(this.labelComponent) {
            let adornerNativeElement = this.labelComponent.elementRef.nativeElement.children[0];
            let adornerBoundingBox = this.positionService.boundingBox([adornerNativeElement]);
            let newBoundingBox = this.positionService.alignOnTop(adornerBoundingBox, this.chunk.boundingBox);
            newBoundingBox = this.positionService.shiftToParent(newBoundingBox, this._nativeElement);
            this.labelPosition = new AbsolutePosition(newBoundingBox);    
            this._changeDetect.detectChanges();
        }
    }
}