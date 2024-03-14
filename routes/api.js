/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const mongoose = require('mongoose');
var expect = require('chai').expect;
const Schema = require('mongoose').Schema;
const shortid = require('shortid');
const fs = require('fs');

const __dirnames = 'C:/Users/Steve/Documents/GitHub/message-board-project'

var messageThreadSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  board: String,
  text: String,
  created_on: {
    type: Date,
    default: new Date(),
  },
  bumped_on: {
    type: Date,
    default: new Date(),
  },
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: String,
  replies: [{
    _id: {
      type: String,
      default: shortid.generate(),
    },
    text: String,
    created_on: {
      type: Date,
      default: new Date(),
    },
    bumped_on: {
      type: Date,
      default: new Date(),
    },
    delete_password: String,
    reported: {
      type: Boolean,
      default: false,
    }
  }],
});

var messageBoard = mongoose.model('messagethread', messageThreadSchema);

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get((req, res) => {
      //res.send(req.params.board)
      /*
       * Need to sort by bumped on category
       * and get 3 most recent replies
      */
      messageBoard.find({ board: req.params.board }, '_id created_on bumped_on board text', { limit: 10 }, function (err, thread) {
        if (err) {
          console.log(err)
        } else {
         
          messageBoard.find({ board: req.params.board }, 'replies._id replies.text replies.created_on replies.bumped_on ', { limit: 10 }, function (err, reply) {
             
            if (err) {
              console.log(err)
            } else {
          
             // console.log("Replies: " + reply)
              let replyArr = []    
              
              reply.map((x, i) => {                
                if (x.replies.length !== 0) {                  
                  x.replies.map((comment, i) => {
                    
                    if (replyArr.length < 3) {
                     
                      replyArr.push(comment)          
                    } else {                      
                      for (let index = 0; index < 3; index++) {                                        
                          if (comment.bumped_on.getTime() > replyArr[index].bumped_on.getTime()) {
                            replyArr[index] = comment;
                            break;
                          }                  
                        }//end of for loop                      
                                   
                  }//endof length <= 3         
            
                
                })//end of thread map  
               }                 
              })     

              let allArr = thread.concat(replyArr)
            
             res.json(allArr)
         
            }// end of replies error
           

          })      
        }//end of find error if
      })
    })

    .post((req, res) => { 
 
      var thread = new messageBoard({
          _id: shortid.generate(),
          board: req.body.board,
          text: req.body.text,
          delete_password: req.body.delete_password
        });

        thread.save(function (err) {
          if (err) {
            return err
          } else {
            console.log("save worked")
          };
          // saved!
        });         
        res.render(__dirnames + '/views/board.pug', { title: 'TestingFORTOOLONG' })
   
        
    })    


    .put((req, res) => {
      messageBoard.findOneAndUpdate(req.body.thread_id, { reported: true }, (err, docs) => {
        if (err) {
          console.log(err)
        } else {
          res.send("Thread has been reported")
        }
      })
    })

    .delete((req, res) => {
  
      messageBoard.findOne({ _id: req.body.thread_id },
        function (err, result) {
        if (err) {
          console.log(err)
        } else {   
          if (result.delete_password === req.body.delete_password) {  
            messageBoard.findOneAndDelete({ _id: req.body.thread_id }, function (err, docs) {
              if (err) {
                console.log(err)
              } else {
                res.send("Thread is deleted")
              }
            })
          } else {
            res.send("Password is incorrect")
          }
        }//end of else statement
      })//end of findOne
    })


  app.route('/api/replies/:board')
    .get((req, res) => {

      messageBoard.findOne({ _id: req.query.thread_id }, '_id created_on bumped_on board text replies',
        function (err, thread) {
          res.json(thread)
        })


    })

    .post((req, res) => {

      messageBoard.findOneAndUpdate({_id: req.body.thread_id }, {
        $push: {
          replies: {
            _id: shortid.generate(),
            text: req.body.text,
            delete_password: req.body.delete_password
          }
        }
      }, function (err, result) {

        if (err) {
          console.log(err)
        } else {      
          res.render(__dirnames + '/views/board.pug', { title: 'TestingFORTOOLONG' });    
        }

      })
    })

    .put((req, res) => {

      messageBoard.findOne({ _id: req.body.thread_id },
        function (err, result) {
          if (err) {
            console.log(err)
          } else {
            let index = result.replies.map(function (x, i) {
              if (x._id === req.body.reply_id) {
                return i;
              }//end of if statement
            })//end of map 
            const lastNum = JSON.stringify(index).length - 1;

            const chkNum = JSON.stringify(index).substring(1, lastNum)
            const arrLoc = parseInt(chkNum.split(',').filter((x, i, a) => {
              return x !== 'null'
            }))

            let chnQuery = "replies." + arrLoc + "._id"
            let chnQuery1 = "replies." + arrLoc + ".reported"

            var query = {
              '_id': req.body.thread_id,
              [chnQuery]: req.body.reply_id
            }

            var event = {
              [chnQuery1]: true
            }

            messageBoard.findOneAndUpdate(query,
              event,
              { new: true }, function (err, docs) {
                if (err) {
                  console.log(err)
                } else {
                  console.log('no error')
                  res.send("Reply has been reported")
                }
              })
          }//end of else   
        })//end of err, result function   
    })//end of put route  

    .delete((req, res) => {
      let threadLoc;

      messageBoard.findOne({ _id: req.body.thread_id }, function (err, result) {
        if (err) {
          console.log(err)
        } else {
 
          let index = result.replies.map(function (x, i) {
            if (x._id === req.body.reply_id) {
              return i;
            }//end of if statement
          })//end of map 
          const lastNum = JSON.stringify(index).length - 1;

          const chkNum = JSON.stringify(index).substring(1, lastNum)
          const arrLoc = parseInt(chkNum.split(',').filter((x, i, a) => {
            return x !== 'null'
          }))
          
          const rmvArr = result.replies[arrLoc]  

          if (result.replies[arrLoc].delete_password == req.body.delete_password) {

            rmvArr.remove();
            result.save();   
            res.send("Comment deleted")
          } else {
            res.send("Incorrect Password")
          }
        }
      })
    })
};
