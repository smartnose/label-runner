

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {Segment, Chunk} from '../models';
import { Subscription} from 'rxjs/Rx';
import { LabelingService } from './labeling.service'

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<template #tipContent>{{chunk.label}}</template>` + 
            `<span [style.background]="color" class="chunk" [class.highlighted]="chunk.isSelected" [ngbTooltip]="tipContent" #tooltip="ngbTooltip" triggers="manual" (click)='onClick()'>`+
                `<span *ngFor="let seg of this.chunk.segments">{{seg.text}}</span>` + 
            `</span>`,
  styleUrls: ['labeling.css']
})
export class ChunkComponent implements AfterViewChecked {
    @Input() chunk: Chunk;

    // In theory, we can use strongly typed NgbTooltip class, but
    // ng2-boostrap type definition is not well organized for the
    // moment.
    @ViewChild('tooltip') tooltip: any;
    color: string;
    constructor(private _changeDetect:ChangeDetectorRef, 
                private _labelingService: LabelingService) {
        let c = 255;
        this.color = c.toString(16);
    }

    ngAfterViewChecked() {
        this.tooltip.open();
        this._changeDetect.detectChanges();
    }

    onClick() {
        this._labelingService.selectChunk(this.chunk);
    }
}