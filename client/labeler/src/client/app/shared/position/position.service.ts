import {
    Injectable
} from '@angular/core';

export class BoundingBox {
    width: number;
    height: number;
    top: number;
    left: number;
}

export class Position {
    left: number;
    top: number;
}

@Injectable()
export class PositionService {

  /**
   * Gets the bounding box of a group of nativeElements
   */
  public boundingBox(nativeElements: any[]):BoundingBox {
     var positions = nativeElements.map(item => this.offset(item));
     var right = Math.max(...positions.map(p => p.left + p.width));
     var bottom = Math.max(...positions.map(p => p.top + p.height));
     var top = Math.min(...positions.map(p => p.top));
     var left = Math.min(...positions.map(p => p.left));
     return {
         width : right - left,
         height : bottom - top,
         top: top,
         left: left
     };
  }

  /**
   * Provides read-only equivalent of jQuery's position function:
   * http://api.jquery.com/position/
   */
  public position(nativeEl:any):BoundingBox {
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
      left: elBCR.left - offsetParentBCR.left
    };
  }

  /**
   * Provides read-only equivalent of jQuery's offset function:
   * http://api.jquery.com/offset/
   */
  public offset(nativeEl:any):BoundingBox {
    let boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: boundingClientRect.top + (this.window.pageYOffset || this.document.documentElement.scrollTop),
      left: boundingClientRect.left + (this.window.pageXOffset || this.document.documentElement.scrollLeft)
    };
  }

  /**
   * Provides coordinates for the targetEl in relation to a bounding-box
   */
  public poisitionElementToBoundingBox(boundingBox: BoundingBox, targetEl:any):Position {
    let targetElWidth = targetEl.offsetWidth;
    let targetElHeight = targetEl.offsetHeight;
    let targetElPos:{top: number, left: number};
    targetElPos = {
        top: boundingBox.top - targetElHeight,
        left: boundingBox.left + boundingBox.width / 2 - targetElWidth / 2
    };
    return targetElPos;
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
  private parentOffsetEl(nativeEl:any) {
    let offsetParent = nativeEl.offsetParent || this.document;
    while (offsetParent && offsetParent !== this.document &&
    this.isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || this.document;
  };
}

export const positionService = new PositionService();
