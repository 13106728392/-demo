/*
 * @Author: chl
 * @Date: 2020-07-03 14:19:41
 * @LastEditTime: 2020-07-06 10:25:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \-demo\proxy.js
 */
let target = {
  a: 1,
  b: 2,
  c: 3
}

let proxy = new Proxy(target, {
  set(target, key, value, receiver) {
    // Proxy第一个参数是目标对象，第二个参数是一个对象，其属性是当执行一个操作时定义代理的行为的函数。
    // 这时可以在第二个参数中加入一个set方法，这时可以监听到是哪个key做了改变。
    // 并且通过Reflect的set方法去模拟真实的set方法。
    console.log('检测到了set的key为 -> ' + key);
    return Reflect.set(target, key, value, receiver);
  },

  get(target, key) { // target, key
    console.log(target, key, 'get')
    return key in target ? target[key] : '对象没有该属性';
  }
})

proxy.a = '1';
proxy.b = '2';
proxy.c = '3';


console.log(proxy.f)

// =================================================  华丽分割线 ================================================== //

const Nowtarget = {
  name: 'kongzhi'
};



// 属性方法

const handler = {
  // target: 目标对象。
  // propKey: 目标对象的属性。
  // receiver: (可选)，该参数为上下文this对象

  get: function (Nowtarget, key) {
    // 使用 Reflect来判断该目标对象是否有该属性
    if (Reflect.has(Nowtarget, key)) {
      // 使用Reflect 来读取该对象的属性
      return Reflect.get(Nowtarget, key);
    } else {
      throw new ReferenceError('该目标对象没有该属性');
    }
  },
  // target: 目标对象。
  // propKey: 目标对象的属性名
  // value: 属性值
  // receiver(可选): 一般情况下是Proxy实列

  set: function (Nowtarget, key, value) {
    console.log(`${key} 被设置为 ${value}`);
    Nowtarget[key] = value;
  },


  // 该方法是判断某个目标对象是否有该属性名。接收二个参数，分别为目标对象和属性名。返回的是一个布尔型。
  has: function(target, key) {
    if (Reflect.has(target, key)) {
      return true;
    } else {
      return false;
    }
  },

  construct: function(target, args, newTarget) {
    /*
     输出： function A(name) {
              this.name = name;
           }
    */
    console.log(target); 
    // 输出： ['kongzhi', {age: 30}]
    console.log(args); 
    return args
  },
  
  apply: function(target, ctx, args) {
    /*
      这里的 ...arguments 其实就是上面的三个参数 target, ctx, args 对应的值。
      分别为：
      target: function testA(p1, p2) {
        return p1 + p2;
      }
      ctx: undefined
      args: [1, 2]
      使用 Reflect.apply(...arguments) 调用testA函数，因此返回 (1+2） * 2 = 6
    */
    console.log(...arguments);
    return Reflect.apply(...arguments) * 2;
  }
};


// 有点像拦截监听的意思
const testObj = new Proxy(Nowtarget, handler);

/*
  获取testObj中name属性值
  会自动执行 get函数后 打印信息：name 被读取 及输出名字 kongzhi
*/
console.log(testObj.name);

/*
 改变Nowtarget中的name属性值
 打印信息如下： name 被设置为 111 
*/
testObj.name = 111;

console.log(Nowtarget.name); // 输出 111



// =================================================  华丽分割线 ================================================== //


const obj = {
  'name': 'kongzhi'
};

// 设置对象属性
// configurable	==> 当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
// enumerable ==> 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
// value ==>	该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
// writable	==> 当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
// get ==>	属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
// set ==> 属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。


Object.defineProperty(obj, 'name', {
  writable: false
});

const handlers = {
  set: function (obj, prop, value, receiver) {
    Reflect.set(obj, prop, value);
  }
};

const proxyS = new Proxy(obj, handlers);
proxyS.name = '我是空智';
console.log(proxyS.name); // 打印的是 kongzhi
