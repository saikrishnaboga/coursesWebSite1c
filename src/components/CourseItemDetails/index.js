import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class CourseItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseDetails: {}}

  componentDidMount() {
    this.courseDetails()
  }

  courseDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const apiUrl = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      console.log(data.course_details)
      const courseItem = data.course_details
      const updatedCoursesDetails = {
        description: courseItem.description,
        id: courseItem.id,
        imageUrl: courseItem.image_url,
        name: courseItem.name,
      }
      this.setState({
        courseDetails: updatedCoursesDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  retry = () => {
    this.courseDetails()
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader />
    </div>
  )

  renderFailureView = () => <FailureView onRetry={this.retry} />

  renderSuccessView = () => {
    const {courseDetails} = this.state
    const {description, imageUrl, name} = courseDetails
    return (
      <div>
        <img src={imageUrl} alt={name} />
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
    )
  }

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
    // console.log(this.props)
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
        {this.renderView()}
      </div>
    )
  }
}

export default CourseItemDetails
