import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { Button, Form, Alert } from 'react-bootstrap'

class RecommendationForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      recommendation: undefined,
      source: 'new york',
      destination: 'las vegas',
      departureDate: moment().format('L'),
      returnDate: moment().add(5, 'days').format('L')
    }
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.travelAlert = this.travelAlert.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (name, event) {
    this.setState({
      [name]: event.target.value
    })
  }

  async handleButtonClick (e) {
    e.preventDefault()
    console.log('in handleButtonClick with: ', this.state)
    const { source, destination, departureDate, returnDate } = this.state
    try {
      const res = await axios.get('http://localhost:5000/travel/recommendation', {
        params: {
          source, destination, departureDate, returnDate
        }
      })
      console.log(res)
      this.setState({ recommendation: res.data.travel })
    } catch (e) {
      console.log('got error: ', e)
      this.setState({ recommendation: undefined })
    }
  }

  travelAlert () {
    const { recommendation } = this.state
    if (recommendation === undefined) {
      return (
        <Alert variant='danger' style={{ marginTop: 20 }}>
          An error has occurred!
        </Alert>
      )
    }
    else {
      return (
        <Alert variant={recommendation ? 'success' : 'warning'} style={{ marginTop: 20 }}>
          {recommendation ? 'go for it!' : 'don\'t go!'}
        </Alert>
      )
    }
  }

  render () {
    return (
      <Form>
        <Form.Group controlId='exampleForm.ControlInput1'>
          <Form.Label>Source Location</Form.Label>
          <Form.Control
            type='text' value={this.state.source}
            onChange={this.handleInputChange.bind(this, 'source')}
          />
        </Form.Group>
        <Form.Group controlId='exampleForm.ControlInput2'>
          <Form.Label>Destination Location</Form.Label>
          <Form.Control
            type='text' value={this.state.destination}
            onChange={this.handleInputChange.bind(this, 'destination')}
          />
        </Form.Group>
        <Form.Group controlId='exampleForm.ControlInput3'>
          <Form.Label>From Date</Form.Label>
          <Form.Control
            type='text' value={this.state.departureDate}
            onChange={this.handleInputChange.bind(this, 'departureDate')}
          />
        </Form.Group>
        <Form.Group controlId='exampleForm.ControlInput4'>
          <Form.Label>To Date</Form.Label>
          <Form.Control
            type='text' value={this.state.returnDate}
            onChange={this.handleInputChange.bind(this, 'returnDate')}
          />
        </Form.Group>
        <Button variant='primary' type='button' onClick={this.handleButtonClick}>
          Check For Travel Recommendation
        </Button>
        {this.travelAlert()}
      </Form>
    )
  }
}

export default RecommendationForm
