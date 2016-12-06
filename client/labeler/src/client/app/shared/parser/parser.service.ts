import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {SegmentedQuery} from '../contract'

import 'rxjs/add/operator/do';  // for debugging

@Injectable()
export class ParserService {
    /**
    * Creates a new ParserService with the injected Http.
    * @param {Http} http - The injected Http.
    * @constructor
    */
    constructor(private http: Http) { }

    /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {SegmentedQuery} The segmented query ready for labeling.
   */
    get(query: string): Observable<SegmentedQuery> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("query", query);
        return this.http.get('http://localhost:9911/v1/parse', { search: params })
            .map((res: Response) => res.json())
            .do(data => console.log('server data:', data))  // debug
            .catch(this.handleError);
    }

    /**
      * Handle HTTP error
      */
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}