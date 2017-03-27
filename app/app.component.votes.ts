import {Component} from 'angular2/core';

import {CoursesComponent} from './courses.component';
import {AuthorsComponent} from './authors.component';
import {StarComponent} from './star.component';
import {VoterComponent} from './voter.component';

@Component({
    selector: 'my-app',
    template: `<courses></courses>
               <authors></authors>
               <star></star><br>
               <voter [votesCount]="post.voteCount"
                      [myVote]="post.myVote"
                      (vote)="onVote($event)"
                      (release)="onReleas($event)">
                      </voter>`,
    directives: [CoursesComponent, AuthorsComponent, StarComponent, VoterComponent]
})
export class AppComponent { 
    post = {
        voteCount:10,
        myVote:0
    };
    onVote($event){
        console.log($event);
        this.post.myVote=0;
        console.log("valor:" + this.post.myVote);
        }
    onReleas($event){
        console.log("suelto");
        }    

}
