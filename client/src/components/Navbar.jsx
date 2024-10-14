// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import logo from '../assets/ln.jpg'; // Import your logo image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faHome } from '@fortawesome/free-solid-svg-icons'; // Import icons
import '../css/Navbar.css'; // Import the CSS file for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Liquor Management System Logo" className="logo" />
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li>
          <Link to="/liqour">
            <FontAwesomeIcon icon={faPlus} /> Liquor
          </Link>
        </li>
        <li>
          <Link to="/inventory">
            <FontAwesomeIcon icon={faList} /> Sales Inventory
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
