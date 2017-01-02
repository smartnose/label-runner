import { Injectable } from '@angular/core';

import { Chunk } from '../index'

@Injectable()
export class LabelingService {
  // The chunk currently in focus
  private _selectedChunk: Chunk;
  
  constructor() {

  }

  public selectChunk(chunk: Chunk){
    chunk.isSelected = true;
    if(this._selectedChunk) {
      this._selectedChunk.isSelected = false;
    }

    this._selectedChunk = chunk;
  }
}