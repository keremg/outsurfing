import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
//import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  selector: 'app-single-route',
  templateUrl: './single-route.page.html',
  styleUrls: ['./single-route.page.scss']
})
export class SingleRoutePage implements OnInit {
  public singleRouteForm: FormGroup;
  selectedFile: File = null;

  constructor(
    private formBuilder: FormBuilder // private imagePicker: ImagePicker
  ) {}

  ngOnInit() {
    this.singleRouteForm = this.formBuilder.group({
      tripName: ['', Validators.required],
      isGuide: ['', Validators.required],
      creatorName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      tripPrice: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      tripLevel: ['', Validators.required],
      tripDuration: ['', Validators.required],
      properties: ['', Validators.required],
      photos: [''],
      recMonths: [''],
      fee: [''],
      gMapsLocation: ['', Validators.required]
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    // checking the file isn't null
  }

  onUpload() {
    let desc = '';
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    console.log(fd);
  }

  updateRoute() {
    alert('here should save the route');
  }
}
