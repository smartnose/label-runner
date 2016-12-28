import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { ParserService } from './parser/index';
import { SegmentComponent } from './segment/segment.component';
import { LabelComponent } from './label/label.component';
import { AdornerComponent } from './label/adorner.component';
import { ChunkComponent } from './label/chunk.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ToolbarComponent, NavbarComponent, SegmentComponent, LabelComponent, AdornerComponent, ChunkComponent],
  exports: [ToolbarComponent, NavbarComponent, 
    SegmentComponent, LabelComponent, AdornerComponent,
    ChunkComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ParserService]
    };
  }
}
