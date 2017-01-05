

import {Component, ElementRef, Input, Output, OnChanges, AfterViewInit, ViewChild, AfterViewChecked, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import {Segment, Chunk} from '../models';
import { Subscription, Observable} from 'rxjs/Rx';
import { LabelingService } from './labeling.service';
import { PaletteService } from './palette.service';

@Component({
  selector: 'sd-chunk',
  moduleId: module.id,
  template: `<template #tipContent>
                <span class="label" *ngIf="!chunk.isSelected">{{chunk.label|async}}</span>
                <!--If selected, allow user to edit the label-->
                <input #inputBox type="text" *ngIf="chunk.isSelected" class="form-control" [ngbTypeahead]="search" [(ngModel)]="label" (keypress)="onKeyPress($event)"/>
            </template>` + 
            // The template below must not have any blanks or new lines
            // between the elements.
            // Otherwise browers will not display a sentence correctly.
            `<span [ngStyle]="{'background-color': color}" class="chunk" [ngbPopover]="tipContent" #popover="ngbPopover" triggers="manual" (click)='onClick()' (keypress)="onKeyPress($event)">`+
                `<span *ngFor="let seg of this.chunk.segments">{{seg.text}}</span>` + 
            `</span>`,
  styleUrls: ['labeling.css']
})
export class ChunkComponent implements AfterViewChecked, AfterViewChecked, OnChanges {
    @Input() chunk: Chunk;

    // In theory, we can use strongly typed NgbPopover class, but
    // ng2-boostrap type definition is not well organized for the
    // moment.
    @ViewChild('popover') popover: any;
    color: string;

    @ViewChildren('inputBox') inputBox: QueryList<ElementRef>;

    private inputBoxElement: ElementRef;
    label: string;

    constructor(private _changeDetect:ChangeDetectorRef, 
                private _labelingService: LabelingService,
                private _palatteService: PaletteService) {
        this.color = _palatteService.getDefaultColor();
    }

    ngAfterViewChecked() {
        this.popover.open();
        this._changeDetect.detectChanges();
    }

    ngAfterViewInit() {
        this.inputBox.changes.subscribe((children: QueryList<ElementRef>) => {
            this.inputBoxElement = children.first;
            
            // Update background color to highlight the selected chunk.
            this.color = this._palatteService.getChunkColor(this.chunk);

            // Have to use a timeout here because when the view is initialized,
            // the input box data binding has not fully finished yet. The input 
            // box contains no text, so calling select() have no effect.
            // By putting the function in a timeout, we effectively let it 
            // wait till angular data binding cycle finishes.
            setTimeout(() => {
                this.tryFocusingOnLabelInput();
            });
        })

        this.onClick()
    }

    ngOnChanges() {
        this.color = this._palatteService.getChunkColor(this.chunk);
    }

    onClick() {
        let latestLabel = this.chunk.label.getValue();
        if(latestLabel) {
            this.label = latestLabel;
        }
        this._labelingService.selectChunk(this.chunk);
        this.tryFocusingOnLabelInput();
        let self = this;
        let subscription = this._labelingService.selectionChanged.subscribe((c)=> {
            if(c !== self.chunk) {
                subscription.unsubscribe();
                self.color = self._palatteService.getChunkColor(self.chunk);
                self._changeDetect.detectChanges();
            }
        });
    }

    onKeyPress($event: any) {
        console.log($event);
        if($event.key === 'Enter' && this.label) {
            let trimmedLabel = this.label.trim()
            if(trimmedLabel !== "") {
                this.chunk.label.next(trimmedLabel);

                // Finished editing, reset our selection.
                this._labelingService.unselect();
            }
        }
    }

    /**
     * We use arrow function here, so 'this' can be properly 
     * bound to the component object. Otherwise, 'this' is undefined.
     * See documentation of typeahead callback function for more details.
     */
    search = (text$: Observable<string>) => {
        return text$.debounceTime(200)
                    .distinctUntilChanged()
                    .map(term => this.createTypeAheadCandiates(term));
    }

    private tryFocusingOnLabelInput() {
        if(this.inputBoxElement)
            this.inputBoxElement.nativeElement.select();
    }

    private createTypeAheadCandiates(term: string): string[] {
        if(term.length < 1)
            return [];
        let service = this._labelingService;
        let candidates = service.labels.filter(v => new RegExp(term, 'gi').test(v) && v !== term)
                                       .splice(0, 10);
        
        // Also add whatever the user is currently typing in the candidates.
        // Otherwise, if the user hits enter, typeahead will fill the input
        // with first suggested candidate that might alter user input.
        candidates.unshift(term);
        return candidates;
    }
}