/*
 * @Author: chl
 * @Date: 2020-07-06 14:54:26
 * @LastEditTime: 2020-07-06 18:16:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \-demo\vue_proxy.js
 */ 

/* 
  1. 需要实现一个数据监听器 Observer, 能够对所有数据进行监听，如果有数据变动的话，拿到最新的值并通知订阅者Watcher.
  2. 需要实现一个指令解析器Compile，它能够对每个元素的指令进行扫描和解析，根据指令模板替换数据，以及绑定相对应的函数。
  3. 需要实现一个Watcher, 它是链接Observer和Compile的桥梁，它能够订阅并收到每个属性变动的通知，然后会执行指令绑定的相对应的回调函数，从而更新视图。 
*/
class Vue {
  // 构造函数传入配置
  constructor(options) {
    // 自己定义的属性方法
    this.$el = document.querySelector(options.el)
    this.$methods = options.methods
    this._binding = {}
    this._observer(options.data)
    this._compile(this.$el)
  }


  // 添加监听属性值
  _pushWatcher(watcher) {
    if (!this._binding[watcher]) {
      this._binding[watcher.key] = []
    }
    this._binding[watcher.key].push(watcher)
  }

  /* 
   observer的作用是能够对所有的数据进行监听操作，通过使用Proxy对象
    中的set方法来监听，如有发生变动就会拿到最新值通知订阅者。
  */
  _observer(datas) {
    const that = this
    const handler = {
      // obj,key,值
      set(target, key, value) {
        // 设置新的值
        const rets = Reflect.set(target, key, value)
        // 值update到绑定的对象上
        that._binding[key].map(item => {
          item.updated()
        })

        return rets
      }
    }
    // 添加proxy监听data里面值的变化
    this.$data = new Proxy(datas, handler)
  }


  /*
     指令解析器，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相对应的更新函数
  */
  _compile(root) {
    const nodes = Array.prototype.slice.call(root.children); // 根节点断开变数组
    const data = this.$data; // 获取绑定的值

    // 每一层递归进去
    nodes.map(node => {
      if (node.children && node.children.length) {
        this._compile(node)
      }
      const $input = node.tagName.toLocaleUpperCase() === "INPUT"; // 获取标签类型 input 
      const $textarea = node.tagName.toLocaleUpperCase() === "TEXTAREA";  // 获取标签类型 textarea
      const $vmodel = node.hasAttribute('v-model'); // 是否有v-model的指令

      // 如果是input框 或 textarea 的话，并且带有 v-model 属性的
      if (($input && $vmodel) || ($textarea && $vmodel)) {
        const key = node.getAttribute('v-model');
        this._pushWatcher(new Watcher(node, 'value', data, key));
        node.addEventListener('input', () => {
          data[key] = node.value;
        });
      }

      if (node.hasAttribute('v-bind')) {
        const key = node.getAttribute('v-bind');
        this._pushWatcher(new Watcher(node, 'innerHTML', data, key));
      }
      if (node.hasAttribute('@click')) {
        const methodName = node.getAttribute('@click')
        // 方法绑定data
        const method = this.$methods[methodName].bind(data)
        node.addEventListener('click', method)
      }




      // if (node.hasAttribute('v-for')) {
      //   const key = (node.getAttribute('v-for')).replace(/\s*/g,"");
      //   console.log(key)
      //   debugger
      //   const nodes = key.split('in')
      //   // Array.prototype.slice.call(root.children);
      //   console.log(nodes)
        
      //   if(this.$data[key] && typeof(this.$data[key])=='  '){

      //   }



       

      //   debugger
      // }









    })
  }
}

/*
  watcher的作用是 链接Observer 和 Compile的桥梁，能够订阅并收到每个属性变动的通知，
  执行指令绑定的响应的回调函数，从而更新视图。
 */
class Watcher {
  constructor(node, attr, data, key) {
    this.node = node
    this.attr = attr
    this.data = data
    this.key = key
  }
  updated() {
    this.node[this.attr] = this.data[this.key]
  }
}
