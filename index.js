initStyle();
const state = initState();console.log(state)
render();


function render() {
  let items = document.querySelectorAll('.con_list_item');
  items = Array.prototype.slice.call(items);
  items.forEach(item => {
    let btn = item.querySelector('.con_list_item-btn');
    if (!btn) {
      btn = document.createElement('div');
      btn.className= "con_list_item-btn";
      btn.onclick = function () {
        let positionId = this.parentNode.getAttribute('data-positionid');
        if (state.positionIds.indexOf(positionId) === -1) {
          handleScreen(positionId);
        } else {
          handleUnScreen(positionId);
        }
      }
      item.appendChild(btn);
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
}

function handleScreen(id) {
  id += '';
  if (state.positionIds.indexOf(id) === -1) {
    state.positionIds.push(id);
  }
  saveState();
  render();
}

function handleUnScreen(id) {
  id += '';
  if (state.positionIds.indexOf(id) !== -1) {
    state.positionIds.splice(state.positionIds.indexOf(id), 1);
    saveState();
    render();
  }
}

function initState() {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem('LAGOU_HELPER')) || {};
  } catch (e) {}
  state.positionIds instanceof Array || (state.positionIds = []);
  return state;
}

function saveState() {
  localStorage.setItem('LAGOU_HELPER', JSON.stringify(state));
}

function initStyle() {
  let style = document.createElement('style');
  style.innerHTML = `
    .con_list_item {
      position: relative;
    }
    .con_list_item.is_screen {
      opacity: .2;
    }
    .con_list_item-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: rgba(0,0,0,.5);
      color: #fff;
      padding: .4em 1em;
    }
  `;
  document.head.appendChild(style);
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
  cn = cn.trim();console.log(cn)
  el.className = cn;
}
