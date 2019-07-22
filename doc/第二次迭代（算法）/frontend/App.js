import React from 'react';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import test from "./test"

class App extends React.Component {
    render(){
        return(
            <Router >
                <div>
                    <Route path="/" component={test} />
                </div>
            </Router>
        )
    }
}
export default App;