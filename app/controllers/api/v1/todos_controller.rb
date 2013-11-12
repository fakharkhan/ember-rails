class Api::V1::TodosController < ApplicationController

  respond_to :json

  def index
    respond_with Todo.all
  end

  def show
    respond_with Todo.find(params[:id])
  end

  def new
    respond_with Todo.new
  end

  def create
    @todo = Todo.new(params[:todo])
    respond_to do |format|
      if @todo.save
        format.json { render json: @todo, status: :created, location: @todo }
      else
        format.json { render json: @todo.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @todo = Todo.find(params[:id])
    respond_to do |format|
      if @todo.update_attributes(params[:todo])
        format.json { head :no_content }
      else
        format.json { render json: @todo.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
