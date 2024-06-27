import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomCalendarComponent } from './custom-calendar.component';
import { BlockUIModule } from 'ng-block-ui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [CustomCalendarComponent],
    imports: [
        CommonModule,
    FormsModule,
        BlockUIModule.forRoot(),
        RouterModule

    ],
    exports: [
        CustomCalendarComponent
    ],
    providers: [
    ]
})
export class CustomCalendarModule { }
