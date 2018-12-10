import { Component, Input, EventEmitter , Output} from '@angular/core';
import {Colors} from '../../colors.enum';


@Component({
    selector: 'rating',
    templateUrl: 'rating.component.html'
})
export class RatingComponent {
    @Input() rating: number ;

    @Output() ratingChange: EventEmitter<number> = new EventEmitter();

    constructor() {}

    rate(index: number) {
        this.rating = index;
        this.ratingChange.emit(this.rating);
    }

    getColor(index: number) {
        if (this.isAboveRating(index)) {
            return Colors.GREY;
        }

        switch (this.rating) {
            case 1:
            case 2:
                return Colors.RED;
            case 3:
                return Colors.YELLOW;
            case 4:
            case 5:
                return Colors.GREEN;
            default:
                return Colors.GREY;
        }
    }

    isAboveRating(index: number): boolean {
        return index > this.rating;
    }
}
