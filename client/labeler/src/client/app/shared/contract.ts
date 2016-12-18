/**
 * Keep these data structure in sync to-the-letter with our scala backend.
 * 'C' prefix here indicates its a contract class, to avoid client-side
 * data structures of similar names.
 */
export class Position {
    row: number;
    col: number;
    offset: number;
}
export enum SegmentKind {
    Token,
    Separator
}
export class CSegment {
    start: Position;
    end: Position;
    kind: SegmentKind;
}
export class Segmentation {
    segments: CSegment[];
}
export class CSegmentedQuery {
    query: String;
    segmentation: Segmentation
}