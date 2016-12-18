import { Component, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { SegmentedLine, LineSegment } from '../index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-segment',
  template: '<span>{{segment.text}}</span>',
})
export class SegmentComponent implements AfterViewChecked {
  @Input('segment')
  segment: LineSegment

  constructor(private el: ElementRef) {
  }

  /**
   * Initializes
   */
  ngAfterViewChecked() {
      let ele = this.el.nativeElement;
      let seg = this.segment;
      seg.offsetTop = ele.offsetTop;
      seg.offsetLeft = ele.offsetLeft;
      seg.offsetWidth = ele.offsetWidth;
      seg.offsetHeight = ele.offsetHeight;
      console.log(seg);
  }
}
