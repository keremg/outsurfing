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



    savedCompressed(image, filePath, originalComponent, size) {
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


        let res= this.ng2ImgMax.resizeImage(image, width,height).pipe(map(result => {
            const compress =  new File([result], result.name , {type: 'image/jpeg'});
            const task: AngularFireUploadTask = this.storage.upload(filePath+addedName, compress);
            if(size===2) {
                originalComponent.uploadPercent = task.percentageChanges();
            }
            return result;
            //await task;
            // return task.then((res) => {
            //     return true;
            }));
        return res;

        // }).catch(err => {
        //     console.log('Oh no!', err);
        //     //reject();
        //     return false;//resize failed
        // });


      //  return new Promise((resolve, reject) => {
      //        this.ng2ImgMax.resizeImage(image, width,height).subscribe(
      //           result => {
      //               const compress =  new File([result], result.name , {type: 'image/jpeg'});
      //               const task: AngularFireUploadTask = this.storage.upload(filePath+addedName, compress);
      //               if(size===2){
      //                   originalComponent.uploadPercent = task.percentageChanges();
      //               }
      //
      //             //  resolve(true);
      //               // observe percentage changes
      //               //originalComponent.uploadPercent = task.percentageChanges();
      //               //return task;
      //           },
      //           error => {
      //               console.log('Oh no!', error);
      //               //reject();
      //               return Promise.resolve(false);
      //           });
        // });


    }

    saveImage(image, filePath, originalComponent): Observable<any>{
        // return Promise.all([
        //     this.savedCompressed(image, filePath, originalComponent, 0),
        //     this.savedCompressed(image, filePath, originalComponent, 1),
        //     this.savedCompressed(image, filePath, originalComponent, 2)
        // ]);
        let sizes = [0,1,2];
        let observables = sizes.map(index=>{
            return this.savedCompressed(image, filePath, originalComponent, index);
        });
        return forkJoin(observables);

        // return  this.savedCompressed(image, filePath, originalComponent, 2).pipe(map(res=>{
        //     return this.savedCompressed(image, filePath, originalComponent, 1).pipe(map(res=>{
        //         return this.savedCompressed(image, filePath, originalComponent, 0).pipe(map(res=>{
        //             return res;
        //         }));
        //     }));
        // }));
        //await this.savedCompressed(image, filePath, originalComponent, 1).subscribe();
        //await this.savedCompressed(image, filePath, originalComponent, 2).subscribe();
        //return Promise.resolve(true);
    }


}
