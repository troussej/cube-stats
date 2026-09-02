import { inject, Service } from "@angular/core";
import { Observable, of } from "rxjs";
import { DraftsStoreService } from "./drafts.service";
import { PlayersStoreService } from "./players.service";

@Service()
export class MockService {

    private playersService = inject(PlayersStoreService);
    private draftsService = inject(DraftsStoreService);

    public initData(): Observable<boolean> {

        console.log('MockService.initData()');
        this.playersService.addPlayer("Alice");
        this.playersService.addPlayer("Bob");
        this.playersService.addPlayer("Charlie");
        this.playersService.addPlayer("David");

        const alice = { name: "Alice", deck: "WUB control" };
        const bob = { name: "Bob", deck: "BGR aggro" };
        const charlie = { name: "Charlie", deck: "RG midrange" };
        const david = { name: "David", deck: "Mono U tempo" };

        let draft = this.draftsService.createDraftSession(new Date(), [
            alice,
            bob,
            charlie,
            david
        ]);


        this.draftsService.addGame(draft, 1, alice, bob, 2, 1);
        this.draftsService.addGame(draft, 1, charlie, david, 2, 1);
        this.draftsService.addGame(draft, 2, alice, charlie, 1, 2);
        this.draftsService.addGame(draft, 2, bob, david, 2, 0);

        try {

            this.draftsService.finishDraftSession(draft);
        } catch (err) {
            console.error('Error finishing draft session:', err);
        }
        console.log('MockService.initData() completed');

        return of(true);
    }
}