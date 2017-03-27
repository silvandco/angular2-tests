import {Component,Input,EventEmitter, Output} from 'angular2/core'

@Component({
    selector: 'voter',
    template: `
    <i class="glyphicon" [class.glyphicon-menu-up]= true
        [class.highlighted]="myVote == 1"
        (click)="onAddClick()" (mouseleave)="onRelease()"></i>
        <br>
    <span>{{votesCount}}</span>
    <br>
    <i class="glyphicon" [class.glyphicon-menu-down] = true
        [class.highlighted]="myVote == -1"
        (click)="onDelClick()" (mouseleave)="onRelease()"></i>   
    `,
    styles: [`
        .glyphicon-menu-up   {
            color: #ccc;
            cursor: pointer;
            font-size: 30px;
            text-align:center;

        }
        
        .glyphicon-menu-down   {
            color: #ccc;
            cursor: pointer;
            font-size: 30px;
            text-align:center;

        }

        .highlighted {
            color: orange;
        }   
    `]
})
export class VoterComponent {

    @Input() votesCount = 10;
    @Input() myVote = 0;
    @Output() vote = new EventEmitter();
    @Output() release = new EventEmitter();

    maxVotes = 11;
    minVotes = 9;

    onAddClick(){
        if(this.votesCount <  this.maxVotes){
            this.votesCount ++;
            this.myVote = 1;
            this.vote.emit({myVote: this.myVote});
            } 
        }
    onDelClick(){
        if(this.votesCount >  this.minVotes){
            this.votesCount --;
            this.myVote = -1;
            this.vote.emit({myVote: this.myVote});
            } 
        }
    onRelease(){
        this.release.emit({myVote: this.myVote});
        this.myVote = 0; 
        }    

    }