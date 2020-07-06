/*
 * @Author: chl
 * @Date: 2020-07-01 11:00:16
 * @LastEditTime: 2020-07-03 11:19:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \-demo\Message\message.js
 */
class Message {
  constructor() {
    const containerId = 'message-container';

    this.containerEl = document.getElementById(containerId)

    // 没有就创建
    if (!this.containerEl) {
      this.containerEl = document.createElement('div')
      this.containerEl.id = containerId

      // 插入到页面中
      document.body.appendChild(this.containerEl)
    }


  }
  // 显示类型,插入用户信息
  show({
    type = 'info', // 类型
    text = '', // 文字
    duration = 2000, // 持续时间
    closeable = false, // 是否自动关闭
    afterclose = null // 动画关闭后的回调
  }) {
    let messageEl = document.createElement('div')
    messageEl.className = 'message move-in'

    // 还有里面的内容
    messageEl.innerHTML = `
        <span class="iconfont icon-${type}"></span>
        <div class="text">${text}</div>
      `

    //是否添加关闭按钮
    if (closeable) {
      let closeEl = document.createElement('div')
      closeEl.className = 'close iconfont icon-close'
      // 把关闭按钮追加到message元素末尾
      messageEl.appendChild(closeEl);

      // 添加点击事件
      closeEl.addEventListener('click', () => {
        this.close(messageEl)
      })
    }

    this.containerEl.appendChild(messageEl)
    // 只有当duration大于0的时候才设置定时器，这样我们的消息就会一直显示
    if (duration > 0) {
      // 用setTimeout来做一个定时器 
      setTimeout(() => {
        this.close(messageEl, afterclose);
      }, duration);
    }
  }



  /**
   * 关闭某个消息
   * 由于定时器里边要移除消息，然后用户手动关闭事件也要移除消息，所以我们直接把移除消息提取出来封装成一个方法
   * @param {Element} messageEl 
   */
  close(messageEl, afterclose) {
    messageEl.className = messageEl.className.replace('move-in', '');
    messageEl.className += 'move-out'


    // move-out动画结束后把元素的高度和边距都设置为0
    // 由于我们在css中设置了transition属性，所以会有一个过渡动画
    messageEl.addEventListener('animationend', () => {
      messageEl.setAttribute('style', 'height: 0; margin: 0');

      // 关闭后的回调
      if ( afterclose !== null && typeof afterclose === "function") {
        afterclose()
      }
    });

    // 这个地方是监听动画结束事件，在动画结束后把消息从dom树中移除。
    // 如果你是在增加move-out后直接调用messageEl.remove，那么你不会看到任何动画效果
    messageEl.addEventListener('transitionend', () => {
      // Element对象内部有一个remove方法，调用之后可以将该元素从dom树种移除！
      messageEl.remove();
    });
  }
}



// module.exports =  Message;
