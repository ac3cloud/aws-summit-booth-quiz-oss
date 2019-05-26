import React, { Component } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

const listQuestions = `query listQuestions {
  listQuestions(limit: 20){
    items{
      id
      question
      answers
      answer
    }
  }
}`

const addCompetitor = `mutation createCompetitor($email:String! $name:String! $phone:String! $starttime:String! $endtime:String! $answers:String! $result:String!) {
  createCompetitor(input:{
    email:$email
    phone:$phone
    name:$name
    starttime:$starttime
    endtime:$endtime
    answers:$answers
    result:$result
  }){
    id
    email
    starttime
    endtime
    answers
    result
  }
}`

class Answers extends Component {
  render() {
    if (typeof this.props.value['answers'] != 'undefined') {
      var answers = this.props.value['answers'];
      var classgroup = [
        "list-group-item list-group-item-danger",
        "list-group-item list-group-item-success",
        "list-group-item list-group-item-warning"
      ]
      var answerList = answers.map(function(answer, index){
        return <li className={classgroup[index]} key={index}> <label> <input id={answers+index} accessKey={index+1} type="radio" value={answer} name="answers" />&nbsp; &nbsp;{answer}</label></li> // eslint-disable-line jsx-a11y/no-access-key
      })
      return answerList
    } else {
      return (
        <br />
      )
    }
  }
}

class QuestionTime extends Component {

  componentWillMount() {
    this.listQuery();
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      questioncount: 1,
      question: {},
      answers: {},
      email: null,
      phone: null,
      name: null,
      starttime: null,
      endtime: null,
      correctcount: null,
      finished: false
    };
  }

  mutationCompetitor = async () => {
    const details = {
      email: this.state.email,
      phone: this.state.phone,
      name: this.state.name,
      starttime: this.state.starttime,
      endtime: this.state.endtime,
      answers: this.state.answers,
      result: this.state.correctcount
    };
    console.log(details);

    const newEvent = await API.graphql(graphqlOperation(addCompetitor, details));
    console.log(newEvent);
  }

  listQuery = async () => {
    const allQuestions = await API.graphql(graphqlOperation(listQuestions));
    this.setState({data: allQuestions['data']['listQuestions']['items']});
    this.setState({question: this.state.data[0]});
  }

  nextQuestion = async () => {
    this.setState({questioncount: this.state.questioncount + 1})
    if ( this.state.questioncount < this.state.data.length ) {
      this.setState({question: this.state.data[this.state.questioncount]})
      console.log(this.state.questioncount)
      const uncheckitems = document.getElementsByName("answers");
      for (var i=0; i<uncheckitems.length; i++) {
        document.getElementById(uncheckitems[i]['id']).checked=false;
      }
    } else {
      await this.markexam();
      var d = new Date();
      var n = d.getTime();
      this.setState({
        endtime: n
      },this.mutationCompetitor
      )
      this.setState({question: {}});
      this.setState({finished: true})
      console.log("finished");
    }
  }

  markexam = async () => {
    var result = 0;
    for (var i=0; i<this.state.data.length; i++) {
      if (this.state.data[i]['answer'] === this.state.answers[this.state.data[i]['id']]) {
        result++;
      }
    }
    console.log(result);
    this.setState({correctcount: result})
  }

  handleSubmit = formevent => {
    formevent.preventDefault();
    console.log(formevent.target.elements.answers.value);
    var stateCopy = Object.assign({}, this.state);
    stateCopy.answers[this.state.question['id']] = formevent.target.elements.answers.value;
    this.setState(stateCopy);
    console.log(this.state.answers);
    this.nextQuestion();
  }

  handleEmail = emailevent => {
    emailevent.preventDefault();
    console.log(emailevent.target.elements.email.value);
    this.setState({
      email: emailevent.target.elements.email.value
    });
    this.setState({
      name: emailevent.target.elements.name.value
    });
    this.setState({
      phone: emailevent.target.elements.phone.value
    });
    var d = new Date();
    var n = d.getTime();
    this.setState({
      starttime: n
    })
  }

  reload = () => {
    window.location.reload();
  }

  render() {
      var content;
      if (this.state.finished) {
        content =
          <div>
            <div className="row">
              &nbsp;
            </div>
            <div className="row">
              <div className="col-sm">
                You finished in {Math.round((this.state.endtime - this.state.starttime)/1000)} seconds.
              </div>
              <div className="col-sm">
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                You got { this.state.correctcount } out of { this.state.data.length } correct
              </div>
              <div className="col-sm">
              </div>
            </div>
            <hr className="my-4" />
            <div className="row">
              <div className="col-sm">
                <button className="btn-ac3" value="Try Again" onClick={this.reload}>Try Again</button>
              </div>
              <div className="col-sm">
              </div>
            </div>
          </div>
      } else if (this.state.email === null) {
        content =
          <div>
            <div className="jumbotron">
              <h1 className="display-4">Welcome to Auckland AWS User Group Quiz</h1>
              <p className="lead">Do you believe you are an expert in AWS, Agile and DevOps?</p>
              <p>Go ahead, and give the questionnaire a try.</p>
            </div>
            <div className="row">
              &nbsp;
            </div>
            <form onSubmit={this.handleEmail}>
              <div className="row">
                <div className="col-sm">
                  <input type="name" className="form-control" id="InputName" required placeholder="Enter your name" name='name' />
                </div>
                <div className="col-sm">
                </div>
              </div>
              <div className="row">
              &nbsp;
              </div>
              <div className="row">
                <div className="col-sm">
                  <input type="email" className="form-control" id="InputEmail" required placeholder="Enter your email" name='email' />
                </div>
                <div className="col-sm">
                </div>
              </div>
              <div className="row">
              &nbsp;
              </div>
              <div className="row">
                <div className="col-sm">
                  <input type="phone" className="form-control" id="InputPhone" required placeholder="Enter your phone" name='phone' />
                </div>
                <div className="col-sm">
                </div>
              </div>
              <div className="row">
              &nbsp;
              </div>
              <div className="row">
                <div className="col-sm">
                  <button className="btn-ac3" type="submit">Begin the Questions</button>
                </div>
                <div className="col-sm">
                </div>
              </div>
            </form>
          </div>
       } else {
        content =
          <div style={{"fontSize": "120%", "fontWeight": "600"}}>
              <div className="row">
                &nbsp;
              </div>
              <div className="row">
              <div className="col">
                { this.state.question['question'] }
              </div>
            </div>
            <hr className="my-4" />
            <div className="row">
              <div className="col">
                <form onSubmit={this.handleSubmit}>
                  <ul className="list-group">
                    <Answers value={this.state.question} />
                  </ul>
              <div className="row">
                &nbsp;
              </div>
                <button className="btn-ac3" type="submit">Submit your answer</button>
                </form>
              </div>
            </div>
          </div>
      }
    return (
      <div>
        { content }
      </div>
    )
  }
}

export default QuestionTime
