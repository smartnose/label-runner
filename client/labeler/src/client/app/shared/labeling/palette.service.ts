import { Injectable } from '@angular/core';
import { Chunk } from '../index'

@Injectable()
export class PaletteService {
  constructor() {

  }

  public getDefaultColor(): string {
    return "rgb(255, 255, 255)";
  }

  public getChunkColor(chunk: Chunk): string {
    return chunk.isSelected ? "rgb(0, 0, 255)" : "rgb(170, 255, 0)";
  }
}