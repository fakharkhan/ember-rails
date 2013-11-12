EmberRails::Application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :todos
    end
  end
  resources :todos

  root :to => 'application#home'
end
