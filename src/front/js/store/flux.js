const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			token: localStorage.getItem("token") || null,
			users: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			login: async (data) => {
				let store = getStore()

				try {
					let response = await fetch(`${process.env.BACKEND_URL}/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(data)
					})

					if (response.ok) {
						let result = await response.json()
						console.log(result)
						setStore({
							token: result.token
						})
						localStorage.setItem("token", result.token)
						return response.status
					}
					return response.status

				} catch (error) {
					console.log(error)
				}
			},
			getUsers: async () => {
				const store = getStore()
				try {
					let response = await fetch(`${process.env.BACKEND_URL}/private`, {
						headers: {
							"Authorization": `Bearer ${store.token}`
						}
					})
					if (response.ok) {
						let result = await response.json()
						setStore({
							users: result
						})

					}
					if (response.status == 401) {
						getActions().logout()
					}
				} catch (error) {
					console.log(error)

				}
			},
			logout: () => {
				setStore({
					token: null
				})
				localStorage.removeItem("token")
			},

			registerUser: async (user) => {
				try {
					let response = await fetch(`${process.env.BACKEND_URL}/signup`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(user)
					}
					)
					const data = await response.json()
					if (response.ok) {
						return true
					}
					else {
						return false
					}

				} catch (error) {
					console.log(error)
				}



			}

		}
	};
};

export default getState;