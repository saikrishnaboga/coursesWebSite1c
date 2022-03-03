import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import CoursesListItem from '../CoursesListItem'

import './index.css'

const apiStatusConstants = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, coursesList: []}

  componentDidMount() {
    this.coursesList()
  }

  coursesList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    // const {match} = this.props
    // const {params} = match
    // const {id} = params

    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedList = data.courses.map(eachItem => ({
        logoUrl: eachItem.logo_url,
        name: eachItem.name,
        id: eachItem.id,
      }))
      this.setState({
        coursesList: updatedList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {coursesList} = this.state

    return (
      <ul>
        {coursesList.map(eachItem => (
          <CoursesListItem CourseListItems={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader />
    </div>
  )

  retry = () => {
    this.coursesList()
  }

  renderFailureView = () => <FailureView onRetry={this.retry} />

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        // return this.renderFailureView()
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <nav className="nav">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/tech-era/website-logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
        </nav>
        <div>
          <h1>Courses</h1>
          {this.renderView()}
        </div>
      </div>
    )
  }
}

export default Home
