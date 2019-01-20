import {Injectable} from '@angular/core';
import {SurfRoute} from '../models/surfRoute';
import {SurfEvent} from '../models/surfEvent';
import {SurfUser} from '../models/surfUser';
import {SurfParticipant} from '../models/surfParticipant';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    MAX_TEXT_QUERY_LENGTH = 20;

    constructor() {
    }


    // Function to be used by routes and events, to create the searchIndex
    // We limit the text-search to 2-20 charactsers (MAX_TEXT_QUERY_LENGTH)
    getAllSubstrings(str: string): string[] {
        let i, j, result = [];
        str = str.toLowerCase();

        for (i = 0; i < str.length; i++) {
            for (j = i + 2; j < str.length + 1 && (j - i) <= this.MAX_TEXT_QUERY_LENGTH; j++) {
                result.push(str.slice(i, j));
            }
        }
        return result;
    }


    // Ranking that is used for sorting. It takes onto account both the ranking itself and the number of rankers
    calculateRouteSort(route: SurfRoute): number {
        let sortRank = 2;//default
        if (route.routeNumOfRankers > 0 && route.routeRanking > 0) {
            sortRank = (3 * 2 + route.routeNumOfRankers * route.routeRanking) / (3 + route.routeNumOfRankers);
        }
        return sortRank;
    }

    /*
    	Sort-Rank of the route +
	+ Sort-Rank of the organizer +
	+ Sort-Rank of the guide (if it’s a paid-event, to give higher rating for paid events) +
	+ Weighted-Average of the Sort-Ranking of the participants that has ranking (default 2 if no rankings to any of them), with weight of 1 for approved participants and weight of 0.5 for pending participants +
	+ min(5, sqr(# participants)) : for counting #participants we count any pending-participant as 0.5, and any approved-participant as 1.
	== sum in the range of (4-20) for unguided event and (5-25) for guided event
     */
    // Notice: This function needs event to include event.participants and event.eventOrganizer in it
    async calculateEventSortRanking(event: SurfEvent): Promise<number> {
        debugger;
        let eventRanking;
        let routeSortRank = event.routeSortRanking || 2;
        let organizerPlusGuideSortRank = 2;//default
        //let guideSortRanking = 0;// if not guided event
        if (event.eventOrganizerReal) {

            let organizer = event.eventOrganizerReal;

            organizerPlusGuideSortRank = (3 * 2 + organizer.numOfRaters * organizer.avgRating) / (3 + organizer.numOfRaters);
            let guideSortRank = (3 * 2 + organizer.numOfGuideRaters * organizer.numOfGuideRaters) / (3 + organizer.numOfGuideRaters);
            guideSortRank = guideSortRank || 2; //for case of NaN / undefined
            if (guideSortRank > organizerPlusGuideSortRank) {
                organizerPlusGuideSortRank = guideSortRank; //lets be nice to travel-guides, they will eventually bring us money and good content
            }
            if (event.isGuidedEvent) {
                organizerPlusGuideSortRank += guideSortRank;
            }
        }
        let participantRankings = 2;//default, just for case
        let rankingForNumOfParticipants = 0;
        let numOfParticipantsForSort = 0; //will be (#approved) + (#non_approved / 2)
        if (event.participants && event.participants.length > 0) {
            //average of the sorting ranks of all participants
            let totalApprovedRank = 0;
            let totalNotApprovedRank = 0;
            let totalApproved = 0;
            let totalNotApproved = 0;
            event.participants.forEach(p => {
                if (p.approved) {
                    totalApproved++;
                    totalApprovedRank += p.sortRanking || 2;
                } else {
                    totalNotApproved++;
                    totalNotApprovedRank += p.sortRanking || 2;
                }
            });
            // non-approved participant gets only half the weight of approved ones
            totalNotApproved /= 2;
            totalNotApprovedRank /= 2;
            participantRankings = (totalApprovedRank + totalNotApprovedRank) / (totalApproved + totalNotApproved);
            numOfParticipantsForSort = totalApproved + totalNotApproved;
            rankingForNumOfParticipants = Math.min(5, Math.sqrt(numOfParticipantsForSort));
        }

        eventRanking = routeSortRank + organizerPlusGuideSortRank + participantRankings + rankingForNumOfParticipants;
        return eventRanking;
    }

}
