

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {Segment, Chunk} from '../models';
import { Subscription} from 'rxjs/Rx';
import { LabelingService } from './labeling.service';
import { PaletteService } from './palette.service';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<template #tipContent>
                <span class="label" *ngIf="!chunk.isSelected">{{chunk.label}}</span>
                <!--If selected, allow user to edit the label-->
                <input type="text" *ngIf="chunk.isSelected" class="form-control" [(ngModel)]="chunk.label" />
            </template>` + 
            // The template below must not have any blanks or new lines
            // between the elements.
            // Otherwise browers will not display a sentence correctly.
            `<span [ngStyle]="{'background-color': color}" class="chunk" [ngbPopover]="tipContent" #popover="ngbPopover" triggers="manual" (click)='onClick()'>`+
                `<span *ngFor="let seg of this.chunk.segments">{{seg.text}}</span>` + 
            `</span>`,
  styleUrls: ['labeling.css']
})
export class ChunkComponent implements AfterViewChecked, OnChanges {
    @Input() chunk: Chunk;

    // In theory, we can use strongly typed NgbPopover class, but
    // ng2-boostrap type definition is not well organized for the
    // moment.
    @ViewChild('popover') popover: any;
    color: string;

    constructor(private _changeDetect:ChangeDetectorRef, 
                private _labelingService: LabelingService,
                private _palatteService: PaletteService) {
        this.color = _palatteService.getDefaultColor();
    }

    ngAfterViewChecked() {
        this.popover.open();
        this._changeDetect.detectChanges();
    }

    ngOnChanges() {
        this.color = this._palatteService.getChunkColor(this.chunk);
    }

    onClick() {
        this._labelingService.selectChunk(this.chunk);
        let self = this;
        let subscription = this._labelingService.selectionChanged.subscribe((c)=> {
            if(c !== self.chunk) {
                subscription.unsubscribe();
                self.color = self._palatteService.getChunkColor(self.chunk);
                self._changeDetect.detectChanges();
            }
        });
        this.color = this._palatteService.getChunkColor(this.chunk);
    }
}