import { Component, OnInit, QueryList, ViewChildren, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person';
import { PEOPLE } from '../../sample-data/people-data';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DateRange, DatepickerComponent } from 'src/app/datepicker/datepicker.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Address } from 'ngx-google-places-autocomplete/objects/address';



@Component({
  selector: 'people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  @ViewChild(DatepickerComponent) datePicker!: DatepickerComponent;
  @ViewChild('content') modal: TemplateRef<any>;

  public persons$: Observable<Person[]>;
  public total$: Observable<number>;
  public toDate:NgbDate;
  public fromDate:NgbDate;
  public closeResult = '';
  public isSubmitted = false;
  public options = {
    componentRestrictions: {
      country: ['AU']
    }
  }
  
  constructor(
    private calendar: NgbCalendar,
    public service: PeopleService,
    private modalService: NgbModal,
    ) {
    this.persons$ = service.persons$;
    this.total$ = service.total$;
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 14);
  }

  ngOnInit() {
  }

  public onDateSelection(dateRange:DateRange) {
    console.log(dateRange);
    if(dateRange.fromDate && dateRange.toDate){ 
      this.fromDate=dateRange.fromDate; 
      this.toDate=dateRange.toDate;
      this.service.fromDate=new Date (dateRange.fromDate.year,dateRange.fromDate.month-1,dateRange.fromDate.day);
      this.service.toDate=new Date (dateRange.toDate.year,dateRange.toDate.month-1,dateRange.toDate.day);
    }
  }

  public onSelectChange(value: number) {
    if(value) {
      this.datePicker.setDates(this.calendar.getNext(this.calendar.getToday(), 'd', 14),this.calendar.getToday());
      let currentDate = new Date();
      let currentMinus14Days = new Date();
      currentMinus14Days.setDate(currentMinus14Days.getDate()-14);
      this.service.fromDate = currentMinus14Days;
      this.service.toDate = currentDate;
    }
  }

  public open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //this.save(result);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public save(result){ 
    console.log(result);
    if(!result || !result.name || !result.location || !result.date) {
      alert('Name , location and Date are mandatory. Fill all fields');
      return
    }
      
    PEOPLE.push({
      id: 10,
      name: result.name,
      age: result.age,
      location: result.location,
      date: result.date
    });
    this.modalService.dismissAll();
  }

  public handleAddressChange(address: Address) {
    console.log(address.formatted_address);
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
