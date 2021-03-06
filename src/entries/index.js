import React from 'react';
import ReactDOM from 'react-dom';
import App from '../app';
import {instance} from "../lib/shikimori-api";
import Loader from "../interface/share/loader";

if(localStorage.shikimori_session != null) {
	ReactDOM.render(<Loader />,
		document.getElementById('root__container'));
		
	instance().then((api) => {
		ReactDOM.render(<App />,
			document.getElementById('root__container'));
	});
} else {
	ReactDOM.render(<App />,
		document.getElementById('root__container'));
}
