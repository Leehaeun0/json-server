let todos = [];
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const ajax = (() => {
  const req = (method, url, callback, payload) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        callback(JSON.parse(xhr.response));
      } else {
        console.error(`${xhr.status} ${xhr.statusText}`);
      }
    };
  };
  return {
    get(url, callback) {
      req('GET', url, callback);
    },
    post(url, callback, payload) {
      req('POST', url, callback, payload);
    },
    patch(url, callback, payload) {
      req('PATCH', url, callback, payload);
    },
    delete(url, callback) {
      req('DELETE', url, callback);
    }
  };
})();
const generateId = () => {
  return todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
};
// const get = (url, callback) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', url);
//   xhr.setRequestHeader('content-type', 'application/json');
//   xhr.send();
//   xhr.onload = () => {
//     if (xhr.status === 200) {
//       callback(JSON.parse(xhr.response));
//     } else {
//       console.error(`${xhr.status} ${xhr.statusText}`);
//     }
//   };
// };
// const post = (url, payload, callback) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', url);
//   xhr.setRequestHeader('content-type', 'application/json');
//   xhr.send(JSON.stringify(payload));
//   xhr.onload = () => {
//     if (xhr.status === 200 || xhr.status === 201) {
//       callback(JSON.parse(xhr.response));
//     } else {
//       console.error(`${xhr.status} ${xhr.statusText}`);
//     }
//   };
// };
// const deleteTodo = (url, callback) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('DELETE', url);
//   xhr.setRequestHeader('content-type', 'application/json');
//   xhr.send();
//   xhr.onload = () => {
//     if (xhr.status === 200 ) {
//       callback(JSON.parse(xhr.response));
//     } else {
//       console.error(`${xhr.status} ${xhr.statusText}`);
//     }
//   };
// };
// const toggleCompleted = (url, payload, callback) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('PATCH', url);
//   xhr.setRequestHeader('content-type', 'application/json');
//   xhr.send(JSON.stringify(payload));
//   xhr.onload = () => {
//     if (xhr.status === 200) {
//       callback(JSON.parse(xhr.response));
//     } else {
//       console.error(`${xhr.status} ${xhr.statusText}`);
//     }
//   };
// };
const render = () => {
  let html = '';
  todos.forEach(({ id, content, completed }) => {
    html += `<li id="${id}">
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <span>${content}</span>
        <button>X</button>
      </li>`;
  });
  $todos.innerHTML = html;
};
const getTodos = () => {
  // get('/todos', data => {
  //   todos = data;
  //   render();
  // });
  ajax.get('/todos', data => {
    // todos = data.sort((data1, data2) => data2.id - data1.id);
    todos = data;
    render();
  });
};
window.onload = getTodos;
$inputTodo.onkeyup = e => {
  const content = e.target.value.trim();
  if (e.keyCode !== 13 || content === '') return;
  // post('/todos', { id: 4, content, completed: false }, data => {
  //   todos = [data, ...todos];
  //   render();
  // });
  // changeState('PUT', '/todos', { id: 4, content, completed: false }, data => {
  //   todos = [data, ...todos];
  //   render();
  // });
  ajax.post('/todos', data => {
    todos = [data, ...todos];
    render();
  }, { id: generateId(), content, completed: false });
  $inputTodo.value = '';
};
$todos.onclick = e => {
  if (!e.target.matches('.todos > li > button')) return;
  const clickId = +e.target.parentNode.id;
  // deleteTodo(`todos/${clickId}`, () => {
  //   todos = todos.filter(todo => todo.id !== clickId);
  //   render();
  // });
  ajax.delete(`todos/${clickId}`, () => {
    todos = todos.filter(todo => todo.id !== clickId);
    render();
  });
};
$todos.onchange = e => {
  const completed = e.target.checked;
  const clickId = +e.target.parentNode.id;
  // toggleCompleted(`todos/${clickId}`, { completed }, data => {
  //   todos = todos.map(todo => (todo.id === data.id ? ({ ...todo, completed: data.completed }) : todo));
  //   render();
  // });
  ajax.patch(`todos/${clickId}`, data => {
    // todos = todos.map(todo => (todo.id === data.id ? ({ ...todo, completed: data.completed }) : todo));
    todos = todos.map(todo => (todo.id === data.id ? data : todo));
    render();
  }, { completed });
};