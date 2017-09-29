
const app = getApp();

document.addEventListener('DOMContentLoaded', function () {
  app.init();
  app.renderUitilDone();


  let handleClickPage = function () {
    setTimeout(function () {
      app.renderUitilDone();
    }, 210)
  }

  eventDelegate(document.body, 'click', 'pager_is_current', handleClickPage);
  eventDelegate(document.body, 'click', 'pager_not_current', handleClickPage);
  eventDelegate(document.body, 'click', 'pager_prev', handleClickPage);
  eventDelegate(document.body, 'click', 'pager_next', handleClickPage);
})





function getApp() {

  let state = {};
  try {
    state = JSON.parse(localStorage.getItem('LAGOU_HELPER')) || {};
  } catch (e) {}
  state.positionIds instanceof Array || (state.positionIds = []);

  return {
    init() {
      let style = document.createElement('style');
      style.innerHTML = `
        .con_list_item {
          position: relative;
        }
        .con_list_item.is_screen {
          opacity: .2;
        }
        .con_list_item-btn {
          display: none;
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: rgba(0,0,0,.5);
          color: #fff;
          padding: .4em 1em;
        }
        .con_list_item:hover .con_list_item-btn {
          display: block;
        }
      `;
      document.body.appendChild(style);
    },

    render() {
      // console.log('render')
      let done = false;
      let items = document.querySelectorAll('.con_list_item');
      items = Array.prototype.slice.call(items);
      items.forEach(item => {
        let btn = item.querySelector('.con_list_item-btn');
        if (!btn) {
          btn = document.createElement('div');
          btn.className= "con_list_item-btn";
          btn.onclick = e => {
            let positionId = e.currentTarget.parentNode.getAttribute('data-positionid');
            if (state.positionIds.indexOf(positionId) === -1) {
              this.handleScreen(positionId);
            } else {
              this.handleUnScreen(positionId);
            }
          }
          item.appendChild(btn);
          done = true;
        }

        let positionId = item.getAttribute('data-positionid');
        if (state.positionIds.indexOf(positionId) === -1) {
          btn.innerHTML = '屏蔽';
          removeClass(item, 'is_screen');
        } else {
          btn.innerHTML = '取消屏蔽';
          addClass(item, 'is_screen');
        }
      });
      if (!done) {
        document.querySelector('.empty_position') && (done = true);
      }
      return done;
    },

    renderUitilDone() {
      if (this.render()) return;
      setTimeout(() => {
        this.renderUitilDone();
      }, 500);
    },

    handleScreen(id) {
      id += '';
      if (state.positionIds.indexOf(id) === -1) {
        state.positionIds.push(id);
      }
      this.saveState();
      this.render();
    },

    handleUnScreen(id) {
      id += '';
      if (state.positionIds.indexOf(id) !== -1) {
        state.positionIds.splice(state.positionIds.indexOf(id), 1);
        this.saveState();
        this.render();
      }
    },

    saveState() {
      localStorage.setItem('LAGOU_HELPER', JSON.stringify(state));
    },
  }
}







function eventDelegate(el, type, selector, cb) {
  el.addEventListener(type, function (e) {
    var t = e.target;
    while (t !== el && t) {
      if (elMatchSelector(t, selector)) {
        return cb && cb.call(t, e);
      }
      t = t.parentNode;
    }
  })
}

/**
 * 检查el是否符合选择器
 * todo
 */
function elMatchSelector(el, selector) {
  if (!el) return false;
  if (el.className.indexOf(selector) >= 0) return true;
  return false;
}





function addClass(el, name) {
  let cn = el.className;
  if (cn.indexOf(name) >= 0) return;
  cn = cn.replace('  ', ' ');
  cn = cn.trim();
  el.className = cn + ' ' + name;
}

function removeClass(el, name) {
  let cn = el.className;
  if (cn.indexOf(name) === -1) return;
  cn = cn.replace(name, '');
  cn = cn.replace('  ', ' ');
  cn = cn.trim();
  el.className = cn;
}
