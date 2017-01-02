import { Injectable } from '@angular/core';

import { Chunk, SegmentedQuery } from '../index'

@Injectable()
export class LabelingService {
  // The chunk currently in focus
  private _selectedChunk: Chunk;
  private _segmentedQuery: SegmentedQuery;
  constructor() {
  }

  public reset(segmentedQuery: SegmentedQuery) {
    this._segmentedQuery = segmentedQuery;
    this._selectedChunk.isSelected = false;
    this._selectedChunk = undefined;
  }

  public selectChunk(chunk: Chunk){
    chunk.isSelected = true;
    if(this._selectedChunk) {
      this._selectedChunk.isSelected = false;
    }

    this._selectedChunk = chunk;
  }
}