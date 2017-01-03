import { Injectable } from '@angular/core';

import { Chunk, SegmentedQuery, Segment } from '../index';
import { Subject } from "rxjs/Subject";

@Injectable()
export class LabelingService {
  // The chunk currently in focus
  private _selectedChunk: Chunk;
  private _segmentedQuery: SegmentedQuery;
  public readonly queryChanged: Subject<SegmentedQuery> = new Subject<SegmentedQuery>();
  public readonly selectionChanged: Subject<Chunk> = new Subject<Chunk>();
  private _defaultLabel: string = "default label";

  public reset(segmentedQuery: SegmentedQuery) {
    this._segmentedQuery = segmentedQuery;
    if(this._selectedChunk) {
      this._selectedChunk.isSelected = false;
      this._selectedChunk = undefined;
    }
    this.queryChanged.next(segmentedQuery);
  }

  public selectChunk(chunk: Chunk){
    if(this._selectedChunk) {
      this._selectedChunk.isSelected = false;
    }

    chunk.isSelected = true;
    this._selectedChunk = chunk;
    this.selectionChanged.next(chunk);
  }

  public createChunk(start: Segment, end: Segment) {
    var startIdx = Math.min(start.index, end.index);
    var endIdx = Math.max(start.index, end.index);
    this._segmentedQuery.createChunk(startIdx, endIdx, this._defaultLabel);
  }
}