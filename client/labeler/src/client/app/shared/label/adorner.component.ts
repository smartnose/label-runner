import { Component, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { PositionService, BoundingBox} from '../position/position.service';
import { AnnotationService} from '../annotation/annotation.service';
import { Segment, LabelSection} from '../models';

@Component({
  selector: 'adorner-component',
  moduleId: module.id,
  template: `
  <div class="label adorner"
    (click)="clicked();"
    [ngClass]="{selected:labelSection.isSelected}"
    [ngStyle]="{top: top, left: left, width: width, height: height, display: display}">
  </div>
  <div class="label adorner shadow" 
    (click)="clicked();" 
    [ngClass]="{selected:labelSection.isSelected}"
    [ngStyle]="{top: top, left: left, width: width, height: height, display: display}">
  </div>`,
  providers: [PositionService],
  styleUrls: ['adorner.component.css']
})
export class AdornerComponent implements AfterViewChecked {
    left: string;
    top: string;
    height: string;
    width: string;
    content: string;
    display: string;
    labelSection: LabelSection;
    private _boundingBox: BoundingBox;
    private segments: Segment[];
    constructor(public element:ElementRef,
        private _annotationService:AnnotationService,
        private _positionService:PositionService,
        private _changeDetectionRef : ChangeDetectorRef) {
        this.display = 'block';
        this.top = 50 + 'px';
        this.left = 10 + 'px';
        this.content = 'hello world';
        console.log(element);
        var self = this;
        this._annotationService.selectedSection.subscribe((newSection) => {
           console.log(self.labelSection.isSelected);
        });
    }
    ngAfterViewChecked() {
        if(this._boundingBox !== null) {
            this.top = this._boundingBox.top + 'px';
            this.left = this._boundingBox.left + 'px';
            this.width = this._boundingBox.width + 'px';
            this.height = this._boundingBox.height + 'px';
            this._changeDetectionRef.detectChanges();
        }
    }
    position(labelSection: LabelSection) {
        this.labelSection = labelSection;
        var self = this;
        this.updatePosition();
        labelSection.startIndexChanged.subscribe((start) => {
            self.updatePosition();
        });
        labelSection.endIndexChanged.subscribe((end) => {
            self.updatePosition();
        });
    }
    clicked() {
        this._annotationService.SelectLabel(this.labelSection);
    }
    private updatePosition() {
        var labelSection = this.labelSection;
        this.segments = labelSection.segments;
        var nativeElements = this.segments.map(e => e.element.nativeElement);
        this._boundingBox = this._positionService.boundingBox(nativeElements);
    }
}
