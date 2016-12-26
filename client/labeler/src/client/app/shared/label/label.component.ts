import {Component, ElementRef, OnInit, AfterViewChecked, ChangeDetectorRef, NgZone} from '@angular/core';
import {PositionService, BoundingBox} from '../position/position.service';
import {Segment, LabelSection} from '../models';

@Component({
  selector: 'sd-label',
  moduleId: module.id,
  template: `<div class="label top" [ngStyle]="{top: top, left: left, display: display}">
        <div class="label-arrow"></div>
        <div class="label-inner">
            {{ content }}
        </div>
      </div>`,
  providers: [PositionService]
})
export class LabelComponent implements OnInit {
    left: string;
    top: string;
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
        this.top = 50 + 'px';
        this.left = 10 + 'px';
        this.content = 'hello world';
        console.log(element);
        let self = this;
        //this._ngZone.onStable.subscribe(() => {self.updatePosition()});
    }
    ngOnInit() {
        var position = this._positionService.offset(this.element.nativeElement);
        console.log(position);
    }
    private updatePosition() {
        if(this._boundingBox !== null) {
            console.log(this._boundingBox);
            var position = this._positionService.poisitionElementToBoundingBox(this._boundingBox, this.element.nativeElement.children[0]);
            this.top = position.top + 'px';
            this.left = position.left + 'px';
            //this._changeDetectionRef.detectChanges();
        }
    }
    position(labelSection: LabelSection) {
        this._labelSection = labelSection;
        this.updateViewModel();
        var self = this;
        this._labelSection.startIndexChanged.subscribe(() => {
            self.updateViewModel();
        });
        this._labelSection.endIndexChanged.subscribe(() => {
            self.updateViewModel();
        });
        this.updatePosition();
    }
    private updateViewModel() {
        this.segments = this._labelSection.segments;
        var nativeElements = this.segments.map(e => e.element.nativeElement);
        this._boundingBox = this._positionService.boundingBox(nativeElements);
        this.content = this._labelSection.label;
    }
}
