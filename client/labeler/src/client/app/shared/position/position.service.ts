import {
    Injectable,
    ElementRef
} from '@angular/core';

/**
 * Offset of an HTML element.
 */
export class Offset {
    width: number;
    height: number;
    top: number;
    left: number;
    offsetParentEl: any;
}

export class OffsetText {
  width: string;
  height: string;
  top: string;
  left: string;
  constructor(box: Offset) {
    this.width = box.width + 'px';
    this.height = box.height + 'px';
    this.top = box.top + 'px';
    this.left = box.left + 'px';
  }
}

/**
 * TODO - should really just be a util class.
 * No need to overengineer it into a serivce.
 */
@Injectable()
export class PositionService {

  /**
   * Gets the bounding box of a group of nativeElements.
   * These elements must have the same offset parent.
   */
  public boundingBox(nativeElements: any[]):Offset {
     var positions = nativeElements.map(item => this.offset(item));
     this.assertSameParent(positions);

     var right = Math.max(...positions.map(p => p.left + p.width));
     var bottom = Math.max(...positions.map(p => p.top + p.height));
     var top = Math.min(...positions.map(p => p.top));
     var left = Math.min(...positions.map(p => p.left));
     return {
         width : right - left,
         height : bottom - top,
         top: top,
         left: left,
         offsetParentEl: positions[0].offsetParentEl
     };
  }

/**
 * Assert that the offsets are computed against the same offset parent
 */
  private assertSameParent(boundingBoxes: Offset[]) {
    let parents = new Set();
    boundingBoxes.forEach((b) => {
      parents.add(b.offsetParentEl);
      if(parents.size > 1)
        throw "the offset must be computed againsted the same offset parent";
    })
  }

  /**
   * Provides read-only equivalent of jQuery's position function:
   * http://api.jquery.com/position/
   */
  public position(nativeEl:any):Offset {
    let elBCR = this.offset(nativeEl);
    let offsetParentBCR = {top: 0, left: 0};
    let offsetParentEl = this.parentOffsetEl(nativeEl);
    if (offsetParentEl !== this.document) {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    let boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left,
      offsetParentEl: offsetParentEl
    };
  }

  /**
   * Provides read-only equivalent of jQuery's offset function:
   * http://api.jquery.com/offset/
   */
  public offset(nativeEl:any):Offset {
    let boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: boundingClientRect.top + (this.window.pageYOffset || this.document.documentElement.scrollTop),
      left: boundingClientRect.left + (this.window.pageXOffset || this.document.documentElement.scrollLeft),
      offsetParentEl: this.window
    };
  }

  /**
   * Convert a bounding box in relative to the parent of a target element
   * 
   * We can extract the bounding box of an element relative to the view port
   * When we set its position, the position is relative to its 'positioned'
   * parent. Here we convert the former to the later.
   */
  public shiftToParent(boundingBox: Offset, offsetParentEl:any):OffsetText {
    if(boundingBox.offsetParentEl !== this.window) {
        throw "the bounding box is already relative to parent. No need to conert"
    }

    let offsetParentBCR = {top: 0, left: 0};
    offsetParentBCR = this.offset(offsetParentEl);

   let shifted = {
        top: boundingBox.top - offsetParentBCR.top,
        left: boundingBox.left - offsetParentBCR.left,
        width: boundingBox.width,
        height: boundingBox.height,
        offsetParentEl: offsetParentEl
    };

    return new OffsetText(shifted);
  }

  /**
   * Shift the source bounding box so it sits on top of the target box
   */
  public alignOnTop(source: Offset, target: Offset): Offset {
    if(source.offsetParentEl !== target.offsetParentEl) {
        throw "the source and taget must have the same offset parent";
    }

    return {
        top: target.top - source.height,
        left: target.left - (source.width - target.width)/2,
        width: source.width,
        height: source.height,
        offsetParentEl: source.offsetParentEl
    }
  }

  private get window():any {
    return window;
  }
  private get document():any {
    return window.document;
  }
  private getStyle(nativeEl:any, cssProp:string):any {
    // IE
    if (nativeEl.currentStyle) {
      return nativeEl.currentStyle[cssProp];
    }

    if (this.window.getComputedStyle) {
      return this.window.getComputedStyle(nativeEl)[cssProp];
    }
    // finally try and get inline style
    return nativeEl.style[cssProp];
  }
  /**
   * Checks if a given element is statically positioned
   * @param nativeEl - raw DOM element
   */
  private isStaticPositioned(nativeEl:any):any {
    return (this.getStyle(nativeEl, 'position') || 'static' ) === 'static';
  }
  /**
   * returns the closest, non-statically positioned parentOffset of a given element
   * @param nativeEl
   */
  public parentOffsetEl(nativeEl:any) {
    let offsetParent = nativeEl.offsetParent || this.document;
    while (offsetParent && offsetParent !== this.document &&
    this.isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || this.document;
  };
}

export const positionService = new PositionService();
