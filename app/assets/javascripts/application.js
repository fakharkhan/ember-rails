window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.FixtureAdapter.extend();


Todos.Router.map(function () {
    this.resource('todos', { path: '/' }, function () {
        // additional child routes
        this.route('active');
        this.route('completed');
    });
});


Todos.Todo = DS.Model.extend({
    title: DS.attr('string'),
    isCompleted: DS.attr('boolean')
});

Todos.Todo.FIXTURES = [
    {
        id: 1,
        title: 'Learn Ember.js',
        isCompleted: true
    },
    {
        id: 2,
        title: '...',
        isCompleted: false
    },
    {
        id: 3,
        title: 'Profit!',
        isCompleted: false
    }
];

Todos.TodosRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('todo');
    }
});

Todos.TodosIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('todos');
    }
});

Todos.TodosActiveRoute = Ember.Route.extend({
    model: function(){
        return this.store.filter('todo', function (todo) {
            return !todo.get('isCompleted');
        });
    },
    renderTemplate: function(controller){
        this.render('todos/index', {controller: controller});
    }
});

Todos.TodosCompletedRoute = Ember.Route.extend({
    model: function(){
        return this.store.filter('todo', function (todo) {
            return todo.get('isCompleted');
        });
    },
    renderTemplate: function(controller){
        this.render('todos/index', {controller: controller});
    }
});

Todos.TodosController = Ember.ArrayController.extend({
    actions: {
        createTodo: function () {
            // Get the todo title set by the "New Todo" text field
            var title = this.get('newTitle');
            if (!title.trim()) { return; }

            // Create the new Todo model
            var todo = this.store.createRecord('todo', {
                title: title,
                isCompleted: false
            });

            // Clear the "New Todo" text field
            this.set('newTitle', '');

            // Save the new model
            todo.save();
        },
        clearCompleted: function () {
            var completed = this.filterProperty('isCompleted', true);
            completed.invoke('deleteRecord');
            completed.invoke('save');
        }
    },
    remaining: function () {
        return this.filterBy('isCompleted', false).get('length');
    }.property('@each.isCompleted'),

    inflection: function () {
        var remaining = this.get('remaining');
        return remaining === 1 ? 'item' : 'items';
    }.property('remaining'),
    hasCompleted: function () {
        return this.get('completed') > 0;
    }.property('completed'),

    completed: function () {
        return this.filterProperty('isCompleted', true).get('length');
    }.property('@each.isCompleted'),
    allAreDone: function (key, value) {
        if (value === undefined) {
            return !!this.get('length') && this.everyBy('isCompleted', true);
        } else {
            this.setEach('isCompleted', value);
            this.invoke('save');
            return value;
        }
    }.property('@each.isCompleted')


});

Todos.TodoController = Ember.ObjectController.extend({
    actions: {
        removeTodo: function () {
            var todo = this.get('model');
            todo.deleteRecord();
            todo.save();
        },
        editTodo: function () {
            this.set('isEditing', true);
        } ,
        acceptChanges: function () {
            this.set('isEditing', false);

            if (Ember.isEmpty(this.get('model.title'))) {
                this.send('removeTodo');
            } else {
                this.get('model').save();
            }
        }
    },

    isEditing: false,

    isCompleted: function(key, value){
        var model = this.get('model');

        if (value === undefined) {
            // property being used as a getter
            return model.get('isCompleted');
        } else {
            // property being used as a setter
            model.set('isCompleted', value);
            model.save();
            return value;
        }
    }.property('model.isCompleted')
});

Todos.EditTodoView = Ember.TextField.extend({
    didInsertElement: function () {
        this.$().focus();
    }
});

Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);

