import { Component, ElementRef, Input } from '@angular/core';
import { OffsetText} from '../position/position.service';
import { AnnotationService} from '../annotation/annotation.service';
import { Segment, Chunk} from '../models';

@Component({
  selector: 'sd-adorner',
  moduleId: module.id,
  template: `
  <div class="label adorner"
    (click)="clicked();"
    [ngClass]="{selected:isSelected}"
    [ngStyle]="{top: offset.top, left: offset.left, width: offset.width, height: offset.height, display: display}">
  </div>
  <div class="label adorner shadow" 
    (click)="clicked();" 
    [ngClass]="{selected:isSelected}"
    [ngStyle]="{top: offset.top, left: offset.left, width: offset.width, height: offset.height, display: display}">
  </div>`,
  styleUrls: ['labeling.css']
})
export class AdornerComponent {
    @Input() content: string;
    display: string;
    isSelected: boolean = false;
    @Input() labelSection: Chunk;
    @Input() offset: OffsetText;
    constructor(public elementRef:ElementRef) {
        this.display = 'block';
        this.content = 'hello world';
        console.log(elementRef);
        var self = this;
    }
    
    clicked() {
        //this._annotationService.SelectLabel(this.labelSection);
    }
}
