import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import {CoursesComponent} from './courses.component';
import {AuthorsComponent} from './authors.component';
import {StarComponent} from './star.component';
import {CourseService} from './courses.service';
import {AuthorsService} from './authors.service';
import {StarService} from './star.service';

@NgModule({
    imports:    [BrowserModule],    
    declarations:   [AppComponent,
                    AuthorsComponent,
                    StarComponent,
                    CoursesComponent],
    providers: [CourseService,
                AuthorsService,                
                StarService
                ],
    bootstrap:  [AppComponent]
})

export class AppModule {}