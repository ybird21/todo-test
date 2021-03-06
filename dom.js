// part 2 linking it all together
// The function here is called an iife,
// it keeps everything inside hidden from the rest of our application
(function() {
    // This is the dom node where we will keep our todo
    var container = document.getElementById('todo-container');
    var addTodoForm = document.getElementById('add-todo');
    var formText = document.querySelector(".input-form__text");
    var sortDescend = document.getElementById('button-descend');
    var sortAZ = document.getElementById('button-az');

    // var myState = [
    //   { id: -3, description: 'first todo', done: false },
    //   { id: -2, description: 'second todo', done: false },
    //   { id: -1, description: 'third todo', done: false },
    // ];
    if(typeof localStorage.getItem('state') == 'undefined' || localStorage.getItem('state') == null){
      var state = [
          { id: -3, description: 'first todo', done: false },
          { id: -2, description: 'second todo', done: false },
          { id: -1, description: 'third todo', done: false },
        ];
    } else {
      var newState = localStorage.getItem('state');
      var parsedNewState = JSON.parse(newState);
      var state = parsedNewState;
    }
    console.log('updated4');

     // this is our initial todoList

    sortDescend.addEventListener("click", function(e){
      var newState = todoFunctions.sortTodos(state, todoFunctions.sortDescending);
        update(newState);
    });

    sortAZ.addEventListener("click", function(e){
      var newState = todoFunctions.sortTodos(state, todoFunctions.sortAZ);
        update(newState);
    });

    // This function takes a todo, it returns the DOM node representing that todo
    var createTodoNode = function(todo) {
      var todoNode = document.createElement('li');
      // you will need to use addEventListener
      todoNode.addEventListener('click', function(event) {
        var newState = todoFunctions.markTodo(state, todo.id);
        update(newState);
      });
      //making wrapping div inside li


      // add span holding description
      var liContent = document.createElement('div');
      var para = document.createElement('p');
      para.addEventListener("click", function(){
        event.stopPropagation();
      })


      var text = document.createTextNode(todo.description);
      var x = document.createTextNode('X')
      para.appendChild(text);
      liContent.appendChild(para);
      todoNode.appendChild(liContent);

      //this adds container for BUTTONS
      var buttonsContainer = document.createElement("div");
      buttonsContainer.setAttribute("class", "buttons-container");
      todoNode.appendChild(buttonsContainer);
      // this adds the delete button
      var deleteButtonNode = document.createElement('button');
      deleteButtonNode.addEventListener('click', function(event) {
        var newState = todoFunctions.deleteTodo(state, todo.id);
        update(newState);
      });
      deleteButtonNode.appendChild(x)
      buttonsContainer.appendChild(deleteButtonNode);


      // add markTodo button
      var markButtonNode = document.createElement('button');
      markButtonNode.addEventListener('click', function(event) {
        var newState = todoFunctions.markTodo(state, todo.id);
        //marking it twice to fix bubbling
        var newnewState = todoFunctions.markTodo(newState, todo.id);
        update(newnewState);
      });
      buttonsContainer.appendChild(markButtonNode);

      // add classes for css
      todoNode.setAttribute("class", "todo-item")
      liContent.setAttribute("class", "todo-item__content")
      para.setAttribute("class", "content__p")
      para.setAttribute("contenteditable", "true")
      deleteButtonNode.setAttribute("class", "button__delete")
      markButtonNode.setAttribute("class", "button__mark")

      if(todo.done===true){
        para.classList.add('done');
      }

      return todoNode;
    };

    // bind create todo form
    if (addTodoForm) {
      addTodoForm.addEventListener('submit', function(event) {
        // https://developer.mozilla.org/en-US/docs/Web/Events/submit
        // what does event.preventDefault do?
        // what is inside event.target?
        event.preventDefault();
        var description = event.target.description.value; // event.target ....
        if(!description){
          document.querySelector("#validateSpan").style.visibility = "visible";
        }
        else{
          var itemToAdd={done: false};
          document.querySelector("#validateSpan").style.visibility = "hidden";
          itemToAdd.description = description;

          // hint: todoFunctions.addTodo
          var newState = todoFunctions.addTodo(state, itemToAdd); // ?? change this!
          update(newState);

          formText.value="";
        }
      });
    }

    // LOCAL STORAGE ATTEMPT
    localStorage.setItem('state', JSON.stringify(state));
    myState = localStorage.getItem('state');
    console.log('myState: ', JSON.parse(myState));

    // you should not need to change this function
    var update = function(newState) {
      state = newState;
      localStorage.setItem('state', JSON.stringify(state));
      myState = localStorage.getItem('state');
      console.log('myState: ', JSON.parse(myState));
      renderState(state);
    };

    // you do not need to change this function
    var renderState = function(state) {
      var todoListNode = document.createElement('ul');
      todoListNode.setAttribute("class", "todos-list")
      state.forEach(function(todo) {
        todoListNode.insertBefore(createTodoNode(todo), todoListNode.childNodes[0]);
      });

      // you may want to add a class for css
      container.replaceChild(todoListNode, container.firstChild);
    };

    if (container) renderState(state);

    var styleInvalid = function(){
    document.querySelector("#input-form__text").style.property = "background-color: red;"
}

  })();
