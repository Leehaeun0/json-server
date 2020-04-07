let todos = [];
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');


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

const http = (method, url, callback, payload) => {
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

// http('GET','/todos', { id: 4, content, completed: false }, data => {
//   todos = [data, ...todos]
//   render();
// });

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
  console.log(todos);
};

const getTodos = () => {
  http('GET', '/todos', data => {
    todos = data;
    todos = todos.sort((todo1, todo2) => todo2.id - todo1.id);
    render();
  });
};

window.onload = getTodos;

$inputTodo.onkeyup = e => {
  const content = e.target.value;
  if (e.keyCode !== 13 || content.trim() === '') return;

  const newId = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 0;
  // todos = [{ id: 4, content, completed: false }, ...todos];
  http('POST', '/todos', data => {
    todos = [data, ...todos];
    $inputTodo.value = '';
    render();
  }, { id: newId, content, completed: false });
};

$todos.onclick = e => {
  if (!e.target.matches('.todos > li > button')) return;
  const { id } = e.target.parentNode;
  // todos = todos.filter(todo => todo.id !== +e.target.parentNode.id);
  http('DELETE', `/todos/${id}`, () => {
    // todos = data.filter(todo => todo.id !== +e.target.parentNode.id);
    // getTodos();
    // {}가 반환
    todos = todos.filter(todo => todo.id !== +id);
    render();
  });
};

$todos.onchange = e => {
  const { id } = e.target.parentNode;
  // const content = e.target.value;

  http('PATCH', `/todos/${id}`, data => {
    // todos = [...todos, !data.completed];
    todos = todos.map(todo => (todo.id === +id ? data : todo));
    render();
  // }, { id: id, content, completed: e.target.checked });
  }, { completed: e.target.checked });
};
