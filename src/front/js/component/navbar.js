import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { actions } = useContext(Context)
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">

				<div className="ml-auto">
					<Link to="/private">
						<button className="btn btn-primary">private users list</button>
					</Link>
					<Link to="/login">
						<button onClick={() => { actions.logout() }} className="m-2 btn btn-primary">Logout</button>
					</Link>

				</div>
			</div>
		</nav>
	);
};