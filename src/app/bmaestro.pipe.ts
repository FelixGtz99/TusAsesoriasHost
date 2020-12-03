import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bmaestro'
})
export class BmaestroPipe implements PipeTransform {

  transform(value: any,arg: any): any {
    const res=[];
    for(const c of value){
      if(c.user.nombre.toLowerCase().indexOf(arg.toLowerCase())>-1){
        res.push(c)
      }
    }
   return res;
  }

}
