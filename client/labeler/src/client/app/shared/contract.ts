/**
 * Keep these data structure in sync to-the-letter with our scala backend.
 */
export class Position {
    row: Number;
    col: Number;
    offset: Number;
}
export enum SegmentKind {
    Token,
    Separator
}
export class Segment {
    start: Position;
    end: Position;
    kind: SegmentKind;
}
export class Segmentation {
    segments: Segment[];
}
export class SegmentedQuery {
    query: String;
    segmentation: Segmentation
}