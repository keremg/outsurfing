import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {

    constructor(private ng2ImgMax: Ng2ImgMaxService,
                private storage: AngularFireStorage) {}

    savedCompressed(image, filePath, originalComponent) {
        debugger;
        this.ng2ImgMax.resizeImage(image, 300,400).subscribe(
            result => {
                const compress =  new File([result], result.name , {type: 'image/jpeg'});
                debugger
                const task: AngularFireUploadTask = this.storage.upload(filePath, compress);
                // observe percentage changes
                originalComponent.uploadPercent = task.percentageChanges();
                //return task;
            },
            error => {
                console.log('Oh no!', error);
            });

        // .toPromise().then(result => {
        //     let x =  new File([result], result.name);
        //     debugger;
        //     return x;
        // }).catch(error => {
        //     console.log('Oh no!', error);
        // });

            // .subscribe(
            // result => {
            //     let x =  new File([result], result.name);
            //     debugger;
            //     return x;
            // },
            // error => {
            //     console.log('Oh no!', error);
            // }
        //);
    }


}
