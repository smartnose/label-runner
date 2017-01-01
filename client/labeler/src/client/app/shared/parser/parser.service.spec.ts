import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { ParserService } from './parser.service';
import { SegmentedQuery} from '../index'
import { mockSegmentedQuery } from '../contract.spec'

export function main() {
  describe('Parser Service', () => {
    let parserService: ParserService;
    let mockBackend: MockBackend;
    let initialResponse: any;

    beforeEach(() => {

      let injector = ReflectiveInjector.resolveAndCreate([
        ParserService,
        BaseRequestOptions,
        MockBackend,
        {provide: Http,
          useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
      ]);
      parserService = injector.get(ParserService);
      mockBackend = injector.get(MockBackend);

      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      initialResponse = parserService.get('a b c')
      let body = `
      {
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
}`;
      connection.mockRespond(new Response(new ResponseOptions({ body: body })));
    });

    it('should return an Observable when get called', () => {
      expect(initialResponse).toEqual(jasmine.any(Observable));
    });

    it('should resolve to client side segmented line when get called', () => {
      let segmentedLine: any;
      initialResponse.subscribe((data: any) => segmentedLine = data);

      // Delete the members that we do not care.
      
     (<SegmentedQuery>segmentedLine).segments.forEach(e => e.elementRef = undefined)
      // console.log(JSON.stringify(segmentedLine))
      expect(JSON.stringify(segmentedLine)).toEqual('{"segments":[{"text":"a","kind":0},{"text":" ","kind":1},{"text":"b","kind":0},{"text":" ","kind":1},{"text":"c","kind":0}]}');
    });
  });
}
