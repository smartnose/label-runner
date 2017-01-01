
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  async
} from '@angular/core/testing';
import { mockSegmentedQuery } from '../contract.spec'

import { SharedModule } from '../shared.module'
import { PositionService, CSegmentedQuery, Segment, SegmentedQuery, Chunk } from '../index';

export function main() {
  describe('Chunck component', () => {
    // setting module for testing
    // Disable old forms
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports:[SharedModule],
        declarations: [TestChunkComponent],
        providers: [
          PositionService
        ]
      });
    });

    it('should create and position label and adorner', async(() => {
      TestBed
        .compileComponents()
        .then(() => {
          let fixture = TestBed.createComponent(TestChunkComponent);
          fixture.autoDetectChanges();
          fixture.detectChanges();
          fixture.detectChanges();
          fixture.detectChanges();
          fixture.detectChanges();
          console.log(fixture.isStable());

          expect(fixture);
          let debugNode = fixture.debugElement.children[0];
          let instance = <TestChunkComponent>debugNode.componentInstance;
          let domEl = debugNode.nativeElement;
          expect(instance);
          expect(domEl.querySelectorAll('.label.top').length).toEqual(1);
          let labelEl = Array.from(domEl.querySelectorAll('.label.top'))[0];
          let spans = Array.from(domEl.querySelectorAll('span'));
          expect(spans.length).toEqual(6);
          let positionService = new PositionService();

          // The label is only sitting on the first span, since the chunk has only 1 span
          let spanBoundingBox = positionService.boundingBox([spans[0]]);
          let labelBoundingBox = positionService.boundingBox([labelEl]);

          // We currently assume the label and spans should share the same offset parent.
          expect(labelBoundingBox.offsetParentEl).toBe(spanBoundingBox.offsetParentEl);
          let shiftedBoundingBox = positionService.alignOnTop(labelBoundingBox, spanBoundingBox);

          /*
          expect(shiftedBoundingBox.top).toBeCloseTo(labelBoundingBox.top, 0, "top should be close");
          expect(shiftedBoundingBox.left).toBeCloseTo(labelBoundingBox.left, 0, "left should be close");
          expect(shiftedBoundingBox.width).toBeCloseTo(labelBoundingBox.width, 0, "width");
          expect(shiftedBoundingBox.height).toBeCloseTo(labelBoundingBox.height, 0, "height");
          */
        })    
    }));
  });
};

@Component({
    selector: 'test-chunk-component',
    template: `
    <div style="position:absolute;margin-top:100px;margin-left:100px">
      <div>
        <sd-segment *ngFor="let seg of segmentedLine.segments" [segment]="seg"></sd-segment>
      </div>
      <div *ngIf="chunks">
        <sd-chunk *ngFor="let chunk of chunks" [chunk]="chunk"></sd-chunk>
      </div>
    </div>`
})
class TestChunkComponent {
  segmentedLine: SegmentedQuery = new SegmentedQuery(mockSegmentedQuery);
  chunks: Chunk[] = new Array<Chunk>();
  constructor() {
    this.chunks.push(new Chunk(0, 0, "hello world", this.segmentedLine, new PositionService()));
  }
}