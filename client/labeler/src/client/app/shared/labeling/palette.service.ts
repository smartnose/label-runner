import { Injectable } from '@angular/core';
import { Chunk } from '../index'

/**
 * Providing coloring scheme for labels.
 * For example, a user might want "Verb" to be displayed in a 
 * different color than "Adjective".
 * The service is currently a dumb stub waiting to be implemented.
 */
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