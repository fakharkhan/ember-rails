class Todo < ActiveRecord::Base
  attr_accessible :isCompleted, :title
end
