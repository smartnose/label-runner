

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {PositionService, Offset, OffsetText} from '../position/position.service';
import {Segment, Chunk} from '../models';
import {LabelComponent} from './label.component';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<span style="background-color:yellow;border-radius: 10px"><span *ngFor="let seg of this.chunk.segments">{{seg.text}}</span></span>`,
  providers: [PositionService],
  styleUrls: ['labeling.css']
})
export class ChunkComponent {
    @Input() chunk: Chunk;
    constructor() {
        
    }
}