import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {promise} from 'selenium-webdriver';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {

    constructor(private ng2ImgMax: Ng2ImgMaxService,
                private storage: AngularFireStorage) {}



    async savedCompressed(image, filePath, originalComponent, size): Promise<any> {
        debugger;
        let addedName = "Large";
        let width = 600;
        let height = 600;
        if(size === 0){
            addedName = "Small";
            width = 100;
            height = 100;
        }
        if(size === 1){
            addedName = "Medium";
            width = 300;
            height = 300;
        }

        console.log('About to compress image ' + size);

        let compressPromise = new Promise (res=> this.ng2ImgMax.resizeImage(image, width,height).subscribe(res) ); //res  or  data=>res(data)
        let result: any = await compressPromise;
        console.log('Finished to compress image (about to upload) ' + size);
        const compress =  new File([result], result.name , {type: 'image/jpeg'});
        const task: AngularFireUploadTask = this.storage.upload(filePath+addedName, compress);
        if(size===2) {
            originalComponent.uploadPercent = task.percentageChanges();
        }
        await task;
        console.log('Finished to uploading image ' + size);

        return result;


        // }).catch(err => {
        //     console.log('Oh no!', err);
        //     //reject();
        //     return false;//resize failed
        // });



    }

    async saveImage(image, filePath, originalComponent): Promise<any> {
        return Promise.all([
            this.savedCompressed(image, filePath, originalComponent, 0),
            this.savedCompressed(image, filePath, originalComponent, 1),
            this.savedCompressed(image, filePath, originalComponent, 2)
        ]);
        // let sizes = [0,1,2];
        // let observables = sizes.map(index=>{
        //     return this.savedCompressed(image, filePath, originalComponent, index);
        // });
        // return forkJoin(observables);


    }


}
