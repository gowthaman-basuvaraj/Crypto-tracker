import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import Header from './components/Header';
import Coinpage from './Pages/Coinpage';
import Homepage from './Pages/Homepage';
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));
function App() {


  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<Coinpage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
