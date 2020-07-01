/*
 * @Author: your name
 * @Date: 2020-06-30 22:44:35
 * @LastEditTime: 2020-07-01 10:10:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \-demo\constructor.js
 */ 
class A {
  constructor(){
    this.name = 'tom'
  }

  c() {
    return 2;
  }
}


class b extends A{
  constructor(){
    super()
    // 子类 B 当中的 super.c()，就是将 super 当作一个对象使用。
    // 这时，super 在普通方法之中，指向 A.prototype，所以 super.c() 就相当于 A.prototype.c()。
    console.log(this.c())
    console.log(this.name)  
    this.name= 'kg'  // 重写了父类的name的值
    console.log(this.name)

  }
}


let B = new b()
console.log(B.name)
