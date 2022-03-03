import {Link} from 'react-router-dom'
import './index.css'

const CoursesListItem = props => {
  const {CourseListItems} = props
  const {id, logoUrl, name} = CourseListItems

  return (
    <li>
      <Link to={`/courses/${id}`}>
        <img src={logoUrl} alt={name} />
        <p>{name}</p>
      </Link>
    </li>
  )
}

export default CoursesListItem
