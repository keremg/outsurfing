import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
//import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.page.html',
  styleUrls: ['./create-trip.page.scss']
})
export class CreateTripPage implements OnInit {
  public createTripForm: FormGroup;
  selectedFile: File = null;

  constructor(
    private formBuilder: FormBuilder // private imagePicker: ImagePicker
  ) {}

  ngOnInit() {
    this.createTripForm = this.formBuilder.group({
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
      fee: ['']
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
}
