import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NewsList from './views/NewsList';
import NewsDetails from './views/NewsDetails';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/news?page=1" />} />
                    <Route path="/news" element={<NewsList />} />
                    <Route path="/article/:id" element={<NewsDetails />} />
                </Routes>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default App;
