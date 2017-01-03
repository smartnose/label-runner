import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { ParserService } from './parser/index';
import { LabelingService } from './labeling/labeling.service';
import { PaletteService } from './labeling/palette.service';
import { LabelingComponent } from './labeling/labeling.component';
import { ChunkComponent } from './labeling/chunk.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  declarations: [ToolbarComponent, NavbarComponent, ChunkComponent, LabelingComponent],
  exports: [ToolbarComponent, NavbarComponent,
    ChunkComponent,
    LabelingComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ ParserService, LabelingService, PaletteService ]
    };
  }
}
