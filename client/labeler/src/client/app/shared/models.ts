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
    constructor(public readonly text: string, 
                public readonly kind: SegmentKind, 
                public readonly index: number) {
    }

    public assignedChunk: Chunk;
}

export class SpanLike {
    public readonly isSegment: boolean;
    public readonly segment: Segment;
    public readonly chunk: Chunk;
    
    public static fromSegment(segment: Segment): SpanLike {
        return {
            isSegment: true,
            segment: segment,
            chunk: undefined
        }
    }

    public static fromChunk(chunk: Chunk): SpanLike {
        return {
            isSegment: false,
            segment: undefined,
            chunk: chunk
        }
    }
}

/**
 * We currently assume that all the content stay in a single line.
 * TODO - let the backend separate the line and send over line
 * separation results to the front-end
 */
export class SegmentedQuery {
    segments: Segment[]
    spans: SpanLike[]
    constructor(segmentedQuery: CSegmentedQuery) {
        let query = segmentedQuery.query;
        this.segments = segmentedQuery.segmentation.segments.map((e, idx) => {
            return new Segment(query.substr(e.start.offset, e.end.offset - e.start.offset + 1), e.kind, idx);
        });
        this.spans = this.segments.map((s) => SpanLike.fromSegment(s));
    }

    public createChunk(start: number, end: number, label: string) {
        if(end < start)
            throw "The end must not be smaller than the start";
        this.validateIndex(start, "start");
        this.validateIndex(end, "end");
        let startIdx = this.spans.findIndex(span => span.isSegment && !span.segment.assignedChunk && span.segment.index === start);
        let endIdx = this.spans.findIndex(span => span.isSegment && !span.segment.assignedChunk && span.segment.index === end);
        let sliced = this.spans.slice(startIdx, endIdx + 1).map(s => s.segment);
        let chunk = new Chunk(label, sliced);

        this.spans.splice(startIdx, endIdx - startIdx + 1, SpanLike.fromChunk(chunk));
    }

    private validateIndex(idx: number, message: string) {
        if(idx < 0 || idx > this.segments.length - 1) 
            throw "The index must lie within range for:" + message;
    }
}

/**
 * A continuous sequence of line segments sharing same label
 */
export class Chunk {
    label: string;
    isSelected: boolean;
    segments: Segment[];

    constructor(label: string, segments: Segment[]) {
        this.label = label;
        this.segments = segments;
        segments.forEach(e => e.assignedChunk = this);
    }
}