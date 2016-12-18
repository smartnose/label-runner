import {Segment, SegmentedQuery, SegmentKind} from './contract'

/**
 * Client models containing various client-specific state data.
 * Data contract classes are wrapped or converted to client models.
 * When user updates client model, the client model data gets converted
 * back to data contract data types and sent over to the server for 
 * persistence.
 */

/**
 * A segment in a single line.
 */
export class LineSegment {
    constructor(public text: string, public kind: SegmentKind) {
    }

    /**
     * Offset of the DOM element representing this line segment in its parent.
     */
    public offsetLeft: number;
    public offsetTop: number;
    public offsetWidth: number;
    public offsetHeight: number;
}

/**
 * We currently assume that all the content stay in a single line.
 * TODO - let the backend separate the line and send over line
 * separation results to the front-end
 */
export class SegmentedLine {
    segments: LineSegment[]
    constructor(segmentedQuery: SegmentedQuery) {
        let query = segmentedQuery.query;
        this.segments = segmentedQuery.segmentation.segments.map(e => {
            return new LineSegment(query.substr(e.start.offset, e.end.offset - e.start.offset + 1), e.kind);
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
}