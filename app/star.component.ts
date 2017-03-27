import {Component} from 'angular2/core'
//import {AutoGrowDirective} from './auto-grow.directive'

@Component({
    selector: 'star',
    template: `
    <h2>Estrella</h2>
    <button 
            class="btn btn-primary"
            >Submit</button>
    <i 
        class="glyphicon"
        [class.glyphicon-star-empty]="isFavorite === 1"
        [class.glyphicon-star]="isFavorite === 2"
        [class.glyphicon-cloud]="isFavorite === 3"
        (click)="onClick()">
        
        
    </i>
    `
})
export class StarComponent {
    isFavorite = 1; 
    active = true;

    onClick(){
        this.isFavorite++;
        if(this.isFavorite<1){
            this.active=false;
        }
        else{
            this.active=true;
        }

        if(this.isFavorite>3){
            this.isFavorite=1;
            }
        }

    }
