

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {PositionService, Offset, OffsetText} from '../position/position.service';
import {Segment, Chunk} from '../models';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<span style="background-color:yellow;" class="chunk" ngbTooltip="popover" #t="ngbTooltip" (click)="t.open()" triggers="manual"><span *ngFor="let seg of this.chunk.segments">{{seg.text}}</span></span>`,
  styleUrls: ['labeling.css']
})
export class ChunkComponent {
    @Input() chunk: Chunk;
    constructor() {
        
    }
}