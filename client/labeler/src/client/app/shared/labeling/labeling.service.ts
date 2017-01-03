import { Injectable } from '@angular/core';

import { Chunk, SegmentedQuery, Segment } from '../index';
import { Subject } from "rxjs/Subject";

interface Map<T> {
    [K: string]: T;
}

class Tuple {
  key: string;
  priority: number;
}

@Injectable()
export class LabelingService {
  // The chunk currently in focus
  private _selectedChunk: Chunk;
  private _segmentedQuery: SegmentedQuery;
  public readonly queryChanged: Subject<SegmentedQuery> = new Subject<SegmentedQuery>();
  public readonly selectionChanged: Subject<Chunk> = new Subject<Chunk>();
  private _defaultLabel: string = "create a label here";

  // Keep track of all the labels entered so far to power typeahead.
  // TODO - refactor it out to something like typeahead service
  // For the moment, we only use whatever the user has entered for typeahead.
  // Once the user refreshes a page, these entries are lost.
  // In the future, we want to store them on the server side per user basis.
  public labels = new Array<string>();
  private readonly _labelSet: any = {};
  private _labelTally: number = 0;

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
    let startIdx = Math.min(start.index, end.index);
    let endIdx = Math.max(start.index, end.index);
    let chunk = this._segmentedQuery.createChunk(startIdx, endIdx, this._defaultLabel);
    chunk.labelSubscription = chunk.label.subscribe((label) => {
      let priority = this._labelSet[label];
      this._labelTally ++;
      this._labelSet[label] = this._labelTally;
    })

    this.labels = Object.entries(this._labelSet).sort((a, b) => b[1] - a[1]).map(e => e[0]);
  }
}