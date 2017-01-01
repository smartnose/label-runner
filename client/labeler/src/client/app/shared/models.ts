import { ElementRef } from '@angular/core';
import { CSegmentedQuery, SegmentKind } from './contract';
import { Offset, OffsetText, PositionService } from './position/position.service';
import { BehaviorSubject, Subject, Subscription, Observable } from 'rxjs/Rx'

/**
 * Client models containing various client-specific state data.
 * Data contract classes are wrapped or converted to client models.
 * When user updates client model, the client model data gets converted
 * back to data contract data types and sent over to the server for 
 * persistence.
 */

/**
 * A segment in the segmented query
 */
export class Segment {
    constructor(public text: string, public kind: SegmentKind) {
        this.elementRef = new BehaviorSubject<ElementRef>(null);
    }

    public elementRef: BehaviorSubject<ElementRef>;
}

/**
 * We currently assume that all the content stay in a single line.
 * TODO - let the backend separate the line and send over line
 * separation results to the front-end
 */
export class SegmentedQuery {
    segments: Segment[]
    constructor(segmentedQuery: CSegmentedQuery) {
        let query = segmentedQuery.query;
        this.segments = segmentedQuery.segmentation.segments.map(e => {
            return new Segment(query.substr(e.start.offset, e.end.offset - e.start.offset + 1), e.kind);
        });
    }
}

/**
 * A continuous sequence of line segments sharing same label
 */
export class Chunk {
    start: number;
    end: number;
    label: string;
    isSelected: boolean;
    startIndexChanged: Subject<number>;
    endIndexChanged: Subject<number>;
    
    offset: Offset;
    offsetChanged: Subject<Offset> = new Subject<Offset>();
    segments: Segment[];

    private segmentChanged: Observable<ElementRef>;
    private segmentChangedSubscription: Subscription;

    constructor(start: number, end: number, label: string, segmentedQuery: SegmentedQuery, private positionService: PositionService) {
        this.start = start;
        this.end = end;
        this.label = label;
        this.startIndexChanged = new Subject<number>();
        this.endIndexChanged = new Subject<number>();
        this.segmentedQuery = segmentedQuery;
        this.updateSegments();
        // this.boundingBox = positionService.boundingBox(this.segments);
    }

    private segmentedQuery: SegmentedQuery

    private tryUpdateBoundingBox(segments: Segment[]): boolean {
        if(segments.filter(e => e.elementRef.getValue() == null).length > 0)
            return false;
        let newBoundingBox = this.positionService.boundingBox(segments.map(e => e.elementRef.getValue().nativeElement));
        this.offsetChanged.next(newBoundingBox);
        this.offset = newBoundingBox;
        return true;
    }

    /**
     * Try updating the start index of a label pattern.
     * The changed label pattern should not violate the constraint that no label patterns should overlap. 
     */
    public tryExpandLeft(neighoringPatterns: Chunk[]): void {
        var newStart = this.findAlphaNumericSegmentOnTheLeft(this.start);
        if(newStart < 0 || this.containedInNeighoringPatterns(newStart, neighoringPatterns)) {
            return;
        }
        this.start = newStart;
        this.updateSegments();
        this.startIndexChanged.next(newStart);
    }
    public tryShrinkLeft(neighoringPatterns: Chunk[]): void {
        var newStart = this.findAlphaNumericSegmentOnTheRight(this.start);
        if(newStart < 0 || newStart > this.end || this.containedInNeighoringPatterns(newStart, neighoringPatterns)) {
            return;
        }
        this.start = newStart;
        this.updateSegments();
        this.startIndexChanged.next(newStart);
    }
    public tryExpandRight(neighoringPatterns: Chunk[]): void {
        var newEnd = this.findAlphaNumericSegmentOnTheRight(this.end);
        if(newEnd < 0 || newEnd >= this.segmentedQuery.segments.length || this.containedInNeighoringPatterns(newEnd, neighoringPatterns)) {
            return;
        }
        this.end = newEnd;
        this.updateSegments();
        this.endIndexChanged.next(newEnd);
    }
    public tryShrinkRight(neighoringPatterns: Chunk[]): void {
        var newEnd = this.findAlphaNumericSegmentOnTheLeft(this.end);
        if(newEnd < 0 || newEnd < this.start || this.containedInNeighoringPatterns(newEnd, neighoringPatterns)) {
            return;
        }
        this.end = newEnd;
        this.updateSegments();
        this.endIndexChanged.next(newEnd);
    }
    private containedInNeighoringPatterns(position: number, neighoringPatterns: Chunk[]): boolean {
        return neighoringPatterns.findIndex((pattern) => pattern !== this && pattern.start <= position && pattern.end >= position) >= 0;
    }
    private findAlphaNumericSegmentOnTheLeft(position: number): number {
        var segments = this.segmentedQuery.segments;
        for(var i = position - 1; i >=0; i --) {
            if(segments[i].kind === SegmentKind.Token) {
                return i;
            }
        }
        return -1;
    }
    private findAlphaNumericSegmentOnTheRight(position: number): number {
        var segments = this.segmentedQuery.segments;
        for(var i = position + 1; i < segments.length; i ++) {
            if(segments[i].kind === SegmentKind.Token) {
                return i;
            }
        }
        return -1;
    }
    private updateSegments() {
        var segs = this.segmentedQuery.segments;

        this.segments = segs.slice(this.start, this.end + 1);

        if(this.segmentChangedSubscription) 
            this.segmentChangedSubscription.unsubscribe();

        let subjects = this.segments.map(e => e.elementRef);
        this.segmentChanged = Observable.merge(...subjects);
        this.segmentChangedSubscription = this.segmentChanged.subscribe(() => {
            console.log('try update bounding box')
            this.tryUpdateBoundingBox(this.segments);
        })
    }
}