Todos.Todo = DS.Model.extend({
    title: DS.attr('string'),
    isCompleted: DS.attr('boolean')
});


Todos.Router.map(function () {
    this.resource('todos', { path: '/' }, function () {
        // additional child routes
        this.route('active');
        this.route('completed');
    });
});

Todos.TodosIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('todos');
        // var store = this.get('store');
        // return store.findAll('todo');
    }
});


Todos.TodosRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('todo');
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