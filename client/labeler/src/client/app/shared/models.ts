import { ElementRef } from '@angular/core'
import {CSegmentedQuery, SegmentKind} from './contract'
import { Subject } from 'rxjs/Subject';

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
    }

    /**
     * Offset of the DOM element representing this line segment in its parent.
     */
    public offsetLeft: number;
    public offsetTop: number;
    public offsetWidth: number;
    public offsetHeight: number;

    public element: ElementRef;
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
export class LabelSection {
    start: number;
    end: number;
    label: string;
    isSelected: boolean;
    startIndexChanged: Subject<number>;
    endIndexChanged: Subject<number>;
    segments: Segment[];

    private segmentedQuery: SegmentedQuery

    /**
     * Try updating the start index of a label pattern.
     * The changed label pattern should not violate the constraint that no label patterns should overlap. 
     */
    public tryExpandLeft(neighoringPatterns: LabelSection[]): void {
        var newStart = this.findAlphaNumericSegmentOnTheLeft(this.start);
        if(newStart < 0 || this.containedInNeighoringPatterns(newStart, neighoringPatterns)) {
            return;
        }
        this.start = newStart;
        this.updateSegments();
        this.startIndexChanged.next(newStart);
    }
    public tryShrinkLeft(neighoringPatterns: LabelSection[]): void {
        var newStart = this.findAlphaNumericSegmentOnTheRight(this.start);
        if(newStart < 0 || newStart > this.end || this.containedInNeighoringPatterns(newStart, neighoringPatterns)) {
            return;
        }
        this.start = newStart;
        this.updateSegments();
        this.startIndexChanged.next(newStart);
    }
    public tryExpandRight(neighoringPatterns: LabelSection[]): void {
        var newEnd = this.findAlphaNumericSegmentOnTheRight(this.end);
        if(newEnd < 0 || newEnd >= this.segmentedQuery.segments.length || this.containedInNeighoringPatterns(newEnd, neighoringPatterns)) {
            return;
        }
        this.end = newEnd;
        this.updateSegments();
        this.endIndexChanged.next(newEnd);
    }
    public tryShrinkRight(neighoringPatterns: LabelSection[]): void {
        var newEnd = this.findAlphaNumericSegmentOnTheLeft(this.end);
        if(newEnd < 0 || newEnd < this.start || this.containedInNeighoringPatterns(newEnd, neighoringPatterns)) {
            return;
        }
        this.end = newEnd;
        this.updateSegments();
        this.endIndexChanged.next(newEnd);
    }
    private containedInNeighoringPatterns(position: number, neighoringPatterns: LabelSection[]): boolean {
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
        this.segments = segs.slice(this.start, this.end + 1).map(seg => <Segment>seg);
    }
}