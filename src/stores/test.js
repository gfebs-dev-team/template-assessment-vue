import { defineStore } from 'pinia'
import { ref } from 'vue'
import views from '../views'
import { retrieveDataValue, storeDataValue, SetComplete, SetIncomplete } from '../assets/APIWrapper.js'

export const useTestStore = defineStore('test', () => {
  const current = ref(0)
  const questionList = ref(new Array())
  
  let slidesComp = Object.keys(views).map((key) => {
    return views[key]
  })

  const total = slidesComp.length - 1
  const disclaimer = ref(false)
  const complete = ref(false)

  const next = ref(true)
  const prev = ref(false)

  function goNext() {
    if (questionList.value[current.value].user == undefined && disclaimer.value == false) {
      disclaimer.value = true;
    } else {
      current.value++
    }
  }

  function goPrev() {
    current.value--
  }

  function disableNext() {
    next.value = false
  }

  function enableNext() {
    next.value = true
  }

  function disablePrev() {
    prev.value = false
  }

  function enablePrev() {
    prev.value = true
  }

  function getScore() {
    let correct =  0
    questionList.value.forEach((question)=>{
      if(question.user == null) {
        correct = 0;
        return
      }
      question.answer.forEach((answer)=>{
        if(answer == question.user) {
          correct++
          return
        }
      })
    })
    let score = Math.round((correct / total)*100)/100
    storeDataValue("cmi.score.scaled", score);
    //console.log(retrieveDataValue("cmi.scaled_passing_score"));
    if (score > retrieveDataValue("cmi.scaled_passing_score")) {
        SetComplete();
    } else {
        SetIncomplete();
    }
  
    return score
  }

  function addQuestion(q, t, a, v) {
    if (questionList.value[current.value] == null) {
      questionList.value[current.value] = {
        question: q,
        type: t,
        answer: a,
        viewed: v
      }
    }
  }

  function setInteractions() {
    const id = current.value
    const questionStart = new Date()
    const timestamp =
      questionStart.toISOString().slice(0, questionStart.toISOString().indexOf('.') + 2) + 'Z'
    questionList.value[id].startTime = new Date(questionStart)
    storeDataValue('cmi.interactions.' + id + '.id', 'question_' + id)
    storeDataValue('cmi.interactions.' + id + '.timestamp', timestamp)
    storeDataValue('cmi.interactions.' + id + '.type', questionList.value[id].type)
    questionList.value[id].answer.forEach((answer, i) => {
      storeDataValue('cmi.interactions.' + id + '.correct_responses.' + i + '.pattern', answer)
    })
  }

  function updateAnswer() {
    storeDataValue(
      'cmi.interactions.' + current.value + '.learner_response',
      questionList.value[current.value].user
    )
  }

  return {
    current,
    total,
    questionList,
    next,
    prev,
    disclaimer,
    complete,
    getScore,
    updateAnswer,
    addQuestion,
    setInteractions,
    disableNext,
    disablePrev,
    enableNext,
    enablePrev,
    goNext,
    goPrev
  }
})
