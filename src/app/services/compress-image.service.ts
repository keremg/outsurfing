import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {

    constructor(private ng2ImgMax: Ng2ImgMaxService,
                private storage: AngularFireStorage) {}



    savedCompressed(image, filePath, originalComponent, size) {
        debugger;
        let addedName = "Small";
        let width = 100;
        let height = 100;
        if(size === 0){
            addedName = "Medium";
            width = 300;
            height = 300;
        }
        this.ng2ImgMax.resizeImage(image, width,height).subscribe(
            result => {
                const compress =  new File([result], result.name , {type: 'image/jpeg'});
                debugger
                const task: AngularFireUploadTask = this.storage.upload(filePath+addedName, compress);
                // observe percentage changes
                //originalComponent.uploadPercent = task.percentageChanges();
                //return task;
            },
            error => {
                console.log('Oh no!', error);
            });

    }

    saveImage(image, filePath, originalComponent){
        this.savedCompressed(image, filePath, originalComponent, 0);
        debugger;
        this.savedCompressed(image, filePath, originalComponent, 1);
        debugger;
        const task: AngularFireUploadTask = this.storage.upload(filePath+"Large", image);
        debugger;
        originalComponent.uploadPercent = task.percentageChanges();
    }


}
