const express=require('express');
const router=express.Router()
const controller=require('../controllers/todo')

router.get('/',controller.getAllTodos)

router.post('/',controller.createTodo)

router.patch('/:id',controller.updateTodo)

router.delete('/:id',controller.deleteTodo)

module.exports=router;