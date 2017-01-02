import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  async
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http, HttpModule
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { mockSegmentedQuery } from '../shared/contract.spec'

import { ParserService, LabelingService, CSegmentedQuery, SegmentedQuery, Segmentation, Segment } from '../shared/index';
import { SharedModule } from '../shared/shared.module'
import { HomeModule } from './home.module';
import { HomeComponent } from './index';

let segmentedQuery = mockSegmentedQuery;

export function main() {
  describe('Home component', () => {
    // setting module for testing
    // Disable old forms
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterModule, HttpModule, HomeModule, SharedModule],
        declarations: [TestComponent],
        providers: [
          ParserService,
          LabelingService,
          BaseRequestOptions,
          MockBackend,
          {provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
        ]
      });
    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();

            let homeInstance = fixture.debugElement.children[0].componentInstance;
            let homeDOMEl = fixture.debugElement.children[0].nativeElement;

            expect(homeInstance.parserService).toEqual(jasmine.any(ParserService));

            homeInstance.query = "a b c"
            homeInstance.segmentedLine = new SegmentedQuery(segmentedQuery)

            fixture.detectChanges();

            var segmentSpans = homeDOMEl.querySelectorAll('span>span');
            expect(segmentSpans.length).toEqual(5);
            expect(segmentSpans[0].textContent).toEqual('a');
            expect(segmentSpans[1].textContent).toEqual(' ');
            expect(segmentSpans[2].textContent).toEqual('b');
            expect(segmentSpans[3].textContent).toEqual(' ');
            expect(segmentSpans[4].textContent).toEqual('c');
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-home></sd-home>'
})
class TestComponent { }
