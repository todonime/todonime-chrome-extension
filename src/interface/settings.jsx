import React, { Component } from "react";
import ReactDOM from 'react-dom';
import API, {authorize} from '../model/api';
import {Loader} from './misc.jsx';

export class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authed: false,
			loaded: false
		}
		
		this.__api = null;
	}
	
	componentDidMount() {
		if(!API.isAuth()) {
			this.setState(Object.assign(this.state,{
				loaded: true
			}))
			return;
		}
		this.__auth();
		
		addEventListener('storage', (e) => {
			if(!e.key == 'shikimori_session') return;
			
			if(e.newValue !== undefined && !this.state.authed) {
				this.__auth();
			} else {
				this.setState(Object.assign(this.state,{
					authed: false
				}));
			}
		});
	}
	
	__auth() {
		authorize({
			responseType: 'code',
			redirectUri: chrome.identity.getRedirectURL('provider_cb')
		})
		.then(api => {
			this.__api = api;
			this.setState(Object.assign(this.state,{
				loaded: true,
				authed: true
			}));
		})
	}
	
	onExit() {
		localStorage.removeItem('shikimori_session');
		this.setState(Object.assign(this.state,{
			authed: false
		}));
	}
	
	mainAccount() {
		var cUser = this.__api.getCurrentUser();
		return (
			<div>
				<img src={cUser.image.x48} />
				<span>{cUser.nickname}</span><br/>
				<button onClick={this.onExit.bind(this)}>Отключить</button>
			</div>
		);
	}
	
	authorizate() {
		return (
			<div>
				<p>Аккаунт не подключен</p>
				<button onClick={this.__auth.bind(this)}>Подключить</button>
			</div>
		);
	}
	
	render() {
		return (
			<div className="account__container">
			{this.state.loaded == false ? <Loader /> : null}
			{this.state.authed
				? this.mainAccount()
				: this.authorizate()}
			</div>
		)
	}
}