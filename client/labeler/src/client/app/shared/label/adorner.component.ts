import { Component, ElementRef, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { PositionService, AbsolutePosition} from '../position/position.service';
import { AnnotationService} from '../annotation/annotation.service';
import { Segment, LabelSection} from '../models';

@Component({
  selector: 'sd-adorner',
  moduleId: module.id,
  template: `
  <div class="label adorner"
    (click)="clicked();"
    [ngClass]="{selected:labelSection.isSelected}"
    [ngStyle]="{top: position.top, left: position.left, width: position.width, height: position.height, display: display}">
  </div>
  <div class="label adorner shadow" 
    (click)="clicked();" 
    [ngClass]="{selected:labelSection.isSelected}"
    [ngStyle]="{top: position.top, left: position.left, width: position.width, height: position.height, display: display}">
  </div>`,
  providers: [ PositionService ],
  styleUrls: ['adorner.component.css']
})
export class AdornerComponent {
    @Input() content: string;
    display: string;
    @Input() labelSection: LabelSection;
    @Input() position: AbsolutePosition;
    constructor(public element:ElementRef) {
        this.display = 'block';
        this.content = 'hello world';
        console.log(element);
        var self = this;
    }
    
    clicked() {
        //this._annotationService.SelectLabel(this.labelSection);
    }
}
