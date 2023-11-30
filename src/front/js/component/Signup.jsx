import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { Navigate, useNavigate } from "react-router-dom"


const Signup = () => {
    const navigate = useNavigate()
    const { actions } = useContext(Context)

    const [user, setUser] = useState({
        email: "",
        password: "",
        role: ""

    })

    const handleChange = (event) => {
        event.preventDefault()
        setUser({
            ...user,
            [event.target.name]: event.target.value

        })

    }
    const handleSignUp = async (event) => {
        event.preventDefault()
        let response = await actions.registerUser(user)
        console.log(user)
        if (response) (
            navigate("/login")
        )
        console.log(response)
    }


    return (
        <>

            <form className="container" onSubmit={handleSignUp}>
                <h1 className="m-2 p-2">Sign Up</h1>
                <label >Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    className="form-control"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                />
                <label >Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                />

                <label >Rol</label>
                <select className="form-select" >
                    <option selected>Seleccion el rol asignado</option>
                    <option value="1">Admin</option>
                    <option value="2">General</option>
                    <option value="3">Guest</option>
                </select>

                <button className="m-2">Sign Up</button>
            </form>


        </>
    )
}

export default Signup