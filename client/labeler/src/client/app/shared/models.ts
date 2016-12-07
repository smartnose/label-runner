import {Segment, SegmentedQuery, SegmentKind} from './contract'

export class LineSegment {
    constructor(public text: string, public kind: SegmentKind) {
    }
}

/**
 * We currently assume that all the content stay in a single line.
 * TODO - let the backend separate the line and send over line
 * separation results to the front-end
 */
export class SegmentedLine {
    segments: LineSegment[]
    constructor(private segmentedQuery: SegmentedQuery) {
        let query = segmentedQuery.query;
        this.segments = segmentedQuery.segmentation.segments.map(e => {
            return new LineSegment(query.substr(e.start.offset, e.end.offset - e.start.offset + 1), e.kind);
        });
    }
}
