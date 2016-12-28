import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';
import { SegmentedQuery, Segment } from '../index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-segment',
  template: '<span>{{segment.text}}</span>',
})
export class SegmentComponent implements AfterViewInit {
  @Input('segment')
  segment: Segment

  constructor(private el: ElementRef) {
  }

  /**
   * Track the screen position of the segment element
   */
  ngAfterViewInit() {
      this.segment.element = this.el
  }
}
