import {
    Injectable
} from '@angular/core';
import {Chunk} from '../models';
import { Subject } from 'rxjs/Subject';

/**
 * Annotation service keeps track of currently selected label section, and 
 * interpret keyboard shortcuts.
 */
@Injectable()
export class AnnotationService {
    selectedSection: Subject<Chunk>;
    private _selectedSection: Chunk;
    private _sections: Chunk[];
    constructor() {
        this.selectedSection = new Subject<Chunk>();
        var self = this;
        this.selectedSection.subscribe((newPattern) => {
            if(self._selectedSection !== undefined) {
                self._selectedSection.isSelected = false;
            }
            self._selectedSection = newPattern;
            newPattern.isSelected = true;
            console.log('triggered in main process');
        });
    }
    /**
     * The label patterns should be refactored into the service
     * rather than passed in here. 
     */
    public setPatterns(patterns: Chunk[]): void {
        this._sections = patterns;
    }
    public SelectLabel(labelSection: Chunk): void {
        console.log('selected label pattern:' + labelSection);
        this.selectedSection.next(labelSection);
        return;
    }
    public OnKeypress(event: KeyboardEvent): void {
        // No need to proceed if no label pattern is selected.
        if(this._selectedSection === undefined) {
            return;
        }
        // shift-key down, move the left boundary
        if(event.shiftKey) {
            if(event.charCode === 75) { // 'K'
                this._selectedSection.tryShrinkRight(this._sections);
            } else if(event.charCode === 76) { // 'L'
                this._selectedSection.tryExpandRight(this._sections);
            }
        } else {
            if(event.charCode === 107) { // 'k'
                this._selectedSection.tryExpandLeft(this._sections);
            } else if(event.charCode === 108) { // 'l'
                this._selectedSection.tryShrinkLeft(this._sections);
            }
        }
    }
}
