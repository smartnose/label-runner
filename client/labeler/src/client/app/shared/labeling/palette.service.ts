import { Injectable } from '@angular/core';

@Injectable()
export class PaletteService {
  constructor() {

  }

  public getLabelColor(label: String): string {
    let c = 255;
    return c.toString(16);
  }
}