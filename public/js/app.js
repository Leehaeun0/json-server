let todos = [];
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');


const request = (method, url, payload, callback) => {

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(JSON.stringify(payload));

  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      callback(JSON.parse(xhr.response));
      console.log('JSON', JSON.parse(xhr.response));
      // todos = JSON.parse(xhr.response);
      // render(); // 이 두줄을 콜백함수로 준다.('GET'의 경우)
    } else {
      console.error('Error', xhr.status, xhr.statusText);
    }
  };
};

const render = () => {
  let html = '';

  todos.forEach(({ id, completed, content }) => {
    html += `<li id="${id}"><input type="checkbox"${completed ? ' checked' : ''}><span>${content}</span><button>X</button></li>`;
  });

  $todos.innerHTML = html;
  console.log('render', todos);
};

const getTodos = () => {
  request('GET', '/todos', {}, data => {
    todos = data;
    todos.sort((todo1, todo2) => todo2.id - todo1.id);
    render();
  });
};

window.onload = getTodos;

$inputTodo.onkeyup = e => {
  if (e.keyCode !== 13 || $inputTodo.value.trim() === '') return;
  const newId = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  // console.log(newId); // -Infinity 나오는데도 삼항조건연산자로 1 기본값 안줘도 1로 되는 이유는?
  request('POST', '/todos', { id: newId, content: $inputTodo.value.trim(), completed: false }, data => {
    todos = [data, ...todos];
    $inputTodo.value = '';
    render();
  });
};

$todos.onclick = e => {
  if (!e.target.matches('.todos > li > button')) return;
  const { id } = e.target.parentNode;
  request('DELETE', `/todos/${id}`, {}, () => {
    todos = todos.filter(todo => todo.id !== +id);
    render();
  });
};

$todos.onchange = e => {
  const { id } = e.target.parentNode;
  request('PATCH', `/todos/${id}`, { completed: e.target.checked }, data => {
    todos = todos.map(todo => (todo.id === +id ? data : todo));
    render();
  });
};