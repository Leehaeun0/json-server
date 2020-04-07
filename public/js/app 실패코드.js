const $pre = document.querySelector('pre');
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');


const get = (url, callback) => {
  // if (xhr.readyState !== XMLHttpRequest.DONE) return; // .onreadystatechange 는 쓰지만 이벤트에 .onload 할때는 필요없다. 
  const xhr = new XMLHttpRequest();

  // xhr.open('GET', 'http://localhost:3000/todos');
  xhr.open('GET', '/todos'); // '/' 이건 로컬호스트 300을 의미한다. 동일 '출처'일때만 생략 가능하다. 다른폴더에 있는건 절대경로를 써줘야 한다.
  // xhr.setRequestHeader('content-type', 'application/json'); // 이건 GET에서 필요없다
  xhr.send(); // 페이로드를 써야한다 하지만 GET에선 무시한다.
  // xhr.send(JSON.stringify(payload)); // post 함수에서 쓴다.


  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      todos = JSON.parse(xhr.response);
      // render();
      console.log(xhr.response);
      $pre.textContent = xhr.response; // xhr.response란 생성자 함수로 만든 xhr 객체의 프로퍼티인데 이건 겟으로 받아온 내용이다.
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };

};
// 모든 데이터는 xhr안에 있다.



const render = () => {
  let html = '';

  todos.forEach(({ id, content, completed }) => {
    html += `li id="${id}"><input type="checkbox"${completed? ' checked' : ''}><span>${content}</span><button>X</button></li>`
  });
  $todos.innerHTML = html;
}

const getTodos = () => {
  // todos = get(); // get 함수가 비동기 이기 때문에 return 값을 못받는다.
  // render(); // 렌더함수가 겟함수보다 먼저 실행된다. 그래서 빈배열을 리턴한다.
  get('/todos', data => {

  })
};

window.onload = getTodos;

$inputTodo.onkeyup = () => {

  post('/todos', {id:4});
  render();
};