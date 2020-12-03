import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bcategoria'
})
export class BcategoriaPipe implements PipeTransform {

  transform(value: any,arg: any): any {
    const res=[];
    for(const c of value){
      if(c.categoria.nombre.toLowerCase().indexOf(arg.toLowerCase())>-1){
        res.push(c)
      }
    }
   return res;
  }
}
