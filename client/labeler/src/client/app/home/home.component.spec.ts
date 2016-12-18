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

import { ParserService, CSegmentedQuery, SegmentedQuery, Segmentation, Segment } from '../shared/index';
import { HomeModule } from './home.module';
import { HomeComponent } from './index';

let segmentedQuery = {
  "query": "a b c",
  "segmentation": {
    "segments": [
      {
        "start": {
          "row": 0,
          "col": 0,
          "offset": 0
        },
        "end": {
          "row": 0,
          "col": 0,
          "offset": 0
        },
        "kind": 0
      },
      {
        "start": {
          "row": 0,
          "col": 1,
          "offset": 1
        },
        "end": {
          "row": 0,
          "col": 1,
          "offset": 1
        },
        "kind": 1
      },
      {
        "start": {
          "row": 0,
          "col": 2,
          "offset": 2
        },
        "end": {
          "row": 0,
          "col": 2,
          "offset": 2
        },
        "kind": 0
      },
      {
        "start": {
          "row": 0,
          "col": 3,
          "offset": 3
        },
        "end": {
          "row": 0,
          "col": 3,
          "offset": 3
        },
        "kind": 1
      },
      {
        "start": {
          "row": 0,
          "col": 4,
          "offset": 4
        },
        "end": {
          "row": 0,
          "col": 4,
          "offset": 4
        },
        "kind": 0
      }
    ]
  }
};

export function main() {
  describe('Home component', () => {
    // setting module for testing
    // Disable old forms
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterModule, HttpModule, HomeModule],
        declarations: [TestComponent],
        providers: [
          ParserService,
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
            expect(homeDOMEl.querySelectorAll('li').length).toEqual(0);

            homeInstance.query = "a b c"
            homeInstance.segmentedLine = new SegmentedQuery(segmentedQuery)

            fixture.detectChanges();

            expect(homeDOMEl.querySelectorAll('span').length).toEqual(5);
            expect(homeDOMEl.querySelectorAll('span')[0].textContent).toEqual('a');
            expect(homeDOMEl.querySelectorAll('span')[1].textContent).toEqual(' ');
            expect(homeDOMEl.querySelectorAll('span')[2].textContent).toEqual('b');
            expect(homeDOMEl.querySelectorAll('span')[3].textContent).toEqual(' ');
            expect(homeDOMEl.querySelectorAll('span')[4].textContent).toEqual('c');
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-home></sd-home>'
})
class TestComponent { }
